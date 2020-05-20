import { retrieveSensor, updateSensor, noSleepButton } from './helpers';
import { socket } from './socket';
import { guid } from './localStorage/guid';
import './helpers/noSleep';

// Iphone check for sensor
if (
  typeof DeviceMotionEvent.requestPermission === 'function' &&
  typeof DeviceOrientationEvent.requestPermission == 'function'
) {
  noSleepButton.addEventListener('click', initSocket);
} else {
  initSocket();
}

function initSocket() {
  noSleepButton.removeEventListener('click', initSocket);

  socket.onopen = () => {
    socket.send(JSON.stringify({ guid }));

    retrieveSensor();

    socket.onmessage = event => {
      onmessage(event);
    };
  };
}

const onmessage = event => {
  const { data } = event;
  const parsedData = JSON.parse(data);

  const { key, route: sensor } = parsedData;
  key === 'route' && updateSensor(sensor);
};
