/* ==========================================================
   EduQuiz Platform - Main JavaScript Application
   Pure Vanilla HTML, CSS & JS (VS Code Live Server Compatible)
   ========================================================== */

// --- Built-in Offline Fallback Question Bank ---
// Used when offline or for the Web Development category
const BUILTIN_QUESTIONS = [
  {
    category: "Web Development",
    question: "What does HTML stand for?",
    correct_answer: "HyperText Markup Language",
    incorrect_answers: [
      "HyperText Machine Language",
      "HighText Multi Language",
      "HyperTool Markup Language"
    ]
  },
  {
    category: "Web Development",
    question: "Which CSS property is used to change the text color of an element?",
    correct_answer: "color",
    incorrect_answers: ["font-color", "text-color", "style-color"]
  },
  {
    category: "Web Development",
    question: "Which JavaScript keyword is used to declare a constant variable that cannot be reassigned?",
    correct_answer: "const",
    incorrect_answers: ["var", "let", "static"]
  },
  {
    category: "Web Development",
    question: "Inside which HTML element do we put JavaScript code?",
    correct_answer: "<script>",
    incorrect_answers: ["<javascript>", "<js>", "<scripting>"]
  },
  {
    category: "Web Development",
    question: "What does CSS stand for?",
    correct_answer: "Cascading Style Sheets",
    incorrect_answers: [
      "Computer Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets"
    ]
  },
  {
    category: "Web Development",
    question: "Which HTML attribute specifies an alternate text for an image if the image cannot be displayed?",
    correct_answer: "alt",
    incorrect_answers: ["title", "src", "description"]
  },
  {
    category: "Web Development",
    question: "Which method is used in JavaScript to select an element by its ID?",
    correct_answer: "document.getElementById()",
    incorrect_answers: [
      "document.queryId()",
      "document.findElement()",
      "document.select()"
    ]
  },
  {
    category: "Web Development",
    question: "What is the default value of the CSS 'position' property?",
    correct_answer: "static",
    incorrect_answers: ["relative", "absolute", "fixed"]
  },
  {
    category: "Web Development",
    question: "How do you write a single-line comment in JavaScript?",
    correct_answer: "// This is a comment",
    incorrect_answers: [
      "<!-- This is a comment -->",
      "/* This is a comment",
      "# This is a comment"
    ]
  },
  {
    category: "Web Development",
    question: "Which HTTP status code signifies a successful request?",
    correct_answer: "200 OK",
    incorrect_answers: ["404 Not Found", "500 Internal Error", "301 Moved Permanently"]
  },
  {
    category: "Web Development",
    question: "Which of the following is NOT a JavaScript data type?",
    correct_answer: "Float",
    incorrect_answers: ["Boolean", "String", "Symbol"]
  },
  {
    category: "Web Development",
    question: "Which tag is used to create an interactive hyperlink in HTML?",
    correct_answer: "<a>",
    incorrect_answers: ["<link>", "<href>", "<nav>"]
  }
];

// --- Application State ---
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let timerSeconds = 30;
let timerInterval = null;
let remainingTime = 30;
let totalStartTime = 0;
let lifelineAvailable = true;

