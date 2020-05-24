/* String, symbol, or an array of either. Used on drop targets. */
export type TypeOrTypeArray = string | symbol | Array<string | symbol>;

/* Just a plain, reusable {x,y} coordinate type. */
export interface IOffset {

  /** x coordinate */
  x: number;

  /** y coordinate */
  y: number;
}
