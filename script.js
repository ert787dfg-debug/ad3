let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let selectedChoice = null;

const qEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const retryBtn = document.getElementById('retryBtn');
const resultPanel = document.getElementById('resultPanel');
const scoreText = document.getElementById('scoreText');
const restartBtn = document.getElementById('restartBtn');

init();

async function init() {
  await loadQuestions();
  bindEvents();
  renderQuestion();
}

async function loadQuestions() {
  const res = await fetch('questions.json');
  questions = await res.json();
}

function bindEvents() {
  checkBtn.addEventListener('click', onCheck);
  nextBtn.addEventListener('click', onNext);
  retryBtn.addEventListener('click', onRetry);
  restartBtn.addEventListener('click', onRestart);
}

function renderQuestion() {
  const q = questions[currentIndex];
  qEl.textContent = `س${currentIndex + 1}: ${q.text}`;
  feedbackEl.textContent = '';
  choicesEl.innerHTML = '';
  selectedChoice = null;
  answered = false;

  q.choices.forEach((choiceText, idx) => {
    const li = document.createElement('li');
    li.className = 'choice';
    li.textContent = choiceText;
    li.dataset.index = idx;
    li.addEventListener('click', () => onSelect(li));
    choicesEl.appendChild(li);
  });
}

function onSelect(li) {
  if (answered) return;
  Array.from(choicesEl.children).forEach(c => c.classList.remove('selected'));
  li.classList.add('selected');
  selectedChoice = Number(li.dataset.index);
}

function onCheck() {
  if (selectedChoice == null) return;
  const q = questions[currentIndex];
  const isCorrect = selectedChoice === q.answer;
  answered = true;

  Array.from(choicesEl.children).forEach((c, idx) => {
    if (idx === q.answer) c.classList.add('correct');
    if (idx === selectedChoice && !isCorrect) c.classList.add('wrong');
  });

  if (isCorrect) {
    score++;
    feedbackEl.textContent = q.feedback.correct;
    feedbackEl.className = 'success';
  } else {
    feedbackEl.textContent = q.feedback.wrong;
    feedbackEl.className = 'error';
  }
}

function onNext() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResult();
  }
}

function onRetry() {
  renderQuestion();
}

function showResult() {
  const total = questions.length;
  const percent = Math.round((score / total) * 100);
  let message = '';
  if (percent >= 90) message = 'ممتاز جدًا!';
  else if (percent >= 75) message = 'جيد جدًا!';
  else if (percent >= 60) message = 'جيد.';
  else message = 'جرّب مرة أخرى.';

  scoreText.textContent = `النتيجة: ${score} من ${total} (${percent}%) — ${message}`;
  resultPanel.classList.remove('hidden');
  document.getElementById('quiz').classList.add('hidden');
}

function onRestart() {
  currentIndex = 0;
  score = 0;
  resultPanel.classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  renderQuestion();
}