// --- DOM Elements ---
const setupScreen = document.getElementById("setupScreen");
const loadingScreen = document.getElementById("loadingScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const quizForm = document.getElementById("quizForm");
const categorySelect = document.getElementById("categorySelect");
const difficultySelect = document.getElementById("difficultySelect");
const amountSelect = document.getElementById("amountSelect");
const timerSelect = document.getElementById("timerSelect");

const categoryBadge = document.getElementById("categoryBadge");
const timerBox = document.getElementById("timerBox");
const timerText = document.getElementById("timerText");
const liveScore = document.getElementById("liveScore");
const progressBar = document.getElementById("progressBar");
const currentQuestionNum = document.getElementById("currentQuestionNum");
const totalQuestionsNum = document.getElementById("totalQuestionsNum");
const questionText = document.getElementById("questionText");
const optionsGrid = document.getElementById("optionsGrid");
const feedbackBanner = document.getElementById("feedbackBanner");
const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackMessage = document.getElementById("feedbackMessage");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const quitQuizBtn = document.getElementById("quitQuizBtn");
const fiftyFiftyBtn = document.getElementById("fiftyFiftyBtn");
const lifelineCount = document.getElementById("lifelineCount");

// Results DOM
const resultEmoji = document.getElementById("resultEmoji");
const resultTitle = document.getElementById("resultTitle");
const resultSubtitle = document.getElementById("resultSubtitle");
const scorePercentage = document.getElementById("scorePercentage");
const correctCount = document.getElementById("correctCount");
const wrongCount = document.getElementById("wrongCount");
const finalScore = document.getElementById("finalScore");
const timeTaken = document.getElementById("timeTaken");
const restartBtn = document.getElementById("restartBtn");
const toggleReviewBtn = document.getElementById("toggleReviewBtn");
const homeBtn = document.getElementById("homeBtn");
const reviewContainer = document.getElementById("reviewContainer");
const reviewList = document.getElementById("reviewList");

// Modals
const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");
const historyListContainer = document.getElementById("historyListContainer");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const customQuizBtn = document.getElementById("customQuizBtn");
const customModal = document.getElementById("customModal");
const closeCustomBtn = document.getElementById("closeCustomBtn");
const customQuestionForm = document.getElementById("customQuestionForm");
const customSavedMsg = document.getElementById("customSavedMsg");

// --- Helper: Decode HTML Entities ---
function decodeHtml(html) {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// --- Helper: Shuffle Array ---
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// --- Fetch Fresh, Random Questions from Free APIs ---
async function fetchQuestions(category, difficulty, amount) {
  // 1. User's custom questions
  if (category === "custom") {
    const customList = JSON.parse(localStorage.getItem("eduquiz_custom_questions") || "[]");
    if (customList.length === 0) {
      alert("No custom questions found yet! Taking Web Development questions instead.");
      return shuffleArray(BUILTIN_QUESTIONS).slice(0, amount);
    }
    return shuffleArray(customList).slice(0, amount);
  }

  // 2. Built-in Offline Web Development
  if (category === "builtin_web") {
    return shuffleArray(BUILTIN_QUESTIONS).slice(0, amount);
  }

  // 3. Computer Science from Open Trivia Database
  if (category === "18") {
    try {
      const openTdbUrl = `https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=${difficulty}&type=multiple&_cacheBust=${Date.now()}`;
      const res = await fetch(openTdbUrl);
      const data = await res.json();
      if (data.response_code === 0 && data.results && data.results.length > 0) {
        return data.results.map((q) => ({
          category: decodeHtml(q.category),
          question: decodeHtml(q.question),
          correct_answer: decodeHtml(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHtml)
        }));
      }
    } catch (err) {
      console.warn("OpenTDB error, falling back to Trivia API:", err);
    }
  }

  // 4. The Trivia API (Generates fresh, unique random questions every time)
  try {
    let triviaApiUrl = `https://the-trivia-api.com/v2/questions?limit=${amount}&_t=${Date.now()}`;
    
    // Add category filter if not surprise/random
    if (category !== "random" && category !== "18") {
      triviaApiUrl += `&categories=${category}`;
    }

    // Add difficulty if specified
    if (difficulty && difficulty !== "any") {
      triviaApiUrl += `&difficulties=${difficulty}`;
    }

    const res = await fetch(triviaApiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const results = await res.json();

    if (Array.isArray(results) && results.length > 0) {
      return results.map((item) => ({
        category: item.category ? item.category.replace(/_/g, " ").toUpperCase() : "General",
        question: typeof item.question === "object" ? item.question.text : item.question,
        correct_answer: item.correctAnswer,
        incorrect_answers: item.incorrectAnswers
      }));
    }
  } catch (err) {
    console.warn("Trivia API failed, trying OpenTDB fallback:", err);
  }

  // 5. Secondary Live API Fallback (Open Trivia DB with no category constraints)
  try {
    const fallbackUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple&_t=${Date.now()}`;
    const res = await fetch(fallbackUrl);
    const data = await res.json();
    if (data.response_code === 0 && data.results && data.results.length > 0) {
      return data.results.map((q) => ({
        category: decodeHtml(q.category),
        question: decodeHtml(q.question),
        correct_answer: decodeHtml(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeHtml)
      }));
    }
  } catch (err) {
    console.warn("Secondary API failed. Using local offline question bank.", err);
  }

  // 6. Graceful offline fallback
  return shuffleArray(BUILTIN_QUESTIONS).slice(0, amount);
}

// --- Start Quiz Controller ---
async function startQuiz(e) {
  if (e) e.preventDefault();

  const category = categorySelect.value;
  const difficulty = difficultySelect.value;
  const amount = parseInt(amountSelect.value, 10);
  timerSeconds = parseInt(timerSelect.value, 10);

  // Switch to Loading Screen
  setupScreen.classList.add("hidden");
  loadingScreen.classList.remove("hidden");

  // Fetch Questions
  questions = await fetchQuestions(category, difficulty, amount);

  loadingScreen.classList.add("hidden");

  if (!questions || questions.length === 0) {
    alert("Could not load questions. Please check your internet or select another category.");
    setupScreen.classList.remove("hidden");
    return;
  }

  // Reset State Variables
  currentQuestionIndex = 0;
  userAnswers = [];
  score = 0;
  lifelineAvailable = true;
  totalStartTime = Date.now();
  liveScore.textContent = "0";
  lifelineCount.textContent = "1";
  fiftyFiftyBtn.disabled = false;

  // Show Active Quiz
  quizScreen.classList.remove("hidden");
  loadQuestion();
}

// --- Load Single Question ---
function loadQuestion() {
  const currentQ = questions[currentQuestionIndex];

  // Update Status & Progress
  categoryBadge.textContent = currentQ.category || "Quiz";
  currentQuestionNum.textContent = currentQuestionIndex + 1;
  totalQuestionsNum.textContent = questions.length;
  progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;

  // Update Question Text
  questionText.textContent = currentQ.question;

  // Reset UI elements
  feedbackBanner.classList.add("hidden");
  feedbackBanner.className = "feedback-banner hidden";
  nextQuestionBtn.classList.add("hidden");

  // Shuffle options
  const allOptions = shuffleArray([
    currentQ.correct_answer,
    ...currentQ.incorrect_answers
  ]);

  // Render Option Buttons
  optionsGrid.innerHTML = "";
  const optionLetters = ["A", "B", "C", "D"];

  allOptions.forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.option = option;
    btn.innerHTML = `
      <span class="option-letter">${optionLetters[idx]}</span>
      <span class="option-text">${option}</span>
    `;
    btn.addEventListener("click", () => handleAnswerSelect(option, currentQ.correct_answer));
    optionsGrid.appendChild(btn);
  });

  // Start countdown timer
  startQuestionTimer();
}

// --- Question Timer Logic ---
function startQuestionTimer() {
  clearInterval(timerInterval);

  if (timerSeconds <= 0) {
    timerBox.classList.add("hidden");
    return;
  }

  timerBox.classList.remove("hidden");
  remainingTime = timerSeconds;
  timerText.textContent = remainingTime;

  timerInterval = setInterval(() => {
    remainingTime--;
    timerText.textContent = remainingTime;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

// --- Handle User Answer Selection ---
function handleAnswerSelect(selectedOption, correctOption) {
  clearInterval(timerInterval);

  const isCorrect = selectedOption === correctOption;
  const currentQ = questions[currentQuestionIndex];

  // Record Answer for Review
  userAnswers.push({
    question: currentQ.question,
    selected: selectedOption,
    correct: correctOption,
    isCorrect: isCorrect
  });

  if (isCorrect) {
    score += 10;
    liveScore.textContent = score;
  }

  // Highlight Options
  const optionButtons = optionsGrid.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.option === correctOption) {
      btn.classList.add("correct");
    } else if (btn.dataset.option === selectedOption && !isCorrect) {
      btn.classList.add("wrong");
    }
  });

  // Show Feedback Banner
  feedbackBanner.classList.remove("hidden");
  if (isCorrect) {
    feedbackBanner.className = "feedback-banner correct-banner";
    feedbackIcon.textContent = "✅";
    feedbackMessage.textContent = "Correct! Well done (+10 pts)";
  } else {
    feedbackBanner.className = "feedback-banner wrong-banner";
    feedbackIcon.textContent = "❌";
    feedbackMessage.textContent = `Incorrect! Correct answer: ${correctOption}`;
  }

  // Show Next / Finish Button
  nextQuestionBtn.classList.remove("hidden");
  if (currentQuestionIndex === questions.length - 1) {
    nextQuestionBtn.textContent = "Finish & See Results 🏁";
  } else {
    nextQuestionBtn.textContent = "Next Question ➔";
  }
}

// --- Handle Time Expiration ---
function handleTimeout() {
  const currentQ = questions[currentQuestionIndex];

  userAnswers.push({
    question: currentQ.question,
    selected: "Time Expired",
    correct: currentQ.correct_answer,
    isCorrect: false
  });

  const optionButtons = optionsGrid.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.option === currentQ.correct_answer) {
      btn.classList.add("correct");
    }
  });

  feedbackBanner.classList.remove("hidden");
  feedbackBanner.className = "feedback-banner wrong-banner";
  feedbackIcon.textContent = "⏰";
  feedbackMessage.textContent = `Time's up! The correct answer was: ${currentQ.correct_answer}`;

  nextQuestionBtn.classList.remove("hidden");
  if (currentQuestionIndex === questions.length - 1) {
    nextQuestionBtn.textContent = "Finish & See Results 🏁";
  } else {
    nextQuestionBtn.textContent = "Next Question ➔";
  }
}

// --- Next Question Handler ---
function handleNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

// --- 50:50 Lifeline Handler ---
function handleFiftyFifty() {
  if (!lifelineAvailable) return;
  lifelineAvailable = false;
  lifelineCount.textContent = "0";
  fiftyFiftyBtn.disabled = true;

  const currentQ = questions[currentQuestionIndex];
  const optionButtons = Array.from(optionsGrid.querySelectorAll(".option-btn"));

  // Filter out the correct option
  const wrongOptions = optionButtons.filter(
    (btn) => btn.dataset.option !== currentQ.correct_answer
  );

  // Shuffle and disable two wrong options
  const toDisable = shuffleArray(wrongOptions).slice(0, 2);
  toDisable.forEach((btn) => {
    btn.style.opacity = "0.3";
    btn.disabled = true;
  });
}

// --- Finish Quiz & Display Results ---
function finishQuiz() {
  clearInterval(timerInterval);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  // Calculate statistics
  const totalQuestions = questions.length;
  const correctTotal = userAnswers.filter((a) => a.isCorrect).length;
  const wrongTotal = totalQuestions - correctTotal;
  const accuracy = Math.round((correctTotal / totalQuestions) * 100);
  const totalSeconds = Math.round((Date.now() - totalStartTime) / 1000);

  // Update UI Elements
  scorePercentage.textContent = `${accuracy}%`;
  correctCount.textContent = correctTotal;
  wrongCount.textContent = wrongTotal;
  finalScore.textContent = score;
  timeTaken.textContent = `${totalSeconds}s`;

  // Custom greeting based on score
  if (accuracy >= 80) {
    resultEmoji.textContent = "🏆";
    resultTitle.textContent = "Outstanding Performance!";
    resultSubtitle.textContent = "You've mastered this subject. Great job!";
  } else if (accuracy >= 50) {
    resultEmoji.textContent = "👏";
    resultTitle.textContent = "Good Effort!";
    resultSubtitle.textContent = "Keep practicing to improve your score!";
  } else {
    resultEmoji.textContent = "📚";
    resultTitle.textContent = "Keep Learning!";
    resultSubtitle.textContent = "Review your answers below and try another attempt.";
  }

  // Populate Review List
  populateReviewList();

  // Save to LocalStorage History
  saveToHistory({
    date: new Date().toLocaleDateString(),
    category: questions[0]?.category || "Quiz",
    score: score,
    accuracy: accuracy,
    time: `${totalSeconds}s`
  });
}

// --- Populate Review Breakdown ---
function populateReviewList() {
  reviewList.innerHTML = "";
  userAnswers.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = `review-item ${item.isCorrect ? "review-correct" : "review-wrong"}`;
    div.innerHTML = `
      <p><strong>${idx + 1}.</strong> ${item.question}</p>
      <div class="review-answers">
        <span><strong>Your Answer:</strong> ${item.selected} ${item.isCorrect ? "✅" : "❌"}</span>
        ${!item.isCorrect ? `<span><strong>Correct Answer:</strong> <span class="text-success">${item.correct}</span></span>` : ""}
      </div>
    `;
    reviewList.appendChild(div);
  });
}

// --- History & Leaderboard (localStorage) ---
function saveToHistory(record) {
  const existing = JSON.parse(localStorage.getItem("eduquiz_history") || "[]");
  existing.unshift(record);
  if (existing.length > 10) existing.pop();
  localStorage.setItem("eduquiz_history", JSON.stringify(existing));
}

function loadHistory() {
  const existing = JSON.parse(localStorage.getItem("eduquiz_history") || "[]");
  if (existing.length === 0) {
    historyListContainer.innerHTML = `<p class="text-center" style="color: var(--text-muted); padding: 1.5rem;">No quiz history yet. Take a quiz to see your scores!</p>`;
    return;
  }

  historyListContainer.innerHTML = existing
    .map(
      (item) => `
    <div class="history-card">
      <div>
        <strong>${item.category}</strong>
        <div style="font-size: 0.8rem; color: var(--text-muted);">${item.date} &bull; Time: ${item.time}</div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 1.1rem; font-weight: 700; color: var(--primary-color);">${item.score} pts</span>
        <div style="font-size: 0.8rem; color: ${item.accuracy >= 60 ? 'var(--success-color)' : 'var(--danger-color)'};">${item.accuracy}% Accuracy</div>
      </div>
    </div>
  `
    )
    .join("");
}

// --- Custom Questions (localStorage) ---
function saveCustomQuestion(e) {
  e.preventDefault();
  const qText = document.getElementById("customQuestionInput").value.trim();
  const correct = document.getElementById("customCorrectInput").value.trim();
  const wrong1 = document.getElementById("customWrong1").value.trim();
  const wrong2 = document.getElementById("customWrong2").value.trim();
  const wrong3 = document.getElementById("customWrong3").value.trim();

  if (!qText || !correct || !wrong1 || !wrong2 || !wrong3) return;

  const newQ = {
    category: "Custom Created",
    question: qText,
    correct_answer: correct,
    incorrect_answers: [wrong1, wrong2, wrong3]
  };

  const customList = JSON.parse(localStorage.getItem("eduquiz_custom_questions") || "[]");
  customList.push(newQ);
  localStorage.setItem("eduquiz_custom_questions", JSON.stringify(customList));

  // Reset form and show message
  customQuestionForm.reset();
  customSavedMsg.classList.remove("hidden");
  setTimeout(() => customSavedMsg.classList.add("hidden"), 3000);
}

// --- Event Listeners ---
quizForm.addEventListener("submit", startQuiz);
nextQuestionBtn.addEventListener("click", handleNextQuestion);
fiftyFiftyBtn.addEventListener("click", handleFiftyFifty);

quitQuizBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to quit this quiz? Your current progress will be lost.")) {
    clearInterval(timerInterval);
    quizScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
  }
});

restartBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  reviewContainer.classList.add("hidden");
  startQuiz();
});

homeBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  reviewContainer.classList.add("hidden");
  setupScreen.classList.remove("hidden");
});

toggleReviewBtn.addEventListener("click", () => {
  reviewContainer.classList.toggle("hidden");
  if (!reviewContainer.classList.contains("hidden")) {
    reviewContainer.scrollIntoView({ behavior: "smooth" });
  }
});

// Leaderboard Modal Listeners
leaderboardBtn.addEventListener("click", () => {
  loadHistory();
  leaderboardModal.classList.remove("hidden");
});
closeLeaderboardBtn.addEventListener("click", () => leaderboardModal.classList.add("hidden"));
clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Clear all quiz history?")) {
    localStorage.removeItem("eduquiz_history");
    loadHistory();
  }
});

// Custom Question Modal Listeners
customQuizBtn.addEventListener("click", () => customModal.classList.remove("hidden"));
closeCustomBtn.addEventListener("click", () => customModal.classList.add("hidden"));
customQuestionForm.addEventListener("submit", saveCustomQuestion);

// Close Modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === leaderboardModal) leaderboardModal.classList.add("hidden");
  if (e.target === customModal) customModal.classList.add("hidden");
});
