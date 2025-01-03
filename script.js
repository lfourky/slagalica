let solution = generateSolution();
let currentGuess = [];
let attempt = 0;

document.addEventListener("DOMContentLoaded", () => {
  initializeBoard();
  addEventListeners();
  updateRowStates(); // Highlight initial row
});

function initializeBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row inactive"; // All rows start as inactive

    for (let j = 0; j < 4; j++) {
      const slot = document.createElement("div");
      slot.className = "guess-slot";
      row.appendChild(slot);
    }

    const feedbackContainer = document.createElement("div");
    feedbackContainer.className = "feedback-container";
    for (let k = 0; k < 4; k++) {
      const feedbackSlot = document.createElement("div");
      feedbackSlot.className = "feedback-slot";
      feedbackContainer.appendChild(feedbackSlot);
    }
    row.appendChild(feedbackContainer);

    board.appendChild(row);
  }
}

function generateSolution() {
  const symbols = Array.from(
    document.querySelectorAll("#selection .symbol")
  ).map((btn) => btn.dataset.value);
  return Array.from(
    { length: 4 },
    () => symbols[Math.floor(Math.random() * symbols.length)]
  );
}

function addEventListeners() {
  document.querySelectorAll(".symbol").forEach((symbol) => {
    symbol.addEventListener("click", () => {
      if (currentGuess.length < 4) {
        currentGuess.push(symbol.dataset.value);
        renderGuess();
      }
    });
  });

  document.getElementById("submit").addEventListener("click", () => {
    if (currentGuess.length === 4) {
      checkGuess();
      currentGuess = [];
    }
  });

  document.getElementById("refresh").addEventListener("click", () => {
    resetGame();
  });
}

function renderGuess() {
  const row = document.querySelectorAll(".row")[attempt];
  const slots = row.querySelectorAll(".guess-slot");

  currentGuess.forEach((guess, index) => {
    const matchingSymbol = document.querySelector(
      `.symbol[data-value="${guess}"]`
    );
    if (matchingSymbol) {
      slots[index].innerHTML = matchingSymbol.innerHTML;
      slots[index].style.color = window.getComputedStyle(matchingSymbol).color;
    }
  });
}

function checkGuess() {
  const feedback = calculateFeedback();
  const row = document.querySelectorAll(".row")[attempt];
  const feedbackSlots = row.querySelectorAll(".feedback-slot");
  feedback.correct.forEach(
    (_, index) => (feedbackSlots[index].style.background = "red")
  );
  feedback.misplaced.forEach(
    (_, index) =>
      (feedbackSlots[feedback.correct.length + index].style.background =
        "yellow")
  );

  if (feedback.correct.length === 4 || attempt === 5) {
    endGame();
  } else {
    attempt++;
    updateRowStates(); // Update row visibility
  }
}

function calculateFeedback() {
  const correct = [];
  const misplaced = [];
  const tempSolution = [...solution];

  currentGuess.forEach((symbol, index) => {
    if (symbol === tempSolution[index]) {
      correct.push(symbol);
      tempSolution[index] = null;
    }
  });

  currentGuess.forEach((symbol, index) => {
    if (tempSolution.includes(symbol) && symbol !== solution[index]) {
      misplaced.push(symbol);
      tempSolution[tempSolution.indexOf(symbol)] = null;
    }
  });

  return { correct, misplaced };
}

function updateRowStates() {
  document.querySelectorAll(".row").forEach((row, index) => {
    if (index < attempt) {
      row.classList.remove("inactive"); // Keep tried rows visible
    } else if (index === attempt) {
      row.classList.remove("inactive"); // Highlight current row
    } else {
      row.classList.add("inactive"); // Gray out rows not yet reachable
    }
  });
}

function endGame() {
  const board = document.getElementById("board");
  const row = document.createElement("div");
  row.className = "row solution-row";

  for (let i = 0; i < 4; i++) {
    const slot = document.createElement("div");
    slot.className = "guess-slot solution-slot";
    const matchingSymbol = document.querySelector(
      `.symbol[data-value="${solution[i]}"]`
    );
    if (matchingSymbol) {
      slot.innerHTML = matchingSymbol.innerHTML;
      slot.style.color = window.getComputedStyle(matchingSymbol).color;
    }
    row.appendChild(slot);
  }

  board.appendChild(row);
}

function resetGame() {
  solution = generateSolution();
  currentGuess = [];
  attempt = 0;
  initializeBoard();
  updateRowStates(); // Reset row visibility
}
