var startPage = document.getElementById("startPage");
var quiz = document.getElementById("quiz");
var submitBtn = document.getElementById("submit");

var questionsCompleted = 0;
var Manswers = {};
var numCurrentQuestion;

function hideQuiz() {
  quiz.style.display = "none";
}

function startQuiz(btn) {
  startPage.style.display = "none";
  quiz.style.display = "block";
  generateRandomQuestion();
}

/***********  Helper functions ************/

function generateRandomOptions(numOptions) {
  let arr = [];
  do {
    let ran = Math.floor(Math.random() * numOptions);
    arr = arr.indexOf(ran) > -1 ? arr : arr.concat(ran);
  } while (arr.length < numOptions);

  return arr;
}

function calculateResult() {
  var correctAns = 0;

  for (const key of Object.keys(Manswers)) {
    if (quizContent[key].type === "multiple") {
      correctAns += Math.ceil(
        Manswers[key] / quizContent[key].correctAnswer.length,
      );
    } else {
      correctAns += Manswers[key];
    }
  }

  var percentage = Math.ceil((correctAns / quizContent.length) * 100);

  var res = document.getElementById("result");
  res.innerHTML += `Percentage (${percentage}%) CorrectAnswer (${correctAns})`;
}

// activate next button when an option is selected
var submitBtn = document.getElementById("submit-button");
var nextBtn = document.getElementById("next-button");

function activateBtn(btn) {
  if (btn.checked || btn.value) {
    submitBtn.removeAttribute("disabled");
  } else submitBtn.setAttribute("disabled", "disabled");
}

/**** Answer Submissions ****/

function submitMultiAnswer() {
  var checkboxes = document.getElementsByName("multi-choice-options");
  var checks = 0;
  var correctAns = 0;

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checks++;
      if (
        quizContent[numCurrentQuestion].correctAnswer.includes(
          checkboxes[i].nextElementSibling.innerHTML,
        )
      ) {
        correctAns++;
      }
    }
  }

  return [correctAns, checks];
}

function submitSingleAnswer() {
  let checkboxes = document.getElementsByName("single-choice-options");
  var correctAns = 0;

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      if (
        quizContent[numCurrentQuestion].correctAnswer.toLowerCase() ===
        checkboxes[i].nextElementSibling.innerHTML.toLowerCase()
      ) {
        correctAns++;
      }
    }
  }

  return correctAns;
}

function submitInputAnswer() {
  return inputChoice.value.toLowerCase() ===
    quizContent[numCurrentQuestion].correctAnswer.toLowerCase()
    ? 1
    : 0;
}

function submitAnswer() {
  nextBtn.removeAttribute("disabled");

  var correctAns = 0;
  var numsChecked = 0;

  if (quizContent[numCurrentQuestion].type === "multiple") {
    [correctAns, numsChecked] = submitMultiAnswer();
  }

  if (quizContent[numCurrentQuestion].type === "single") {
    correctAns = submitSingleAnswer();
  }

  if (quizContent[numCurrentQuestion].type === "input") {
    correctAns = submitInputAnswer();
  }

  Manswers[numCurrentQuestion] = correctAns;

  if (
    (correctAns && quizContent[numCurrentQuestion].type !== "multiple") ||
    (numsChecked === quizContent[numCurrentQuestion].correctAnswer.length &&
      correctAns === quizContent[numCurrentQuestion].correctAnswer.length)
  ) {
    showCurrentStats("correct");
  } else if (correctAns >= 2) {
    showCurrentStats("partlyCorrect");
  } else {
    showCurrentStats("incorrect");
  }
}

var stats = document.getElementById("stats");

function showCurrentStats(status) {
  stats.style.display = "block";
  stats.classList.add("stats");

  if (status === "correct") {
    stats.style.backgroundColor = "#9DC183";
    stats.innerHTML = quizContent[numCurrentQuestion].correctFeedback;
  }

  if (status === "incorrect") {
    stats.style.backgroundColor = "#CD5C5C";
    stats.innerHTML = quizContent[numCurrentQuestion].incorrectFeedback;
  }

  if (status === "partlyCorrect") {
    stats.style.backgroundColor = "gray";
    stats.innerHTML = quizContent[numCurrentQuestion].partlyCorrectFeedback;
  }
}

function prepareNext() {
  stats.style.display = "none";
  submitBtn.disabled = true;
  nextBtn.disabled = true;
}

function nextQuestion() {
  prepareNext();
  if (questionsCompleted === quizContent.length) {
    quiz.style.display = "none";
    document.getElementById("result").style.display = "block";
    calculateResult();
  }
  generateRandomQuestion();
}

var singleChoiceForm = document.getElementById("single-choice");
var multipleChoiceForm = document.getElementById("multiple-choice");
var inputChoiceForm = document.getElementById("input-choice");
singleChoiceForm.style.display = "none";
multipleChoiceForm.style.display = "none";
inputChoiceForm.style.display = "none";

var question = document.getElementById("question");

var inputChoice = document.getElementById("inputChoice");

function showForm(formType) {
  singleChoiceForm.style.display = formType === "single" ? "block" : "none";
  multipleChoiceForm.style.display = formType === "multi" ? "block" : "none";
  inputChoiceForm.style.display = formType === "input" ? "block" : "none";
}

function useSingleChoice(n) {
  showForm("single");
  question.innerHTML = quizContent[n].question;
  generateChoices("single-choice-options");
}

function useMultleChoices(n) {
  showForm("multi");
  question.innerHTML = quizContent[n].question;
  generateChoices("multi-choice-options");
}

function useInputChoice(n) {
  showForm("input");
  question.innerHTML = quizContent[n].question;
  generateChoices("input-choice-options");
}

/******************* Generate Choices *******************/

function generateChoices(targetId) {
  var typeAttr = "checkbox";

  if (targetId === "single-choice-options") {
    typeAttr = "radio";
  }

  let randomOptions = generateRandomOptions(
    quizContent[numCurrentQuestion].options.length,
  );

  for (let i of randomOptions) {
    //   div
    var div = document.createElement("div");
    div.setAttribute("class", "form-check");

    let option = quizContent[numCurrentQuestion].options[i];
    let id = `${i}-${option}`;

    //   input
    var input = document.createElement("input");
    input.setAttribute("class", "form-check-input");
    input.setAttribute("type", typeAttr);
    input.setAttribute("name", targetId);
    input.setAttribute("onClick", "activateBtn(this)");
    input.setAttribute("id", id);

    if (targetId === "input-choice-options") {
      input.disabled = true;
      input.checked = true;
    }

    //   label
    var label = document.createElement("label");
    label.setAttribute("class", "form-check-label");
    label.innerHTML = option;
    label.htmlFor = id;

    div.appendChild(input);
    div.appendChild(label);

    document.getElementById(targetId).appendChild(div);
  }
}

/** Generate Random Question ******/

function generateRandomQuestion() {
  var seen = false;
  var n = Math.floor(Math.random() * quizContent.length);
  //   n = 2;
  numCurrentQuestion = n;

  while ((quizContent[n].seen === 0) == true) {
    // question has not been asked

    seen = true;
    quizContent[n].seen = 1; // mark this as asked

    if (quizContent[n].type === "single") {
      useSingleChoice(n);
    }

    if (quizContent[n].type === "multiple") {
      useMultleChoices(n);
    }

    if (quizContent[n].type === "input") {
      useInputChoice(n);
    }

    questionsCompleted = ++questionsCompleted;
  }
  if (!seen) {
    // if question is asked
    if (questionsCompleted != quizContent.length)
      // if not reached total length
      generateRandomQuestion();
  }
}
