'use strict';

let questionCounter = 0;
//  Cuenta las preguntas que se han mostrado
//  Cuando entra al JSON, muestra el pregunta que
//  corresponde a esta variable

let score = 0;
//Cada respuesta correcta son 10 pts

const questionDOM = document.querySelector('.question');

const answersDOM = document.querySelector('.answers-container');

//Obtiene los datos
async function getData() {
  const response = await fetch('./data.json');
  const data = await response.json();

  return data;
}

//Renderiza pregunta
async function renderQuestion() {
  const data = await getData();

  const currentQuestion = data[questionCounter];

  console.log(data[questionCounter]);

  questionDOM.textContent = currentQuestion.question;

  //Vaciamos los botones
  answersDOM.innerHTML = '';

  //Recorremos el arrray de preguntas
  for (let i = 0; i < currentQuestion.answers.length; i++) {
    const button = document.createElement('button');

    button.textContent = currentQuestion.answers[i];

    console.log(button);

    answersDOM.append(button);

    button.addEventListener('click', (e) =>
      checkAnswer(e.target.textContent, currentQuestion.correct)
    );
  }
}

//Chequea que la respuesta sea correcta
function checkAnswer(clicked, correct) {
  console.log(clicked, correct);
  if (clicked === correct) {
    score += 10;
  }
  console.log(score);

  questionCounter++;

  renderQuestion();
}

renderQuestion();
