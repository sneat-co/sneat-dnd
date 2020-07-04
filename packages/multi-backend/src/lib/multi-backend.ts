import {PreviewList} from './preview-list';
import {Backend, DragDropManager} from 'dnd-core';
import {IPreview, ITransition} from './interfaces';

export const multiBackendFactory = (manager: DragDropManager, context, options: any) => {
  return new MultiBackend(manager, context, options);
};

let isSetUp = false;

interface BackendConfig {
  backend: (manager, context, options) => Backend;
  transition?: ITransition;
  preview?: IPreview;
  options?: any;
  skipDispatchOnTransition?: boolean | 1 | 0 | 'true' | 'yes';
}

interface BackendItem {
  instance: Backend;
  preview: boolean;
  transition: ITransition;
  skipDispatchOnTransition: boolean;
}

export class MultiBackend implements Backend {
  private current = 0;
  private readonly previews = new PreviewList();
  private backends: BackendItem[] = [];
  private nodes: { [id: string]: any } = {};

  constructor(manager: DragDropManager, context, sourceOptions) {
    const options = Object.assign({backends: []}, sourceOptions || {});

    if (options.backends.length < 1) {
      throw new Error(
        `You must specify at least one Backend, if you are coming from 2.x.x (or don't understand this error)
        see this guide: https://github.com/louisbrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#migrating-from-2xx`
      );
    }

    options.backends.forEach((backend: BackendConfig) => {
      if (!backend.backend) {
        throw new Error(`You must specify a 'backend' property in your Backend entry: ${backend}`);
      }
      const transition = backend.transition;
      // @ts-ignore
      if (transition && !transition._isMBTransition) {
        throw new Error(
          `You must specify a valid 'transition' property (either undefined or the return of 'createTransition') in your Backend entry: ${backend}`
        );
      }
      this.backends.push({
        instance: backend.backend(manager, context, backend.options),
        preview: (!!backend.preview || false),
        transition,
        skipDispatchOnTransition: Boolean(backend.skipDispatchOnTransition),
      });
    });
  }

  public profile(): Record<string, number> {
    return {}; // TODO: Implement properly
  }

  // DnD Backend API
  public setup = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (isSetUp) {
      throw new Error('Cannot have two MultiBackends at the same time.');
    }
    isSetUp = true;
    this.addEventListeners(window);
    this.backends[this.current].instance.setup();
  }

  public teardown = () => {
    if (typeof window === 'undefined') {
      return;
    }

    isSetUp = false;
    this.removeEventListeners(window);
    this.backends[this.current].instance.teardown();
  }

  public connectDragSource = (...args) => {
    return this.connectBackend('connectDragSource', args);
  }
  public connectDragPreview = (...args) => {
    return this.connectBackend('connectDragPreview', args);
  }
  public connectDropTarget = (...args) => {
    return this.connectBackend('connectDropTarget', args);
  }

  // Used by Preview component
  // noinspection JSUnusedGlobalSymbols
  public previewEnabled = () => {
    return this.backends[this.current].preview;
  }

  // Multi Backend Listeners
  private addEventListeners = (target) => {
    this.backends.forEach((backend) => {
      if (backend.transition) {
        target.addEventListener(backend.transition.event, this.backendSwitcher, true);
      }
    });
  }

  private removeEventListeners = (target) => {
    this.backends.forEach((backend) => {
      if (backend.transition) {
        target.removeEventListener(backend.transition.event, this.backendSwitcher, true);
      }
    });
  }

  // Switching logic
  private backendSwitcher = (event) => {
    const oldBackend = this.current;

    let i = 0;
    this.backends.some((backend) => {
      if (i !== this.current && backend.transition && backend.transition.check(event)) {
        this.current = i;
        return true;
      }
      i += 1;
      return false;
    });

    if (this.current !== oldBackend) {
      this.backends[oldBackend].instance.teardown();
      Object.keys(this.nodes).forEach((id) => {
        const node = this.nodes[id];
        node.handler();
        node.handler = this.callBackend(node.func, node.args);
      });
      this.previews.backendChanged(this);

      const newBackend = this.backends[this.current];
      newBackend.instance.setup();

      if (newBackend.skipDispatchOnTransition) {
        return;
      }

      let newEvent: Event;
      try {
        newEvent = new event.constructor(event.type, event);
      } catch (e) {
        newEvent = document.createEvent('Event');
        newEvent.initEvent(event.type, event.bubbles, event.cancelable);
      }
      event.target.dispatchEvent(newEvent);
    }
  }

  callBackend = (func, args) => {
    return this.backends[this.current].instance[func](...args);
  }

  connectBackend = (func, args) => {
    const nodeId = `${func}_${args[0]}`;
    const handler = this.callBackend(func, args);
    this.nodes[nodeId] = {func, args, handler};

    return (...subArgs) => {
      const r = this.nodes[nodeId].handler(...subArgs);
      delete this.nodes[nodeId];
      return r;
    };
  }
}
