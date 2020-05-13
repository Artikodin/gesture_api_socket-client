import { RelativeOrientationSensor, LinearAccelerationSensor } from 'motion-sensors-polyfill';
import { initSensor } from './helpers';
import './helpers/noSleep';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('guid') != null) {
  localStorage.setItem('guid', urlParams.get('guid'));
  history.replaceState({}, document.title, '/');
}

let guid = localStorage.getItem('guid');

const orientationSensor = new RelativeOrientationSensor({
  frequency: 60,
  referenceFrame: 'device'
});

const accelerationSensor = new LinearAccelerationSensor({
  frequency: 60,
  referenceFrame: 'device'
});

const socket = new WebSocket('wss://192.168.0.40:8081');

const noSleepButton = document.querySelector('#noSleep');

if (
  typeof DeviceMotionEvent.requestPermission === 'function' &&
  typeof DeviceOrientationEvent.requestPermission == 'function'
) {
  noSleepButton.addEventListener('click', initSocket);
} else {
  initSocket();
}
const formatTo100th = number => parseFloat(number.toFixed(3));

function initSocket() {
  noSleepButton.removeEventListener('touchstart', initSocket);
  // initSensor(orientationSensor);
  initSensor(accelerationSensor);

  socket.onopen = () => {
    socket.send({ guid });

    accelerationSensor.onreading = () => {
      const { x, y, z } = accelerationSensor;
      console.log({ x, y, z });
      socket.send(
        JSON.stringify({
          x: formatTo100th(x),
          y: formatTo100th(y),
          z: formatTo100th(z)
        })
      );
    };
    // orientationSensor.onreading = () => {
    //   const [x, y, z, w] = orientationSensor.quaternion;
    //   console.log({
    //     x: formatTo100th(x),
    //     y: formatTo100th(y),
    //     z: formatTo100th(z),
    //     w: formatTo100th(w)
    //   });
    //   socket.send(
    //     JSON.stringify({
    //       x: formatTo100th(x),
    //       y: formatTo100th(y),
    //       z: formatTo100th(z),
    //       w: formatTo100th(w)
    //     })
    //   );
    // };
    socket.onmessage = event => {
      const { data } = event;
      console.log(data);
    };
  };
}
