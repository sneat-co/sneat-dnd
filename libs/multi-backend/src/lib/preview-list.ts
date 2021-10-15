import {IPreview} from './interfaces';
import {Backend} from 'dnd-core';

export class PreviewList {
  private readonly previews: IPreview[] = [];

  // constructor() {
  //   this.previews = [];
  // }

  register = (preview: IPreview): void => {
    this.previews.push(preview);
  }

  unregister = (preview: IPreview): void => {
    let index;
    // tslint:disable-next-line:no-conditional-assignment
    while ((index = this.previews.indexOf(preview)) !== -1) {
      this.previews.splice(index, 1);
    }
  }

  backendChanged = (backend: Backend) => {
    for (const preview of this.previews) {
      preview.backendChanged(backend);
    }
  }
}
