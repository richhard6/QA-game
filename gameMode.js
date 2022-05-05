const button = document.querySelector('.prueba');

button.addEventListener('click', () => {
  localStorage.setItem('timerMode', true);
});
