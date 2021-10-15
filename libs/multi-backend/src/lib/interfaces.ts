import {Backend} from 'dnd-core';

export interface IPreview {
  backendChanged(backend: Backend): unknown;
}

// tslint:disable-next-line:no-empty-interface
export interface ITransition {
  event: string;
  check: (event: unknown) => unknown;
}
