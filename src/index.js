import { AbsoluteOrientationSensor } from 'motion-sensors-polyfill';
import { initSensor } from './helpers';

const orientationSensor = new AbsoluteOrientationSensor({
  frequency: 60,
  referenceFrame: 'device'
});

initSensor(orientationSensor);

const socket = new WebSocket('wss://192.168.0.40:8081');

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
