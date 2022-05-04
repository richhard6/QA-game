'use strict';

let questionCounter = 0;
//  Cuenta las preguntas que se han mostrado
//  Cuando entra al JSON, muestra el pregunta que
//  corresponde a esta variable

let score = 0;
//  Aqui se almacena la puntuacion
//  Cada respuesta correcta son 10 pts

let answered = false;
//  falso = no ha contestado, true contestado.

let totalLength = 0;

const questionDOM = document.querySelector('.question');

const sectionDOM = document.querySelector('section');

const answersDOM = document.querySelector('.answers-container');

const scoreDOM = document.querySelector('.score');

const nextButton = document.querySelector('.next-button');

const questionNumberDOM = document.querySelector('.question-number');

const QAContainerDOM = document.querySelector('.question-answer-container');

//  Funcion para pasar a la siguiente pregunta
const nextQuestion = () => {
  questionCounter++;
  nextButton.classList.add('hide');

  QAContainerDOM.classList.remove('question-answer-container');
  nextButton.classList.remove('next-button-show');

  answered = false;
  renderQuestion();
};

nextButton.addEventListener('click', nextQuestion);

//  Obtiene los datos
async function getData() {
  const response = await fetch('./data.json');
  const data = await response.json();

  totalLength = data.length;

  return data;
}

//  Borramos el contenido de la pregunta y respuesta
const clearScreen = () => {
  questionDOM.textContent = '';

  answersDOM.innerHTML = '';
};

//  Renderiza pregunta
async function renderQuestion() {
  const data = await getData();

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
  if (clicked.target.textContent === correct && answered === false) {
    score += 10;
    clicked.target.classList.add('correct');
  } else if (answered === false) {
    clicked.target.classList.add('wrong');
  }

  console.log(score);

  nextButton.classList.add('next-button-show');

  answered = true;
  //  Imprimimos la puntuación
  scoreDOM.textContent = `Score: ${score}`;

  //Escondemos el boton de next
  nextButton.classList.remove('hide');

  console.log(nextButton);
}

/* if (questionCounter === ) clearScreen(); */

renderQuestion();
