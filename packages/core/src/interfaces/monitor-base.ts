import {IOffset} from './type-ish';

/* The methods common to all monitor classes. */
export interface IMonitorBase<Item> {

  /* The type of the item in transit. Returns `null` if no item is being dragged. */
  getItemType(): string | symbol | null;

  /* The item in transit, if any. This is what you returned from
   * {@link IDragSourceSpec#beginDrag}. Returns `null` if no item is being dragged. */
  getItem(): Item | null;

  /* The initial mouse x,y position relative to the viewport, when the current
   * drag operation started. Returns `null` if no item is being dragged. */
  getInitialClientOffset(): IOffset | null;

  /* x,y relative to viewport of the item's DOM element before it was dragged.
   * Returns `null` if no item is being dragged. */
  getInitialSourceClientOffset(): IOffset | null;

  /* The current mouse x,y position relative to the viewport. Returns `null`
   * if no item is being dragged. */
  getClientOffset(): IOffset | null;

  /* A vector x,y of the displacement of the dragged item from its initial
   * position. Returns `null` if no item is being dragged. */

  getDifferenceFromInitialOffset(): IOffset | null;

  /* The projected x,y position relative to viewport of the root DOM element of the drag source
   * = its initial position + displacement. Returns `null` if no item is
   * being dragged. */
  getSourceClientOffset(): IOffset | null;
}
