import NoSleep from 'nosleep.js';

const noSleep = new NoSleep();

export const noSleepButton = document.querySelector('#noSleep');
const enabledLabel = document.querySelector('#noSleep>span');

// Enable wake lock.
// (must be wrapped in a user input event handler e.g. a mouse or touch handler)
noSleepButton.addEventListener(
  'click',
  () => {
    noSleep.enable();
    noSleepButton.classList.add('sleep');
    noSleepButton.classList.remove('noSleep');
    enabledLabel.textContent = 'enabled';
  },
  false
);
