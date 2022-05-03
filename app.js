'use strict';

let questionCounter = 0;

let score = 0;

let allQuestions = [];

const questionDOM = document.querySelector('.question');

const answersDOM = document.querySelector('.answers-container');

async function getData() {
  const response = await fetch('./data.json');
  const data = await response.json();

  return data;
}

async function renderQuestion() {
  const data = await getData();

  const currentQuestion = data[questionCounter];

  console.log(data[questionCounter]);

  questionDOM.textContent = currentQuestion.question;

  answersDOM.innerHTML = '';

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
