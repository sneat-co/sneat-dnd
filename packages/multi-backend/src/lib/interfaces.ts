import {Backend} from 'dnd-core';

export interface IPreview {
  backendChanged(backend: Backend);
}

// tslint:disable-next-line:no-empty-interface
export interface ITransition {
  event: any;
  check: (event: any) => any;
}
