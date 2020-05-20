import { RelativeOrientationSensor } from 'motion-sensors-polyfill';

export const orientationSensor = new RelativeOrientationSensor({
  frequency: 60,
  referenceFrame: 'device'
});
