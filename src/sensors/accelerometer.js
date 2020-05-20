import { LinearAccelerationSensor } from 'motion-sensors-polyfill';

export const accelerationSensor = new LinearAccelerationSensor({
  frequency: 60,
  referenceFrame: 'device'
});
