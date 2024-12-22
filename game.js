
const question = document.getElementById('question'); //selects the html element by using ID question and assigned question
const choices = Array.from(document.getElementsByClassName('choice-text')); //selects the element by class,and converts the htmlcollection to array
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");

let currentQuestion = {};  //store the current question being displayed
let acceptingAnswers = false;   //accepting answer and sets true prevents multiple submissions
let score = 0;            //keep track of users score
let questionCounter = 0;             //keep track of number questions
let availableQuesions = [];       //stores the remaining questions

let questions = [];
fetch("https://opentdb.com/api.php?amount=10&category=22&difficulty=easy&type=multiple")
.then(res =>{
  return res.json();
})
.then(loadedQuestions =>{
  console.log(loadedQuestions.results);
  questions = loadedQuestions.results.map((loadedQuestion) => {
    const formattedQuestion = {
        question: loadedQuestion.question,
    };
    const answerChoices = [...loadedQuestion.incorrect_answers];
    formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
    answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
    );
    answerChoices.forEach((choice, index) => {
      formattedQuestion['choice' + (index + 1)] = choice;
  });

  return formattedQuestion;
});
  
 startGame()
})
.catch(err =>{
  console.error(err);
})

//CONSTANTS
const CORRECT_BONUS = 10; //10 for correct answer added for each correct answer
const MAX_QUESTIONS = 3; //max number of questions

startGame = () => {  //function that initialie the game,resetting variables
    questionCounter = 0; // resets the question counter
    score = 0;           //resets the score
    availableQuesions = [...questions];  //copies all items from the questions array into the availablequestons using spread operator
    getNewQuestion(); //starts the game by calling this
    
}

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) { //no more questions left or num of questions limited
       //if it true it go to end of page
       localStorage.setItem("mostRecentScore", score);
        return window.location.assign('/end.html');      
    }
    questionCounter++; //increment to fetch the new question
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length); //slects random questions from availablequestions array
    currentQuestion = availableQuesions[questionIndex];  //retrives questionnddex from availablequestion array
    question.innerText = currentQuestion.question; //this line sets the text content of an html element to display the text of currentqn

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};
choices.forEach(choice => {
    choice.addEventListener("click", e => {
      if (!acceptingAnswers) return;
  
      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];
  
      const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
          }
      
      selectedChoice.parentElement.classList.add(classToApply);
  
      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
      }, 1000);
    });
  });
  incrementScore = num => {
    score += num;
    scoreText.innerText = score;
  };
  
