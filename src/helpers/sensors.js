import { swipeSensor, orientationSensor, accelerationSensor } from '../sensors';
import { socket } from '../socket';
import { formatTo100th } from './format';

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

export const retrieveSensor = () => {
  const sensor = localStorage.getItem('sensor');
  sensor && initialUpdateSensor(sensor);
};

export const initialUpdateSensor = sensor => {
  if (localStorage.getItem('sensor') !== sensor) {
    persistSensor(sensor);
  }
  toggleSensorElement(sensor);
  switchSensor(sensor);
};

export const updateSensor = sensor => {
  if (localStorage.getItem('sensor') !== sensor) {
    persistSensor(sensor);
    toggleSensorElement(sensor);
    switchSensor(sensor);
  }
};

const persistSensor = sensor => {
  localStorage.setItem('sensor', sensor);
};

const toggleSensorElement = sensor => {
  resetElement();
  const sensorElement = document.querySelector(`#${sensor}`);
  sensorElement.classList.add('activatedSensor');
};

const switchSensor = sensor => {
  const sensorActions = {
    gyroscope: () => {
      resetSensors();
      initSensor(orientationSensor);
      orientationEvent();
    },
    accelerometer: () => {
      resetSensors();
      initSensor(accelerationSensor);
      accelerationEvent();
    },
    swipe: () => {
      resetSensors();
      swipeEvent();
    }
  };
  sensorActions[sensor]() || null;
};

const resetElement = () => {
  const gyroscopeElement = document.querySelector(`#gyroscope`);
  const accelerometerElement = document.querySelector(`#accelerometer`);
  const swipeElement = document.querySelector(`#swipe`);

  gyroscopeElement.classList.contains('activatedSensor') &&
    gyroscopeElement.classList.remove('activatedSensor');
  accelerometerElement.classList.contains('activatedSensor') &&
    accelerometerElement.classList.remove('activatedSensor');
  swipeElement.classList.contains('activatedSensor') &&
    swipeElement.classList.remove('activatedSensor');
};

const swipeEvent = () => {
  swipeSensor.on('swipeup swipedown swipeleft swiperight', event => {
    const { velocity, angle } = event;
    console.log({ velocity, angle });
    socket.send(JSON.stringify({ velocity, angle }));
  });
};

const accelerationEvent = () => {
  accelerationSensor.onreading = () => {
    const { x, y, z } = accelerationSensor;
    console.log({
      x: formatTo100th(x),
      y: formatTo100th(y),
      z: formatTo100th(z)
    });
    socket.send(
      JSON.stringify({
        x: formatTo100th(x),
        y: formatTo100th(y),
        z: formatTo100th(z)
      })
    );
  };
};

const orientationEvent = () => {
  orientationSensor.onreading = () => {
    const [x, y, z, w] = orientationSensor.quaternion;
    console.log({
      x: formatTo100th(x),
      y: formatTo100th(y),
      z: formatTo100th(z),
      w: formatTo100th(w)
    });
    socket.send(
      JSON.stringify({
        x: formatTo100th(x),
        y: formatTo100th(y),
        z: formatTo100th(z),
        w: formatTo100th(w)
      })
    );
  };
};

const resetSensors = () => {
  swipeSensor.off('swipeup swipedown swipeleft swiperight');
  accelerationSensor.activated && accelerationSensor.stop();
  orientationSensor.activated && orientationSensor.stop();
};
