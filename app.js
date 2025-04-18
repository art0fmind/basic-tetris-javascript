document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];

  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a Tetramino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);

  let current = theTetrominoes[random][currentRotation];

  // draw the tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //make the tetromino move down every second
  // timerId = setInterval(moveDown, 1000);

  // assign functions to keycodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      // start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();

    // verifie si on est a cote du mure gauche
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    // si on n'est pas a coter du mure gauche on peut le deplacer vers la gauche
    if (!isAtLeftEdge) currentPosition -= 1;

    /* si apres deplacement on se retrouve dans un bloque pris (occuper)
    alors on le remet dans sa position initial (position d'avant le 
    deplacement, ici +=1 ) */
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }

    /* on aurait pu faire
    const isAtSideOfTakenBlock = current.some((index) =>
      squares[currentPosition + index - 1].classList.contains("taken")
    );

    if (!isAtLeftEdge && !isAtSideOfTakenBlock) currentPosition -= 1;
    */

    draw();
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();

    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    /*let isAtSideOfTakenBlock = current.some((index) =>
      squares[currentPosition + index + 1].classList.contains("taken")
    );*/

    if (!isAtRightEdge /* && !isAtSideOfTakenBlock*/) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index + 1].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  //rotate the tetromino
  function rotate() {
    undraw();

    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];

    draw();
  }

  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
  ];

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //add functionality to the button
  startBtn?.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        // scoreDisplay?.innerHTML = score.toString;
        if (scoreDisplay) {
          scoreDisplay.innerHTML = score.toString();
        }
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid?.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      if (scoreDisplay) {
        scoreDisplay.innerHTML = "end";
      }
      clearInterval(timerId);
    }
  }
  // console.log(theTetrominoes);
  // console.log(theTetrominoes);

  // console.log(theTetrominoes);
});
