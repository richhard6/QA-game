'use strict';

let timerMode = localStorage.getItem('timerMode') === 'true' ? true : false;
//  Toma la variable del LocalStorage para
//  reconocer el modo de juego

let questionCounter = 0;
//  Cuenta las preguntas que se han mostrado
//  Cuando entra al JSON, muestra el pregunta que
//  corresponde a esta variable

let score = 0;
//  Aqui se almacena la puntuacion
//  Cada respuesta correcta son 10 pts

let correctAnswers = 0;
//  Cuenta las respuestas correctas

let answered = false;
//  falso = no ha contestado, true contestado.

let totalTime = 30;
//  Tiempo total para cada pregunta

// --------------------------- QuerySelector ------------------------------------//

const question = document.querySelector('.question');

const main = document.querySelector('main');

const header = document.querySelector('header');

const answersContainer = document.querySelector('.answers-container');

const scoreDOM = document.querySelector('.score');

const nextButton = document.querySelector('.next-button');

const questionNumber = document.querySelector('.question-number');

const timerBar = document.querySelector('#timer');

const QAContainer = document.querySelector('.question-answer-container');

// ----------------------------------------------------------------------//

//  Funcion para pasar a la siguiente pregunta
const nextQuestion = () => {
  // Agregamos +1 alcontador de pregunta y ocultamos el boton "Next"
  questionCounter++;
  nextButton.classList.add('hide');

  QAContainer.classList.remove('QA-animation');

  nextButton.classList.remove('next-button-show');

  answered = false;
  renderQuestion();
};

// Reincia el juego
const restartGame = () => {
  score = 0;
  correctAnswers = 0;
  questionCounter = 0;
  answered = false;
  QAContainer.style.display = 'flex';
  timerBar.style.display = 'block';
  header.style.display = 'flex';
  main.classList.remove('flex-column');

  document.querySelector('.final-score').remove();
  document.querySelector('.score-text').remove();
  document.querySelector('.game-over-container').remove();
  document.querySelector('.correct-answers').remove();

  renderQuestion();
};

//  Temporizador
const questionTimer = async () => {

  const data = await getData();
  //  Solo se activa si el modo temporizador esta activado
  if (timerMode === true) {
    //  Cada vez que se inicia el temporizador, se reinician los valroes
    totalTime = 30;
    timerBar.value = 30;

    let interval = setInterval(() => {
      totalTime--;
      timerBar.value--;

      if (totalTime === 0) {
        clearInterval(interval);
        answered = true;
        nextButton.classList.remove('hide');
      } else if (answered === true || data.length === questionCounter) {
        clearInterval(interval);
      }
    }, 1000);
  }
};

nextButton.addEventListener('click', nextQuestion);

//  Obtiene los datos del JSON
async function getData() {
  const response = await fetch('./data.json');
  const data = await response.json();

  return data;
}

//  Borra el contenido de la pregunta y respuesta
const clearScreen = () => {
  question.textContent = '';
  answersContainer.innerHTML = '';
};

//  Renderiza pregunta
async function renderQuestion() {
  const data = await getData();

  if (timerMode === false) {
    timerBar.classList.add('hide');
  }

  QAContainer.classList.add('QA-animation');
  questionNumber.textContent = `Question ${questionCounter + 1} of  ${
    data.length
  }`;

  //  Si el largo del JSON es superior al contador de preguntas...
  if (data.length > questionCounter) {
    questionTimer();

    //  Cogemos los datos del JSON

    const currentQuestion = data[questionCounter];

    //  Limpiamos pantalla y mostramos la pregunta
    clearScreen();
    question.textContent = currentQuestion.question;

    //  Recorremos el array de respuestas
    for (let i = 0; i < currentQuestion.answers.length; i++) {
      const button = document.createElement('button');

      button.textContent = currentQuestion.answers[i];

      button.classList.add('btn');

      answersContainer.append(button);

      button.addEventListener('click', (e) =>
        checkAnswer(e, currentQuestion.correct)
      );
    }
  } else {
    //  En caso contrario, borrar todo y mostrar la pantalla final
    QAContainer.style.display = 'none';
    timerBar.style.display = 'none';
    header.style.display = 'none';
    main.classList.add('flex-column');

    const finalScore = document.createElement('h2');
    const scoreShow = document.createElement('h1');

    const correctShow = document.createElement('h3');
    correctShow.classList.add('correct-answers');
    correctShow.textContent = `${correctAnswers} correct answers out of ${data.length}`;

    // Crea el menu de Game Over
    const gameOverContainer = document.createElement('div');
    const restartButton = document.createElement('button');
    const homeButton = document.createElement('button');
    const homeAncor = document.createElement('a');
    homeAncor.textContent = 'Home';
    homeAncor.setAttribute('href', './index.html');
    homeButton.append(homeAncor);
    homeButton.classList.add('home-button');
    gameOverContainer.append(restartButton);
    gameOverContainer.append(homeButton);
    gameOverContainer.classList.add('game-over-container');

    restartButton.classList.add('restart-btn');

    restartButton.innerText = 'Restart';

    //  Se añade el evento click con la funcion restartGame al boton previamente creado
    restartButton.addEventListener('click', restartGame);

    scoreShow.innerText = score;

    finalScore.innerText = 'Your final score is';
    scoreShow.classList.add('final-score');
    finalScore.classList.add('score-text');

    main.append(finalScore);
    main.append(scoreShow);
    main.append(correctShow);
    main.append(gameOverContainer);
  }
}

//  Chequea que la respuesta sea correcta
function checkAnswer(clicked, correct) {
  //  Si aun no se ha clickeado, agregar 10pts y dar feedback
  //  El calculo del puntaje depende del modo seleccionado
  if (clicked.target.textContent === correct && answered === false) {
    if (timerMode) {
      score += 5 * totalTime;
      correctAnswers++;
      clicked.target.classList.add('correct');

    } else {
      score += 10;
      correctAnswers++;
      clicked.target.classList.add('correct');
    }
  } else if (answered === false) {
    clicked.target.classList.add('wrong');
  }

  nextButton.classList.add('next-button-show');
  answered = true;

  //  Imprimimos la puntuación
  scoreDOM.textContent = `Score: ${score}`;
  //  Escondemos el boton de next
  nextButton.classList.remove('hide');
}

renderQuestion();
