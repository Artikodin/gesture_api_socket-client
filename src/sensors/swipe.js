import Hammer from 'hammerjs';

const touchDetection = document.querySelector('#touchDetection');

export const swipeSensor = new Hammer(touchDetection);

swipeSensor.get('swipe').set({
  direction: Hammer.DIRECTION_ALL,
  threshold: 1,
  velocity: 0.1
});
