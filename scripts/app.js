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

let answered = false;
//  falso = no ha contestado, true contestado.

let totalTime = 30;
//  Tiempo total para el numero 

// --------------------------- QuerySelector ------------------------------------//

const questionDOM = document.querySelector('.question');

const sectionDOM = document.querySelector('section');

const answersDOM = document.querySelector('.answers-container');

const scoreDOM = document.querySelector('.score');

const nextButton = document.querySelector('.next-button');

const questionNumberDOM = document.querySelector('.question-number');

const timerBar = document.querySelector('#timer');

const QAContainerDOM = document.querySelector('.question-answer-container');

// ----------------------------------------------------------------------//


//  Funcion para pasar a la siguiente pregunta
const nextQuestion = () => {

  // Agregamos +1 alcontador de pregunta y ocultamos el boton "Next"
  questionCounter++;
  nextButton.classList.add('hide');

  QAContainerDOM.classList.remove('question-answer-container');
  nextButton.classList.remove('next-button-show');

  answered = false;
  renderQuestion();
};

//  Temporizador
const questionTimer = () => {

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

      } else if (answered === true) {
        clearInterval(interval);
      }
      console.log(totalTime);
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
  questionDOM.textContent = '';
  answersDOM.innerHTML = '';
};

//  Renderiza pregunta
async function renderQuestion() {

  const data = await getData();
  questionTimer();

  if (timerMode === false) {
    timerBar.classList.add('hide');
  }

  QAContainerDOM.classList.add('question-answer-container');
  questionNumberDOM.textContent = `Question ${questionCounter + 1} of  ${
    data.length
  }`;

  //  Si el largo del JSON es superior al contador de preguntas...
  if (data.length > questionCounter) {
    //  Cogemos los datos del JSON
    const currentQuestion = data[questionCounter];
    console.log(data[questionCounter]);

    //  Limpiamos pantalla y mostramos la pregunta
    clearScreen();
    questionDOM.textContent = currentQuestion.question;

    //  Recorremos el array de respuestas
    for (let i = 0; i < currentQuestion.answers.length; i++) {
      const button = document.createElement('button');

      button.textContent = currentQuestion.answers[i];

      button.classList.add('btn');

      answersDOM.append(button);

      button.addEventListener('click', (e) =>
        checkAnswer(e, currentQuestion.correct)
      );
    }
  } else {
    //  En caso contrario, borrar odo y mostrar la pantalla final
    sectionDOM.innerHTML = '';

    const finalScore = document.createElement('h2');
    const scoreShow = document.createElement('h1');

    scoreShow.innerText = score;

    finalScore.innerText = 'Your final score is';
    scoreShow.classList.add('final-score');
    finalScore.classList.add('score-text');

    sectionDOM.append(finalScore);
    sectionDOM.append(scoreShow);
  }
}

//  Chequea que la respuesta sea correcta
function checkAnswer(clicked, correct) {
  console.log(clicked, correct);

  //  Si aun no se ha clickeado, agregar 10pts y dar feedback
  //  El calculo del puntaje depende del modo seleccionado
  if (clicked.target.textContent === correct && answered === false) {
    if (timerMode) {
      score += 5 * totalTime;
      clicked.target.classList.add('correct');

    } else {

      score += 10;
      clicked.target.classList.add('correct');
    }

  } else if (answered === false) {
    clicked.target.classList.add('wrong');
  }

  console.log(score);
  nextButton.classList.add('next-button-show');
  answered = true;

  //  Imprimimos la puntuación
  scoreDOM.textContent = `Score: ${score}`;
  //  Escondemos el boton de next
  nextButton.classList.remove('hide');

  console.log(nextButton);
}

renderQuestion();
