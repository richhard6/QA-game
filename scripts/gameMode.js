const normalMode = document.querySelector('.normalMode');

const timerMode = document.querySelector('.timerMode');

timerMode.addEventListener('click', () => {
  localStorage.setItem('timerMode', true);
});

normalMode.addEventListener('click', () => {
  localStorage.setItem('timerMode', false);
});
