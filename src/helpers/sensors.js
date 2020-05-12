/**
 *
 * This initialize a sensor on web page. It check if all permissions was allowed.
 * For further infos please check the doc : https://w3c.github.io/orientation-sensor/#model
 *
 * @param {Object} sensor - The sensor you want to init
 *
 */
export const initSensor = sensor => {
  if (navigator.permissions != null) {
    Promise.all([
      navigator.permissions.query({ name: 'accelerometer' }),
      navigator.permissions.query({ name: 'magnetometer' }),
      navigator.permissions.query({ name: 'gyroscope' })
    ]).then(results => {
      if (results.every(result => result.state === 'granted')) {
        sensor.start();
        sensor.onerror = event => console.log(event.error.name, event.error.message);
      } else {
        console.log('No permissions to use the sensor.');
      }
    });
  } else {
    if (
      typeof DeviceMotionEvent.requestPermission === 'function' &&
      typeof DeviceOrientationEvent.requestPermission == 'function'
    ) {
      Promise.all([
        DeviceMotionEvent.requestPermission(),
        DeviceOrientationEvent.requestPermission()
      ]).then(results => {
        if (results.every(result => result === 'granted')) {
          sensor.start();
          sensor.onerror = event => console.log(event.error.name, event.error.message);
        } else {
          console.log('No permissions to use the sensor.');
        }
      });
    } else {
      console.log('Too old iOS device or no permissions to use the sensor.');
    }
  }
};
