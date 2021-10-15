import {createTransition} from './create-transition';

export const TouchTransition = createTransition('touchstart', (event: Event) => {
  return !!(event as TouchEvent);
});

export const HTML5DragTransition = createTransition('dragstart', (event: Event) => {
  if (event.type) {
    return event.type.indexOf('drag') !== -1 || event.type.indexOf('drop') !== -1;
  }
  return false;
});

export const MouseTransition = createTransition('mousedown', (event) => {
  if (event.type) {
    return event.type.indexOf('touch') === -1 && event.type.indexOf('mouse') !== -1;
  }
  return false;
});
