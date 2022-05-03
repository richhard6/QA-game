'use strict';

let questionCounter = 0;
//  Cuenta las preguntas que se han mostrado
//  Cuando entra al JSON, muestra el pregunta que
//  corresponde a esta variable

let score = 0;
//Cada respuesta correcta son 10 pts

let answered = false;
//falso = no ha contestado, true contestado.

let totalLength = 0;

const questionDOM = document.querySelector('.question');

const sectionDOM = document.querySelector('section');

const answersDOM = document.querySelector('.answers-container');

const pointsDOM = document.querySelector('.points');

const nextButton = document.querySelector('.next-button');

//Funcion para pasar a la siguiente pregunta
const nextQuestion = () => {
  questionCounter++;
  nextButton.classList.add('hide');

  answered = false;

  renderQuestion();
};

nextButton.addEventListener('click', nextQuestion);

//Obtiene los datos
async function getData() {
  const response = await fetch('./data.json');
  const data = await response.json();

  totalLength = data.length;

  return data;
}

//borramos el contenido de la pregunta y respuesta
const clearScreen = () => {
  questionDOM.textContent = '';

  answersDOM.innerHTML = '';
};

//Renderiza pregunta
async function renderQuestion() {
  const data = await getData();

  if (data.length > questionCounter) {
    const currentQuestion = data[questionCounter];
    console.log(data[questionCounter]);

    clearScreen();

    questionDOM.textContent = currentQuestion.question;

    //Recorremos el arrray de preguntas
    for (let i = 0; i < currentQuestion.answers.length; i++) {
      const button = document.createElement('button');

      button.textContent = currentQuestion.answers[i];

      button.classList.add('btn');

      answersDOM.append(button);

      button.addEventListener('click', (e) =>
        checkAnswer(e.target.textContent, currentQuestion.correct)
      );
    }
  } else {
    sectionDOM.innerHTML = '';

    const finalScore = document.createElement('h1');

    finalScore.innerText = `Your final score is ${score}`;

    sectionDOM.append(finalScore);
  }
}

//Chequea que la respuesta sea correcta
function checkAnswer(clicked, correct) {
  console.log(clicked, correct);

  if (clicked === correct && answered === false) {
    score += 10;
  }
  console.log(score);

  answered = true;
  //imprimimos la puntuación
  pointsDOM.textContent = `Score: ${score}`;

  //Escondemos el boton de next
  nextButton.classList.remove('hide');

  console.log(nextButton);
}

/* if (questionCounter === ) clearScreen(); */

renderQuestion();
