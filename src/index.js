import { AbsoluteOrientationSensor } from 'motion-sensors-polyfill';
import { initSensor } from './helpers';

const orientationSensor = new AbsoluteOrientationSensor({
  frequency: 60,
  referenceFrame: 'device'
});

const socket = new WebSocket('wss://192.168.0.40:8081');

if (
  typeof DeviceMotionEvent.requestPermission === 'function' &&
  typeof DeviceOrientationEvent.requestPermission == 'function'
) {
  document.querySelector('#square').addEventListener('click', initialize);
} else {
  initialize();
}

function initialize() {
  document.querySelector('#square').removeEventListener('touchstart', initialize);
  initSensor(orientationSensor);

  socket.onopen = () => {
    orientationSensor.onreading = () => {
      const [x, y, z, w] = orientationSensor.quaternion;
      console.log({ x, y, z, w });
      socket.send(JSON.stringify({ x, y, z, w }));
    };
    socket.onmessage = event => {
      let data = event.data;
      console.log(data);
    };
  };
}
