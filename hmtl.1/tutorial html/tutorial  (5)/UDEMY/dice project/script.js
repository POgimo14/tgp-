const player1 = document.querySelector(".player--0");
const player2 = document.querySelector(".player--1");
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
const current0El = document.getElementById("current--0");
const current1El = document.getElementById("current--1");

const diceEl = document.querySelector(".dice");
const btnrenew = document.querySelector(".btn--new");
const btnroll = document.querySelector(".btn--roll");
const btnhold = document.querySelector(".btn--hold");

let arrayscore, currentScore, playeractive, bool;

const sum = function () {
  // redecalre
  // score0El.innerHTML = 0;
  // score1El.innerHTML = 0;

  arrayscore = [0, 0];
  currentScore = 0;
  playeractive = 0;
  bool = true;

  score0El.innerHTML = 0;
  score1El.innerHTML = 0;
  current0El.innerHTML = 0;
  current1El.innerHTML = 0;
  // hidden for image dice

  diceEl.classList.remove("hidden");

  player1.classList.remove("player--winner");
  player2.classList.remove("player--winner");

  player1.classList.add("player--active");
  player2.classList.remove("player--active");
};
// invoke para mag run ang function hinde nag rurun kapag hinde ininvoke
sum();

const palit = function () {
  document.getElementById(`current--${playeractive}`).innerHTML = 0;
  currentScore = 0;

  playeractive = playeractive === 0 ? 1 : 0;
  player1.classList.toggle("player--active");
  player2.classList.toggle("player--active");
};

// dice rolls
btnroll.addEventListener("click", function () {
  if (bool) {
    // rolling dice manupilate random number dice
    const dice = Math.trunc(Math.random() * 6 + 1);

    diceEl.src = `dice-${dice}.png`;
    // player 0
    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${playeractive}`).innerHTML =
        currentScore;

      // player 1
    } else {
      // function
      palit();
    }
  }
});

btnhold.addEventListener("click", function () {
  if (bool) {
    // active player current score
    arrayscore[playeractive] += currentScore;
    console.log(currentScore);

    // score [1] = score [1] = currentscore
    document.getElementById(`score--${playeractive}`).innerHTML =
      arrayscore[playeractive];

    if (arrayscore[playeractive] >= 10) {
      bool = false;
      diceEl.classList.add("hidden");

      document
        .querySelector(`.player--${playeractive}`)
        .classList.add("player--winner");
      // css
      document
        .querySelector(`.player--${playeractive}`)
        .classList.remove("player--active");
    }
    // function
    palit();
  }
});

btnrenew.addEventListener("click", sum);
