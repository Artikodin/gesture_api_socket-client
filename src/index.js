import { LinearAccelerationSensor } from 'motion-sensors-polyfill';
import { initSensor } from './helpers';

const accelerationSensor = new LinearAccelerationSensor({ frequency: 1 });

initSensor(accelerationSensor);

const socket = new WebSocket('wss://192.168.0.40:8081');

let timeReseter = 0;
const getDistance = ({ x: accelerationX, y: accelerationY, z: accelerationZ }) => timestamp => {
  const frameTime = timestamp - timeReseter;
  timeReseter = timestamp;
  console.log({
    x: roundTo10th(calculateDistance(accelerationX, frameTime)),
    y: roundTo10th(calculateDistance(accelerationY, frameTime)),
    z: roundTo10th(calculateDistance(accelerationZ, frameTime))
  });
  // socket.send(
  //   JSON.stringify({
  //     x: roundTo10th(calculateDistance(accelerationX, frameTime)),
  //     y: roundTo10th(calculateDistance(accelerationY, frameTime)),
  //     z: roundTo10th(calculateDistance(accelerationZ, frameTime))
  //   })
  // );
};

const convertMillisecToSec = millisecond => millisecond / 1000;

const calculateDistance = (acceleration, duration) =>
  (1 / 2) * acceleration * convertMillisecToSec(duration ^ 2);

const roundTo10th = number => number.toFixed(2);

socket.onopen = () => {
  accelerationSensor.onreading = () => {
    const { x, y, z } = accelerationSensor;
    console.log({ x: roundTo10th(x), y: roundTo10th(y), z: roundTo10th(z) });
    // requestAnimationFrame(getDistance(accelerationSensor));
    // socket.send(JSON.stringify({ x, y, z }));
  };
  socket.onmessage = event => {
    let data = event.data;
    console.log(data);
  };
};
