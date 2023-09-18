/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/cpuPlayer.js":
/*!**********************************!*\
  !*** ./src/classes/cpuPlayer.js ***!
  \**********************************/
/***/ ((module) => {

class CpuPlayer {
  constructor(name, game) {
    this.name = name;
    this.ships = game.getDefaultShipList();
  }
}

module.exports = CpuPlayer;


/***/ }),

/***/ "./src/classes/game.js":
/*!*****************************!*\
  !*** ./src/classes/game.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Player = __webpack_require__(/*! ./player */ "./src/classes/player.js");
const CpuPlayer = __webpack_require__(/*! ./cpuPlayer */ "./src/classes/cpuPlayer.js");
const GameBoard = __webpack_require__(/*! ./gameBoard */ "./src/classes/gameBoard.js");
const Ship = __webpack_require__(/*! ./ship */ "./src/classes/ship.js");
const canAddShip = __webpack_require__(/*! ../classes/gameBoardFunctions/canAddShip */ "./src/classes/gameBoardFunctions/canAddShip.js");

const submarineIconPath = __webpack_require__(/*! ../assets/submarine-svgrepo-com.svg */ "./src/assets/submarine-svgrepo-com.svg");
const battleshipIconPath = __webpack_require__(/*! ../assets/cruiser-military-svgrepo-com.svg */ "./src/assets/cruiser-military-svgrepo-com.svg");
const destroyerIconPath = __webpack_require__(/*! ../assets/boat-collection-filled-svgrepo-com.svg */ "./src/assets/boat-collection-filled-svgrepo-com.svg");
const carrierIconPath = __webpack_require__(/*! ../assets/1540235856.svg */ "./src/assets/1540235856.svg");
const patrolIconPath = __webpack_require__(/*! ../assets/4047322-boat-harbour-seagoing-ship-tug-tugboat-tugboats_113549.svg */ "./src/assets/4047322-boat-harbour-seagoing-ship-tug-tugboat-tugboats_113549.svg");

class Game {
  constructor(playerName, cpuName) {
    this.player = new Player(playerName, this);
    this.cpu = new CpuPlayer(cpuName, this);
    this.playerBoard = new GameBoard(10, 10, "empty");
    this.cpuBoard = new GameBoard(10, 10, "empty");
    this.generateRandomBoard(this.cpuBoard, this.cpu);
  }

  getDefaultShipList() {
    const carrier = new Ship(5, "Carrier", null, null, carrierIconPath);
    const battleship = new Ship(4, "Battleship", null, null, battleshipIconPath);
    const destroyer = new Ship(3, "Destroyer", null, null, destroyerIconPath);
    const submarine = new Ship(3, "Submarine", null, null, submarineIconPath);
    const patrol = new Ship(2, "Patrol", null, null, patrolIconPath);
    const shipList = [carrier, battleship, destroyer, submarine, patrol];
    return shipList;
  }

  generateRandomBoard(board, player) {
    for (let i = 0; i < board.height; i++) {
      for (let j = 0; j < board.width; j++) {
        board.grid[i][j] === board.fill;
      }
    }

    const ships = player.ships;
    for (let ship of ships) {
      board.removeShip(ship);
      const [location, delta] = pickRandom(board, ship);
      ship.location = location;
      ship.delta = delta;
      board.addShip(ship);
    }
  }
}

function pickRandom(board, ship) {
  x = Math.floor(Math.random() * board.height);
  y = Math.floor(Math.random() * board.width);
  delta = (Math.random() > 0.5) ? [1, 0] : [0, 1];
  if (canAddShip(board.height, board.width, [x, y], delta, ship.len, board.grid)) {
    return [[x, y], delta];
  } else {
    return pickRandom(board, ship);
  }
}

module.exports = Game;


/***/ }),

/***/ "./src/classes/gameBoard.js":
/*!**********************************!*\
  !*** ./src/classes/gameBoard.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const create2dArray = __webpack_require__(/*! ./gameBoardFunctions/create2dArray */ "./src/classes/gameBoardFunctions/create2dArray.js");
const canAddShip = __webpack_require__(/*! ./gameBoardFunctions/canAddShip */ "./src/classes/gameBoardFunctions/canAddShip.js");
const createElement = __webpack_require__(/*! ../helpers/createElement */ "./src/helpers/createElement.js");
const enemyMove = __webpack_require__(/*! ./gameBoardFunctions/enemyMove */ "./src/classes/gameBoardFunctions/enemyMove.js");
const sunkCheck = __webpack_require__(/*! ./gameBoardFunctions/sunkCheck */ "./src/classes/gameBoardFunctions/sunkCheck.js");
const renderWinnderPage = __webpack_require__(/*! ../pages/winnerPage */ "./src/pages/winnerPage.js");
const renderWinnerPage = __webpack_require__(/*! ../pages/winnerPage */ "./src/pages/winnerPage.js");

class GameBoard {
  constructor(width, height) {
    this.height = height;
    this.width = width;
    this.fill = "empty";
    this.impact = "impact";
    this.shipSquare = "ship";
    this.hitShip = "hitShip";
    this.preview = "preview";
    this.sunkShip = "sunkShip";
    this.grid = create2dArray(width, height, this.fill);
    this.addedShips = [];
  }

  receiveAttack(location) {
    const x = location[0];
    const y = location[1];

    if (this.grid[x][y] === this.shipSquare) {
      this.grid[x][y] = this.hitShip;
    } else if (this.grid[x][y] === this.fill) {
      this.grid[x][y] = this.impact;
    }
  }

  sinkShip(ship) {
    const x = ship.location[0];
    const y = ship.location[1];
    const dx = ship.delta[0];
    const dy = ship.delta[1];

    for (let i = 0; i < ship.len; i++) {
      this.grid[x + (i * dx)][y + (i * dy)] = this.sunkShip;
    }
  }

  canAttackSquare(location) {
    const x = location[0];
    const y = location[1];

    if (this.grid[x][y] === this.marker || this.grid[x][y] === this.hitShip) {
      return false;
    }
    return true;
  }

  addShip(ship) {
    const x = ship.location[0];
    const y = ship.location[1];
    const dx = ship.delta[0];
    const dy = ship.delta[1];

    if (canAddShip(this.height, this.width, ship.location, ship.delta, ship.len, this.grid)) {
      for (let i = 0; i < ship.len; i++) {
        this.grid[x + dx * i][y + dy * i] = this.shipSquare;
      }
      this.addedShips.push(ship);
    }
  }

  removeShip(ship) {
    if (ship.location === null) {
      return;
    }

    const x = ship.location[0];
    const y = ship.location[1];
    const dx = ship.delta[0];
    const dy = ship.delta[1];

    for (let i = 0; i < ship.len; i++) {
      this.grid[x + dx * i][y + dy * i] = this.fill;
    }

    const indexToRemove = this.addedShips.findIndex(
      existingShip => existingShip.name === ship.name
    );

    if (indexToRemove !== -1) {
      this.addedShips.splice(indexToRemove, 1);
    }

    ship.location = null;
    ship.delta = null;
  }

  hasAliveShips(board) {
    for (let row of board) {
      for (let cell of row) {
        if (cell === this.shipSquare) {
          return true;
        }
      }
    }
    return false;
  }

  renderSelfSetup(shipsVisible, selectedShip, currentDelta) {
    const boardContainer = createElement("div", { class: "boardContainer" });

    for (let i = 0; i < this.height; i++) {
      const rowElement = createElement("div", { class: "row" });

      for (let j = 0; j < this.width; j++) {
        const cellElement = createElement("div", { class: "cell" });

        cellElement.addEventListener("mousedown", () => {
          selectedShip.delta = currentDelta;
          selectedShip.location = [i, j];
          if (
            canAddShip(
              this.height,
              this.width,
              selectedShip.location,
              selectedShip.delta,
              selectedShip.len,
              this.grid
            ) &&
            !this._inAddedShips(selectedShip)
          ) {
            this.addShip(selectedShip);
          }
        });

        cellElement.addEventListener("mouseover", () => {
          if (
            selectedShip !== null &&
            canAddShip(this.height, this.width, [i, j], currentDelta, selectedShip.len, this.grid)
          ) {
            this._previewHighlight(selectedShip, currentDelta, i, j);
          }
        });

        if (this.grid[i][j] === "preview") {
          cellElement.style.backgroundColor = "red";
        }

        if (this.grid[i][j] === this.shipSquare && shipsVisible) {
          cellElement.style.backgroundColor = "orange";
        }

        if (this.grid[i][j] === this.sunkShip) {
          cellElement.style.backgroundColor = "black";
        }

        rowElement.append(cellElement);
      }
      boardContainer.append(rowElement);
    }
    return boardContainer;
  }

  renderSelfGameplay(isPlayer, game) {

    const boardContainer = createElement("div", { class: "gameplayBoardContainer" });

    for (let i = 0; i < this.height; i++) {
      const rowElement = createElement("div", { class: "row" });

      for (let j = 0; j < this.width; j++) {
        const cellElement = createElement("div", { class: "cell" });
        let squareValue = this.grid[i][j];

        if (isPlayer) {
          if (squareValue === this.shipSquare) {
            cellElement.style.backgroundColor = "orange";
          }
        }

        if (!isPlayer) {
          cellElement.addEventListener("mouseover", () => {
            if (squareValue !== this.hitShip && squareValue !== this.impact && squareValue !== this.sunkShip) {
              cellElement.style.backgroundColor = "#fffb29";
            }
          });

          cellElement.addEventListener("mousedown", () => {
            squareValue = this.grid[i][j];
            if (squareValue !== this.hitShip && squareValue !== this.impact && squareValue !== this.sunkShip) {

              this.receiveAttack([i, j]);
              sunkCheck(game);

              if (!this.hasAliveShips(game.cpuBoard.grid)) {
                let winnerEvent = new Event("winnerPlayer");
                document.dispatchEvent(winnerEvent);
              }

              enemyMove(game);
              if (!this.hasAliveShips(game.playerBoard.grid)) {
                let winnerEvent = new Event("winnerCpu");
                document.dispatchEvent(winnerEvent);
              }
            }
          });
        }

        if (squareValue === this.impact) {
          cellElement.style.backgroundColor = "#20509e";
        }

        if (squareValue === this.hitShip) {
          cellElement.style.backgroundColor = "red";
        }

        if (squareValue === this.sunkShip) {
          cellElement.style.backgroundColor = "orange";
        }

        rowElement.append(cellElement);
      }
      boardContainer.append(rowElement);
    }
    return boardContainer
  }

  _previewHighlight(selectedShip, currentDelta, x, y) {
    this._clearPreview();
    for (let i = 0; i < selectedShip.len; i++) {
      this.grid[currentDelta[0] * i + x][currentDelta[1] * i + y] = this.preview;
    }
  }

  _clearPreview() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.grid[i][j] === this.preview) {
          this.grid[i][j] = this.fill;
        }
      }
    }
  }

  _inAddedShips(addAttemptShip) {
    for (let ship of this.addedShips) {
      if (ship.name === addAttemptShip.name) {
        return true;
      }
    }
    return false;
  }
}

module.exports = GameBoard;


/***/ }),

/***/ "./src/classes/gameBoardFunctions/canAddShip.js":
/*!******************************************************!*\
  !*** ./src/classes/gameBoardFunctions/canAddShip.js ***!
  \******************************************************/
/***/ ((module) => {

function _isInBounds(currentSquare, boardHeight, boardWidth) {
  if (
    currentSquare[0] >= boardHeight ||
    currentSquare[1] >= boardWidth ||
    currentSquare[0] < 0 ||
    currentSquare[1] < 0
  ) {
    return false;
  }
  return true;
}

function canAddShip(boardHeight, boardWidth, location, delta, length, grid) {
  const x = location[0];
  const y = location[1];
  const dx = delta[0];
  const dy = delta[1];

  for (let i = 0; i < length; i++) {
    const currentSquareX = x + dx * i;
    const currentSquareY = y + dy * i;

    if (
      !_isInBounds([currentSquareX, currentSquareY], boardHeight, boardWidth)
    ) {
      return false;
    }

    if (grid[currentSquareX][currentSquareY] === "ship") {
      return false;
    }
  }
  return true;
}

module.exports = canAddShip;


/***/ }),

/***/ "./src/classes/gameBoardFunctions/create2dArray.js":
/*!*********************************************************!*\
  !*** ./src/classes/gameBoardFunctions/create2dArray.js ***!
  \*********************************************************/
/***/ ((module) => {

function create2dArray(width, height, fill) {
  let res = [];
  for (let i = 0; i < height; i++) {
    let row = [];
    for (let i = 0; i < width; i++) {
      row.push(fill);
    }
    res.push(row);
  }
  return res;
}

module.exports = create2dArray;


/***/ }),

/***/ "./src/classes/gameBoardFunctions/enemyMove.js":
/*!*****************************************************!*\
  !*** ./src/classes/gameBoardFunctions/enemyMove.js ***!
  \*****************************************************/
/***/ ((module) => {

function enemyMove(game) {
  let x = Math.floor(Math.random() * game.playerBoard.height);
  let y = Math.floor(Math.random() * game.playerBoard.width);
  const impactSquare = game.playerBoard.impact;
  const hitSquare = game.playerBoard.hitShip

  if (game.playerBoard.grid[x][y] !== impactSquare && game.playerBoard.grid[x][y] !== hitSquare) {
    game.playerBoard.receiveAttack([x, y]);
  } else {
    enemyMove(game);
  }
}

function smarterEnemyMoves(game) {
  const width = game.playerBoard.width;
  const height = game.playerBoard.height;
  const grid = game.playerBoard.grid;
  const hitShip = game.playerBoard.hitShip;
  const fill = game.playerBoard.fill;
  const ship = game.playerBoard.shipSquare;

  const searchDeltas = [[1, 0], [0, 1], [-1, 0], [0, -1]];

  // Search for a hit ship on the board
  let shipIdx = [-1, -1];
  let searchDirection = [0, 0];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j] === hitShip) {

        // Check surrounding cells for a hit ship
        for (let delta of searchDeltas) {
          const newX = i + delta[0];
          const newY = j + delta[1];

          if (newX >= 0 && newX < height && newY >= 0 && newY < width && grid[newX][newY] === hitShip) {
            searchDirection = delta;
            shipIdx = [i, j];
            break;
          }
        }

        searchDirection = searchDeltas[Math.floor(Math.random() * 4)];
        shipIdx = [i, j];
        break;
      }
    }
    if (searchDirection[0] !== 0 || searchDirection[1] !== 0) {
      break;
    }
  }

  if (shipIdx[0] === -1 && shipIdx[1] === -1) {
    // No hit ship found, perform a random move
    enemyMove(game);
    return;
  }

  // Move in the searchDirection until an empty cell is found
  let x = shipIdx[0] + searchDirection[0];
  let y = shipIdx[1] + searchDirection[1];

  while (x >= 0 && x < height && y >= 0 && y < width && grid[x][y] === hitShip) {
    x += searchDirection[0];
    y += searchDirection[1];
  }

  if (x >= 0 && x < height && y >= 0 && y < width &&
    (grid[x][y] === fill || grid[x][y] === ship)) {
    // Valid move, attack the cell
    game.playerBoard.receiveAttack([x, y]);
  } else {
    // Invalid move, perform a random move
    enemyMove(game);
  }
}

module.exports = smarterEnemyMoves;



/***/ }),

/***/ "./src/classes/gameBoardFunctions/sunkCheck.js":
/*!*****************************************************!*\
  !*** ./src/classes/gameBoardFunctions/sunkCheck.js ***!
  \*****************************************************/
/***/ ((module) => {

function sunkCheckEnemy(game) {
  const ships = game.cpu.ships;
  for (let ship of ships) {
    if (ship.isSunk(game.cpuBoard)) {
      game.cpuBoard.sinkShip(ship);
    }
  }

}

module.exports = sunkCheckEnemy;


/***/ }),

/***/ "./src/classes/player.js":
/*!*******************************!*\
  !*** ./src/classes/player.js ***!
  \*******************************/
/***/ ((module) => {

class Player {
  constructor(name, game) {
    this.name = name;
    this.ships = game.getDefaultShipList();
  }
}

module.exports = Player;


/***/ }),

/***/ "./src/classes/ship.js":
/*!*****************************!*\
  !*** ./src/classes/ship.js ***!
  \*****************************/
/***/ ((module) => {

class Ship {
  constructor(len, name, location, delta, iconSrc) {
    this.len = len;
    this.name = name;
    this.location = location;
    this.delta = delta;
    this.hitSquares = [];
    this.iconSrc = iconSrc;
  }

  isSunk(board) {
    const x = this.location[0];
    const y = this.location[1];
    const dx = this.delta[0];
    const dy = this.delta[1];

    for (let i = 0; i < this.len; i++) {
      if (board.grid[x + dx * i][y + dy * i] === "ship") {
        return false;
      }
    }
    return true;
  }
}

module.exports = Ship;


/***/ }),

/***/ "./src/helpers/createElement.js":
/*!**************************************!*\
  !*** ./src/helpers/createElement.js ***!
  \**************************************/
/***/ ((module) => {

function createElement(tag, attributes = {}, textContent = "") {
  const element = document.createElement(tag);
  for (const attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  element.textContent = textContent;
  return element;
}

module.exports = createElement;


/***/ }),

/***/ "./src/pages/boardSetupFunctions/allShipsUsed.js":
/*!*******************************************************!*\
  !*** ./src/pages/boardSetupFunctions/allShipsUsed.js ***!
  \*******************************************************/
/***/ ((module) => {

function allShipsUsed(shipsList) {
  for (let ship of shipsList) {
    if (ship.location === null) {
      return false;
    }
  }
  return true;
}

module.exports = allShipsUsed;


/***/ }),

/***/ "./src/pages/boardSetupPage.js":
/*!*************************************!*\
  !*** ./src/pages/boardSetupPage.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const createElement = __webpack_require__(/*! ../helpers/createElement */ "./src/helpers/createElement.js");
const allShipsUsed = __webpack_require__(/*! ./boardSetupFunctions/allShipsUsed */ "./src/pages/boardSetupFunctions/allShipsUsed.js");
const xSvg = __webpack_require__(/*! ../assets/x-symbol-svgrepo-com.svg */ "./src/assets/x-symbol-svgrepo-com.svg");
const renderGamePage = __webpack_require__(/*! ./gamePage */ "./src/pages/gamePage.js");

function renderSetupPage(game, root) {
  root.classList.add("setupPage");
  let selectedShip = null;
  let lastSelected = null;

  let boardAndSelectionContainer = createElement("div", {
    id: "boardAndSelectionContainer"
  });

  // ship direction buttons ------------------------------------------------------------------------
  let currentDelta = [1, 0];

  const directionButtonsContainer = createElement("div", {
    id: "directionButtonsContainer"
  });

  const verticalButton = createElement("button", { id: "directionVerticalButton" }, "Vertical");
  verticalButton.addEventListener("click", () => {
    currentDelta = [1, 0];
  });

  const horizontalButton = createElement(
    "button",
    { id: "directionHorizontalButton" },
    "Horizontal"
  );
  horizontalButton.addEventListener("click", () => {
    currentDelta = [0, 1];
  });

  directionButtonsContainer.append(verticalButton, horizontalButton);

  // board -----------------------------------------------------------------------------------------
  const gameBoardContainer = createElement("div", { id: "gameBoardContainer" });
  let running = true;

  function updateBoard() {
    gameBoardContainer.innerHTML = "";

    const gameBoardElement = game.playerBoard.renderSelfSetup(true, selectedShip, currentDelta);
    gameBoardContainer.append(gameBoardElement);

    if (running) {
      requestAnimationFrame(updateBoard);
    }
  }

  updateBoard();

  // ship selection --------------------------------------------------------------------------------
  const defaultShipList = game.player.ships;

  const shipSelectionContainer = createElement("div", {
    id: "shipSelectionContainer"
  });

  for (let ship of defaultShipList) {
    const shipAndRemoveButtonContainer = createElement("div", {
      class: "shipAndRemoveButtonContainer"
    });
    const shipContainer = createElement("div", { class: "shipContainer" });

    shipContainer.addEventListener("click", () => {
      selectedShip = ship;
      if (lastSelected !== null) {
        lastSelected.style.backgroundColor = "rgb(34, 34, 34)";
      }
      lastSelected = shipContainer;
      shipContainer.style.backgroundColor = "#FFFFFF";
    });

    const shipIcon = createElement("img", {
      class: "shipIcon",
      src: ship.iconSrc
    });

    const shipName = createElement("p", { class: "shipName" }, ship.name);

    const removeShipButton = createElement("img", { class: "removeShipButton", src: xSvg });
    removeShipButton.addEventListener("click", () => {
      removeShipButton.style.maxWidth = "13px";
      game.playerBoard.removeShip(ship);
      setTimeout(() => {
        removeShipButton.style.maxWidth = "21px";
      }, 55);
    });

    shipContainer.append(shipIcon, shipName);
    shipAndRemoveButtonContainer.append(shipContainer, removeShipButton);
    shipSelectionContainer.append(shipAndRemoveButtonContainer);
  }
  boardAndSelectionContainer.append(gameBoardContainer, shipSelectionContainer);

  // randomize and complete button ----------------------------------------------------------------
  const bottomButtonsContainer = createElement("div", { id: "bottomButtonsContainer" });

  const randomizeButton = createElement("button", { id: "randomizeButton" }, "Randomize!");

  randomizeButton.addEventListener("click", () => {
    game.generateRandomBoard(game.playerBoard, game.player);
  });

  const submitButton = createElement("button", { id: "setupSubmitButton" }, "Finished");
  const unfilledMessage = createElement(
    "h2",
    { id: "unfilledMessage" },
    "Please place all ships. One or more are missing"
  );

  submitButton.addEventListener("click", () => {
    if (allShipsUsed(defaultShipList)) {
      renderGamePage(game, root);
    } else {
      root.append(unfilledMessage);
    }
  });

  bottomButtonsContainer.append(randomizeButton, submitButton);
  root.append(directionButtonsContainer, boardAndSelectionContainer, bottomButtonsContainer);
}

module.exports = renderSetupPage;


/***/ }),

/***/ "./src/pages/gamePage.js":
/*!*******************************!*\
  !*** ./src/pages/gamePage.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const createElement = __webpack_require__(/*! ../helpers/createElement */ "./src/helpers/createElement.js");

function renderGamePage(game, parent) {
  parent.innerHTML = "";
  const boardsContainer = createElement("div", { id: "boardsContainer" });

  let running = true;
  function renderBoards() {
    boardsContainer.innerHTML = ""

    const playerBoardContainer = createElement("div", { id: "playerBoardContainer" });
    const playerNameText = game.player.name;
    const playerTitleBar = createElement("h2", { class: "boardTitle" }, playerNameText);
    const playerBoard = game.playerBoard.renderSelfGameplay(true, game);
    playerBoardContainer.append(playerTitleBar, playerBoard);

    const cpuBoardContainer = createElement("div", { id: "cpuBoardContainer" });
    const cpuNameText = game.cpu.name;
    const cpuTitleBar = createElement("h2", { class: "boardTitle" }, cpuNameText);
    const cpuBoard = game.cpuBoard.renderSelfGameplay(false, game);
    cpuBoardContainer.append(cpuTitleBar, cpuBoard);

    boardsContainer.append(playerBoardContainer, cpuBoardContainer);

    if (running) {
      requestAnimationFrame(renderBoards);
    }
  }

  renderBoards(parent);

  parent.append(boardsContainer);
}

module.exports = renderGamePage;


/***/ }),

/***/ "./src/pages/playerNamePage.js":
/*!*************************************!*\
  !*** ./src/pages/playerNamePage.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const createElement = __webpack_require__(/*! ../helpers/createElement */ "./src/helpers/createElement.js");

function renderPlayerNamePage(root) {
  return new Promise((resolve, reject) => {
    const inputContainer = createElement("div", {
      id: "usernameInputContainer",
    });

    const inputTag = createElement(
      "label",
      { id: "usernameInputLabel", for: "usernameInput" },
      "Username: "
    );

    const inputField = createElement(
      "input",
      { id: "usernameInput", type: "text", }
    );

    const submitButton = createElement(
      "button",
      { id: "usernameSubmitButton" },
      "Submit"
    );

    const warningMessage = createElement(
      "h2",
      { id: "warningMessage" },
      "Please enter a username."
    );

    submitButton.addEventListener("click", () => {
      const playerName = inputField.value.trim();
      if (playerName.length > 0) {
        resolve(playerName);
      } else {
        inputContainer.append(warningMessage);
      }
    });

    inputContainer.append(inputTag, inputField, submitButton);
    root.append(inputContainer);
  });
}

module.exports = renderPlayerNamePage;


/***/ }),

/***/ "./src/pages/winnerPage.js":
/*!*********************************!*\
  !*** ./src/pages/winnerPage.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const createElement = __webpack_require__(/*! ../helpers/createElement */ "./src/helpers/createElement.js");

function renderWinnerPage(winner, parent) {
  parent.innerHTML = "";
  const winnerText = createElement("h1", { id: "winnerText" }, `${winner} won!`);
  parent.append(winnerText);
}

module.exports = renderWinnerPage;


/***/ }),

/***/ "./src/assets/1540235856.svg":
/*!***********************************!*\
  !*** ./src/assets/1540235856.svg ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "images/15402358566529646eabf25be0aede.svg";

/***/ }),

/***/ "./src/assets/4047322-boat-harbour-seagoing-ship-tug-tugboat-tugboats_113549.svg":
/*!***************************************************************************************!*\
  !*** ./src/assets/4047322-boat-harbour-seagoing-ship-tug-tugboat-tugboats_113549.svg ***!
  \***************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwMDAgMTAwMDsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGNpcmNsZSBjeD0iNDM0LjgwOSIgY3k9IjU0OC45ODciIHI9IjI0LjYyOCIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiLz48ZWxsaXBzZSBjeD0iMzM2LjU3MiIgY3k9IjUyMy4yNjEiIHJ4PSIyNC42MjgiIHJ5PSIyNC42MjgiIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzEgLTAuNzA3MSAwLjcwNzEgMC43MDcxIC0yNzEuNDIxNiAzOTEuMjUxNykiLz48ZWxsaXBzZSBjeD0iNTI3LjA2IiBjeT0iNTkyLjM5NyIgcng9IjI0LjYyOCIgcnk9IjI0LjYyOCIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIHRyYW5zZm9ybT0ibWF0cml4KDAuOTczMiAtMC4yMjk4IDAuMjI5OCAwLjk3MzIgLTEyMi4wMDU1IDEzNi45NDA2KSIvPjxwYXRoIGQ9Ik0yMjIuMjQ5LDcwNS43NzRoNTg5LjgwN2M1LjM2MSwwLDEwLjAyOC0zLjY2MywxMS4zMDItOC44N2w1Ljc4MS0yMy42M0gyMDQuOTc5bDUuOTksMjMuNzE0ICBDMjEyLjI3NCw3MDIuMTU0LDIxNi45MjEsNzA1Ljc3NCwyMjIuMjQ5LDcwNS43NzR6IiBzdHlsZT0iZmlsbDojRkZGRkZGOyIvPjxwYXRoIGQ9Ik04NDYuNzE4LDYwMS40MzVjMC42Mi0yLjU2LTEuNjQtNC44OS00LjIxMS00LjMxOWMtMTQuOTQsMy4yNjktNTguMzcsMTAuODktMTEzLjMyLDMuNSAgYy01LjIzLTAuNjktMTAuNTctMS41My0xNi0yLjUyMWMtNi4yMi0xLjE0LTEyLjU2LTIuNDctMTktNC4wNGMtNS4yNy0xLjI3LTEwLjYxLTIuNzEtMTYtNC4zYy0zMC43Mi05LjEtNjMuMTMtMjMuNTctOTUtNDUuOTgxICBjLTEyNi45Ni04OS4yNy0zMTguMTMtMTI5LjM1LTQyNy45Ni03OS4yMzljLTEuNTUsMC42OTktMi4zNiwyLjQzOS0xLjk0LDQuMDlsNDcuNCwxODcuNjQ5aDYzMi42MUw4NDYuNzE4LDYwMS40MzV6ICAgTTIzOC4zMzgsNTU3LjQ4NWMtMjIuOTYsMC00MS42My0xOC42Ny00MS42My00MS42M2MwLTIyLjk0OSwxOC42Ny00MS42Miw0MS42My00MS42MmMyMi45NSwwLDQxLjYyLDE4LjY3MSw0MS42Miw0MS42MiAgQzI3OS45NTgsNTM4LjgxNSwyNjEuMjg4LDU1Ny40ODUsMjM4LjMzOCw1NTcuNDg1eiBNMzM2LjU2OCw1NjQuODg2Yy0yMi45NSwwLTQxLjYyLTE4LjY3LTQxLjYyLTQxLjYzICBjMC0yMi45NSwxOC42Ny00MS42Miw0MS42Mi00MS42MmMyMi45NiwwLDQxLjYzLDE4LjY3LDQxLjYzLDQxLjYyQzM3OC4xOTgsNTQ2LjIxNiwzNTkuNTI4LDU2NC44ODYsMzM2LjU2OCw1NjQuODg2eiAgIE00MzQuODA4LDU5MC42MTZjLTIyLjk1LDAtNDEuNjMtMTguNjcxLTQxLjYzLTQxLjYzMWMwLTIyLjk0OSwxOC42OC00MS42Myw0MS42My00MS42M2MyMi45NiwwLDQxLjYzLDE4LjY4MSw0MS42Myw0MS42MyAgQzQ3Ni40MzgsNTcxLjk0NSw0NTcuNzY4LDU5MC42MTYsNDM0LjgwOCw1OTAuNjE2eiBNNTI3LjA1OCw2MzQuMDI1Yy0yMi45NSwwLTQxLjYzLTE4LjY3LTQxLjYzLTQxLjYzICBjMC0yMi45NSwxOC42OC00MS42Myw0MS42My00MS42M2MyMi45NiwwLDQxLjYzLDE4LjY4LDQxLjYzLDQxLjYzQzU2OC42ODgsNjE1LjM1Niw1NTAuMDE4LDYzNC4wMjUsNTI3LjA1OCw2MzQuMDI1eiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiLz48cGF0aCBkPSJNMjM4LjMzNSw0OTEuMjMxYy0xMy41OCwwLTI0LjYyOCwxMS4wNDgtMjQuNjI4LDI0LjYyOGMwLDEzLjU4LDExLjA0OCwyNC42MjgsMjQuNjI4LDI0LjYyOCAgYzEzLjU3OSwwLDI0LjYyNy0xMS4wNDgsMjQuNjI3LTI0LjYyOEMyNjIuOTYxLDUwMi4yNzksMjUxLjkxNCw0OTEuMjMxLDIzOC4zMzUsNDkxLjIzMXoiIHN0eWxlPSJmaWxsOiNGRkZGRkY7Ii8+PHBhdGggZD0iTTMyMy45MTgsMzg3Ljk3NmwtNy4xMywzOS45OWM5NS4yMyw5LjMxLDE5Ny41MSw0Ni41OSwyNzYuMTgsMTAxLjkgIGMxMi41LDguNzksMjUuMDksMTYuMjc5LDM3LjYyLDIyLjY0OWwyOC4zNi0xNTkuMTA5YzEuNjktOS40OC01LjYtMTguMTgxLTE1LjIyOS0xOC4xODFoLTMwNC41NyAgQzMzMS42NDgsMzc1LjIyNiwzMjUuMjI4LDM4MC41OTYsMzIzLjkxOCwzODcuOTc2eiBNNTY5LjAzOCw0MDMuOTc2YzAtMy43MjksMy4wMi02Ljc1LDYuNzUtNi43NWg0Mi4wOCAgYzMuNzMsMCw2Ljc1LDMuMDIxLDYuNzUsNi43NXY4LjVjMCwzLjczLTMuMDIsNi43NS02Ljc1LDYuNzVoLTQyLjA4Yy0zLjczLDAtNi43NS0zLjAyLTYuNzUtNi43NVY0MDMuOTc2eiBNNTY5LjAzOCw0NDguNjI2ICBjMC0zLjczLDMuMDItNi43NSw2Ljc1LTYuNzVoNDIuMDhjMy43MywwLDYuNzUsMy4wMiw2Ljc1LDYuNzV2OC41YzAsMy43Mi0zLjAyLDYuNzUtNi43NSw2Ljc1aC00Mi4wOGMtMy43MywwLTYuNzUtMy4wMy02Ljc1LTYuNzUgIFY0NDguNjI2eiBNNDk3Ljc4OCw0MDMuOTc2YzAtMy43MjksMy4wMi02Ljc1LDYuNzUtNi43NWg0Mi4wOGMzLjczLDAsNi43NSwzLjAyMSw2Ljc1LDYuNzV2OC41YzAsMy43My0zLjAyLDYuNzUtNi43NSw2Ljc1aC00Mi4wOCAgYy0zLjczLDAtNi43NS0zLjAyLTYuNzUtNi43NVY0MDMuOTc2eiBNNDk3Ljc4OCw0NDguNjI2YzAtMy43MywzLjAyLTYuNzUsNi43NS02Ljc1aDQyLjA4YzMuNzMsMCw2Ljc1LDMuMDIsNi43NSw2Ljc1djguNSAgYzAsMy43Mi0zLjAyLDYuNzUtNi43NSw2Ljc1aC00Mi4wOGMtMy43MywwLTYuNzUtMy4wMy02Ljc1LTYuNzVWNDQ4LjYyNnogTTQyNC41NzgsNDAzLjk3NmMwLTMuNzI5LDMuMDItNi43NSw2Ljc1LTYuNzVoNDIuMDggIGMzLjcyLDAsNi43NSwzLjAyMSw2Ljc1LDYuNzV2OC41YzAsMy43My0zLjAzLDYuNzUtNi43NSw2Ljc1aC00Mi4wOGMtMy43MywwLTYuNzUtMy4wMi02Ljc1LTYuNzVWNDAzLjk3NnogTTM1MS4zNjgsNDAzLjk3NiAgYzAtMy43MjksMy4wMi02Ljc1LDYuNzUtNi43NWg0Mi4wN2MzLjczLDAsNi43NSwzLjAyMSw2Ljc1LDYuNzV2OC41YzAsMy43My0zLjAyLDYuNzUtNi43NSw2Ljc1aC00Mi4wNyAgYy0zLjczLDAtNi43NS0zLjAyLTYuNzUtNi43NVY0MDMuOTc2eiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiLz48cGF0aCBkPSJNMzc3LjUxOCwzMDMuOTI2bC05LjY4LDU0LjNoMjU1LjY1bDguOTQtNTAuMTZjMS4yOS03LjIyLTQuMjYtMTMuODQtMTEuNTktMTMuODRoLTIzMS43NCAgQzM4My4zOTgsMjk0LjIyNiwzNzguNTE4LDI5OC4zMTUsMzc3LjUxOCwzMDMuOTI2eiBNNTQ1LjY0OCwzMjEuOTc2YzAtMy43MjksMy4wMi02Ljc1LDYuNzUtNi43NWg0Mi4wOCAgYzMuNzMsMCw2Ljc1LDMuMDIxLDYuNzUsNi43NXY4LjVjMCwzLjczLTMuMDIsNi43NS02Ljc1LDYuNzVoLTQyLjA4Yy0zLjczLDAtNi43NS0zLjAyLTYuNzUtNi43NVYzMjEuOTc2eiBNNDcyLjQzOCwzMjEuOTc2ICBjMC0zLjcyOSwzLjAyLTYuNzUsNi43NS02Ljc1aDQyLjA4YzMuNzIsMCw2Ljc1LDMuMDIxLDYuNzUsNi43NXY4LjVjMCwzLjczLTMuMDMsNi43NS02Ljc1LDYuNzVoLTQyLjA4ICBjLTMuNzMsMC02Ljc1LTMuMDItNi43NS02Ljc1VjMyMS45NzZ6IE0zOTkuMjI4LDMyMS45NzZjMC0zLjcyOSwzLjAyLTYuNzUsNi43NS02Ljc1aDQyLjA4YzMuNzIsMCw2Ljc1LDMuMDIxLDYuNzUsNi43NXY4LjUgIGMwLDMuNzMtMy4wMyw2Ljc1LTYuNzUsNi43NWgtNDIuMDhjLTMuNzMsMC02Ljc1LTMuMDItNi43NS02Ljc1VjMyMS45NzZ6IiBzdHlsZT0iZmlsbDojRkZGRkZGOyIvPjxwYXRoIGQ9Ik02OTQuMTg4LDU3Ni40NzZjNi40NSwxLjY2LDEyLjc5LDMuMDcsMTksNC4yNzFjNS40NSwxLjA1LDEwLjc5LDEuOTM5LDE2LDIuNjggIGMxNy4xOCwyLjQ0LDMzLDMuMzEsNDYuODEsMy4zMWMxMy45NiwwLDI2LjM1LTAuODgsMzYuNTItMi4wMnYtMjUuODNjMC02LjA3LTQuOTItMTEtMTEtMTFoLTcyLjMzdi0xMzEuOTEgIGMwLTIuNjItMi4xMy00Ljc1LTQuNzUtNC43NWgtNi41Yy0yLjYyLDAtNC43NSwyLjEzLTQuNzUsNC43NXYxMzEuOTFoLTE5di0yNDMuOTFjMC0yLjYyLTIuMTMtNC43NS00Ljc1LTQuNzVoLTYuNSAgYy0yLjYyLDAtNC43NSwyLjEzLTQuNzUsNC43NXYyNDMuOTFoLTE0Yy02LjA3LDAtMTEsNC45My0xMSwxMXY0YzguNDMsMy40NiwxNi43OCw2LjQ1LDI1LDkuMDMgIEM2ODMuNTg4LDU3My42MTYsNjg4LjkxOCw1NzUuMTI2LDY5NC4xODgsNTc2LjQ3NnoiIHN0eWxlPSJmaWxsOiNGRkZGRkY7Ii8+PC9zdmc+";

/***/ }),

/***/ "./src/assets/boat-collection-filled-svgrepo-com.svg":
/*!***********************************************************!*\
  !*** ./src/assets/boat-collection-filled-svgrepo-com.svg ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+Cjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBpZD0iTGF5ZXJfMiIgdmVyc2lvbj0iMS4xIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cGF0aCBkPSJNMTUyLjIzNCw1MjEuNzc1bDIwLjcwMSw0Ny41MWMxMTQuOTMtMzQuOTYsNTcwLjI5OSw0OS40Niw2NTkuNTksNjYuNTdsMTUuMjQtNTUuMzQgIEM4NDcuNzY2LDU4MC41MTUsMjE4Ljc4NSw0NTUuOTk1LDE1Mi4yMzQsNTIxLjc3NXoiIHN0eWxlPSJmaWxsOiNGRkZGRkY7Ii8+PHBhdGggZD0iTTgyNi4xMzUsNjU5LjAzNWwxLjg1OS02Ljc0Yy02OC4xNDgtMTMuMDMtMzk4LjI4OS03NC40MS01NzEuMjM4LTc0LjQxICBjLTM0LjMxMSwwLTYwLjE5MSwyLjM5LTc2Ljk4LDcuMTFsMzMuMzIsNzYuNDdjMi44ODksNi42Miw5LjQyLDEwLjksMTYuNjQ4LDEwLjloNTc4Ljg4MSAgQzgxNi43OTUsNjcyLjM2NSw4MjMuOTY1LDY2Ni45MTUsODI2LjEzNSw2NTkuMDM1eiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiLz48cGF0aCBkPSJNMzAwLjc3NSw0NDYuODE1bC04LjI4MSwzOS41YzUwLjE4MiwxLjg5LDEwOC41OTIsNy4zNywxNjguMzYxLDE0LjZ2LTUxLjUzICBjMC02LjktNS42LTEyLjUtMTIuNS0xMi41aC0xMzUuMzVDMzA3LjA5Niw0MzYuODg1LDMwMS45ODQsNDQxLjAzNSwzMDAuNzc1LDQ0Ni44MTV6IiBzdHlsZT0iZmlsbDojRkZGRkZGOyIvPjxwYXRoIGQ9Ik01MTQuNjA2LDQ0MC4zODVoLTguNWMtNS4xMDksMC05LjI1LDQuMTQxLTkuMjUsOS4yNXYyNi4yNWgtMTl2MjcuMTIgIGM0My44NSw1LjUyLDg4LjA4LDExLjg4LDEzMCwxOC4zNnYtMzIuOThjMC02LjktNS42LTEyLjUtMTIuNS0xMi41aC05LjV2LTEwLjI1YzAtNS4xMDktNC4xNDMtOS4yNS05LjI1LTkuMjVoLTI0LjUgIGMtNS4xMDksMC05LjI1LDQuMTQxLTkuMjUsOS4yNXYxMC4yNWgtMTl2LTI2LjI1QzUyMy44NTYsNDQ0LjUyNiw1MTkuNzEzLDQ0MC4zODUsNTE0LjYwNiw0NDAuMzg1eiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiLz48cGF0aCBkPSJNMjU3LjAyNyw0NTAuNjI1YzQuNTI5LDAuNTAyLDguNjA3LTIuNzYzLDkuMTA5LTcuMjkxbDAuMTM1LTEuMjI0ICBjMC41MDItNC41MjktMi43NjItOC42MDctNy4yOTEtOS4xMDhsLTE4LjEyNS0yLjAwOHYtNi44NThjMC00LjU2LTMuNjkxLTguMjUtOC4yNS04LjI1aC0xM2MtNC41NjEsMC04LjI1LDMuNjktOC4yNSw4LjI1djMuNTg5ICBsLTQxLjMzLTQuNTc5Yy00LjUyOS0wLjUwMi04LjYwNywyLjc2My05LjEwOSw3LjI5MWwtMC4xMzUsMS4yMjRjLTAuNTAyLDQuNTI5LDIuNzYyLDguNjA3LDcuMjkxLDkuMTA4bDQzLjI4Myw0Ljc5NnY0MS43NiAgYzUuNTQ5LTAuNDgsMTEuNTM5LTAuODcsMTgtMS4xNmMzLjY4LTAuMTYsNy41MS0wLjI5LDExLjUtMC4zOWM1LjAzOS0wLjEyLDEwLjMzLTAuMTgsMTUuODg5LTAuMThoMi4xMTF2LTEwLjk2ICBjMC00LjU2LTMuNjkxLTguMjUtOC4yNS04LjI1aC05Ljc1di0xNy41NTJMMjU3LjAyNyw0NTAuNjI1eiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiLz48cGF0aCBkPSJNMzk2LjEwNSwzMjcuNjM1aC0xM2MtNC41NTcsMC04LjI1LDMuNjk0LTguMjUsOC4yNXYzLjU4OWwtNDEuMzMtNC41NzkgIGMtNC41MjktMC41MDItOC42MDcsMi43NjMtOS4xMDksNy4yOTFsLTAuMTM1LDEuMjI0Yy0wLjUwMiw0LjUyOSwyLjc2Miw4LjYwNyw3LjI5MSw5LjEwOGw0My4yODMsNC43OTZ2MjYuNDYxaC0yNS4wNDEgIGMtMy4yOTksMC02LjE1LDIuMzEtNi44Myw1LjU0bC02LjQxLDMwLjU3aDk1Ljc4MXYtMjkuMTRjMC0zLjg1LTMuMTIxLTYuOTctNi45OC02Ljk3aC0yMS4wMnYtMjMuMTkybDE2LjE3MiwxLjc5MiAgYzQuNTI5LDAuNTAyLDguNjA3LTIuNzYzLDkuMTA5LTcuMjkxbDAuMTM1LTEuMjI0YzAuNTAyLTQuNTI5LTIuNzYyLTguNjA3LTcuMjkxLTkuMTA4bC0xOC4xMjUtMi4wMDh2LTYuODU4ICBDNDA0LjM1NSwzMzEuMzI5LDQwMC42NjIsMzI3LjYzNSwzOTYuMTA1LDMyNy42MzV6IiBzdHlsZT0iZmlsbDojRkZGRkZGOyIvPjxwYXRoIGQ9Ik02NjMuODk0LDQyOS42NTVoMTcuNTYxdi0yMC45YzAtNS4xMS00LjE0MS05LjI1LTkuMjUtOS4yNWgtMjMuNDF2LTIxLjA0ICBjMC01LjExLTQuMTQxLTkuMjUtOS4yNS05LjI1aC04LjVjLTUuMTA5LDAtOS4yNSw0LjE0LTkuMjUsOS4yNXYxNDUuMDdjMjAuNjUsMy4yNSw0MC42NDEsNi41LDU5LjY2LDkuNjh2LTEyLjQ0aC0xNy41NjEgIGMtMi42LDAtNC43MDktMi4xMS00LjcwOS00Ljcxdi03LjU5YzAtMi42LDIuMTA5LTQuNyw0LjcwOS00LjdoMTcuNTYxdi0yMC42NWgtMTcuNTYxYy0yLjYsMC00LjcwOS0yLjExLTQuNzA5LTQuNzF2LTcuNTggIGMwLTIuNiwyLjEwOS00LjcxLDQuNzA5LTQuNzFoMTcuNTYxdi0xOS40N2gtMTcuNTYxYy0yLjYsMC00LjcwOS0yLjExLTQuNzA5LTQuNzF2LTcuNTggIEM2NTkuMTg1LDQzMS43NjUsNjYxLjI5NSw0MjkuNjU1LDY2My44OTQsNDI5LjY1NXoiIHN0eWxlPSJmaWxsOiNGRkZGRkY7Ii8+PHBhdGggZD0iTTcxOC41MjUsNTA3Ljg4NWMtNy45MiwwLTE0LjM0LDYuNDItMTQuMzQsMTQuMzN2MTQuODRjNDAuNjA5LDYuOTMsNzUuNjI5LDEzLjI5LDEwMS4zNCwxOC4wOCAgdi0zMi45MmMwLTcuOTEtNi40Mi0xNC4zMy0xNC4zNC0xNC4zM2gtMTguMjQ4di0xNC40NTZsNDMuMjgzLTQuNzk1YzQuNTI5LTAuNTAyLDcuNzkzLTQuNTgsNy4yOTEtOS4xMDhsLTAuMTM1LTEuMjI0ICBjLTAuNTAyLTQuNTI5LTQuNTgtNy43OTMtOS4xMDktNy4yOTJsLTQxLjMzLDQuNTc5VjQ3MmMwLTQuNTU2LTMuNjkzLTguMjUtOC4yNS04LjI1aC0xM2MtNC41NTUsMC04LjI1LDMuNjk0LTguMjUsOC4yNXY2Ljg1OCAgbC0xOC4xMjUsMi4wMDhjLTQuNTI5LDAuNTAyLTcuNzkzLDQuNTgtNy4yOTEsOS4xMDhsMC4xMzUsMS4yMjRjMC41MDIsNC41MjksNC41OCw3Ljc5Myw5LjEwOSw3LjI5MmwxNi4xNzItMS43OTJ2MTEuMTg3SDcxOC41MjV6IiBzdHlsZT0iZmlsbDojRkZGRkZGOyIvPjwvc3ZnPg==";

/***/ }),

/***/ "./src/assets/cruiser-military-svgrepo-com.svg":
/*!*****************************************************!*\
  !*** ./src/assets/cruiser-military-svgrepo-com.svg ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgZmlsbD0iI0ZGRkZGRiIgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00NTYuMjI1LDI1NC43NzhjLTIuMjExLTEwLjYxOC02LjY5Ni0yMC40MDktMTIuOTEzLTI4Ljg1aDY3LjczM3YtMzAuNDA0SDM4My4zMzRoLTUzLjEzMkgzMTV2NTkuMjU0aC00Mi43ODYNCgkJCWwtMjAuMjY5LDQ0LjcxOWgtMTcuMTMzVjE3MC41NzFoLTc5LjIyMXYtMjAuMjY5aDQ4LjkwNlY3My4yNzloLTQ4LjkwNlY0Ny45NDJoLTMwLjQwNHYyNS4zMzdINzYuMjgydjc3LjAyM2g0OC45MDZ2MjAuMjY5DQoJCQlINDUuOTY2djEyOC45MjZIMGwzNy4yOTUsMTY0LjU2MWg0MDMuNTYyTDUxMiwyNTQuNzc4SDQ1Ni4yMjV6IE0xNTUuNTkxLDEwMy42ODNoMTguNTAydjE2LjIxNWgtMTguNTAyVjEwMy42ODN6DQoJCQkgTTM0NS40MDQsMjI1LjkyN2gzNy45M2MxOC45NSwwLDM1LjE0NCwxMi4wMjgsNDEuMzQ4LDI4Ljg1aC03OS4yNzhWMjI1LjkyN3ogTTEwNi42ODYsMTE5Ljg5OHYtMTYuMjE1aDE4LjUwMnYxNi4yMTVIMTA2LjY4NnoNCgkJCSBNNzYuMzY4LDIwMC45NzVoMTI4LjA0djM0LjA1OEg3Ni4zNjhWMjAwLjk3NXogTTc2LjM2OCwyNjUuNDM3aDEyOC4wNHYzNC4wNThINzYuMzY4VjI2NS40Mzd6IE00MTkuMDgsNDMzLjY1NEg2MS41NzkNCgkJCWwtOC4zMTEtMzYuNjc1aDM3OC4yOEw0MTkuMDgsNDMzLjY1NHogTTQ2LjM3NywzNjYuNTc2bC04LjMxMS0zNi42NzVoNy44OTloMTg4Ljg0OGgzNi43MzNsMjAuMjY5LTQ0LjcxOWgxNzcuNzM3bC0yNy42Nyw4MS4zOTQNCgkJCUg0Ni4zNzd6Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+";

/***/ }),

/***/ "./src/assets/submarine-svgrepo-com.svg":
/*!**********************************************!*\
  !*** ./src/assets/submarine-svgrepo-com.svg ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgZmlsbD0iI0ZGRkZGRiIgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00NjkuMzMzLDI1MS43MzNIMzk2LjhsLTIzLjA0LTMwLjcyYy0xLjYxMy0yLjE1LTQuMTQ3LTMuNDEzLTYuODI3LTMuNDEzSDM1OC40di01MS4yYzAtNC43MDIsMy44MjMtOC41MzMsOC41MzMtOC41MzMNCgkJCWM0LjcxOSwwLDguNTMzLTMuODIzLDguNTMzLTguNTMzcy0zLjgxNC04LjUzMy04LjUzMy04LjUzM2MtMTQuMTE0LDAtMjUuNiwxMS40ODYtMjUuNiwyNS42djUxLjJoLTE3LjA2N3YtMTcuMDY3DQoJCQljMC00LjcxLTMuODE0LTguNTMzLTguNTMzLTguNTMzcy04LjUzMywzLjgyMy04LjUzMyw4LjUzM1YyMTcuNmgtMzQuMTMzYy0yLjY4LDAtNS4yMTQsMS4yNjMtNi44MjcsMy40MTNsLTIzLjA0LDMwLjcyaC04MS4wNjcNCgkJCWMtMC43NzcsMC0xLjU0NSwwLjEwMi0yLjI4NywwLjMxNmwtNjUuOTgsMTguMzNWMjQzLjJjMC00LjcxLTMuODE0LTguNTMzLTguNTMzLTguNTMzSDUxLjJjLTQuMTczLDAtNy43MzEsMy4wMjEtOC40MTQsNy4xMjUNCgkJCWwtNy40NzUsNDQuODQzbC0xOC4yNDQsNS4wNzd2LTUuODQ1YzAtNC43MS0zLjgxNC04LjUzMy04LjUzMy04LjUzM1MwLDI4MS4xNTYsMCwyODUuODY3VjMyMGMwLDQuNzEsMy44MTQsOC41MzMsOC41MzMsOC41MzMNCgkJCXM4LjUzMy0zLjgyMyw4LjUzMy04LjUzM3YtNS44NDVsMTguMjQ0LDUuMDY5bDcuNDc1LDQ0Ljg0M2MwLjY4Myw0LjExMyw0LjI0MSw3LjEzNCw4LjQxNCw3LjEzNGgzNC4xMzMNCgkJCWM0LjcxOSwwLDguNTMzLTMuODIzLDguNTMzLTguNTMzdi0yNy4xNzlsNjUuOTgsMTguMzNjMC43NDIsMC4yMTMsMS41MSwwLjMxNiwyLjI4NywwLjMxNmgzMDcuMg0KCQkJYzIzLjUyNiwwLDQyLjY2Ny0yMi45NjMsNDIuNjY3LTUxLjJDNTEyLDI3NC42OTcsNDkyLjg2LDI1MS43MzMsNDY5LjMzMywyNTEuNzMzeiBNMjc3LjMzMywyMzQuNjY3aDg1LjMzM2wxMi44LDE3LjA2N0gyNjQuNTMzDQoJCQlMMjc3LjMzMywyMzQuNjY3eiBNNTguNDI4LDI1MS43MzNINzYuOHYyMy4zODFMNTMuNDUzLDI4MS42TDU4LjQyOCwyNTEuNzMzeiBNNzYuOCwzNTQuMTMzSDU4LjQyOGwtNC45NzUtMjkuODY3bDIzLjM0Nyw2LjQ4NQ0KCQkJVjM1NC4xMzN6IE00NjkuMzMzLDMzNy4wNjdIMTYzLjMwMmwtMTIyLjg4LTM0LjEzM2wxMjIuODgtMzQuMTMzaDMwNi4wMzFjMTQuMTE0LDAsMjUuNiwxNS4zMDksMjUuNiwzNC4xMzMNCgkJCVM0ODMuNDQ4LDMzNy4wNjcsNDY5LjMzMywzMzcuMDY3eiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg==";

/***/ }),

/***/ "./src/assets/x-symbol-svgrepo-com.svg":
/*!*********************************************!*\
  !*** ./src/assets/x-symbol-svgrepo-com.svg ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiNGRjAwMDAiIGhlaWdodD0iODAwcHgiIHdpZHRoPSI4MDBweCIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDQ2MC43NzUgNDYwLjc3NSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBkPSJNMjg1LjA4LDIzMC4zOTdMNDU2LjIxOCw1OS4yN2M2LjA3Ni02LjA3Nyw2LjA3Ni0xNS45MTEsMC0yMS45ODZMNDIzLjUxMSw0LjU2NWMtMi45MTMtMi45MTEtNi44NjYtNC41NS0xMC45OTItNC41NQ0KCWMtNC4xMjcsMC04LjA4LDEuNjM5LTEwLjk5Myw0LjU1bC0xNzEuMTM4LDE3MS4xNEw1OS4yNSw0LjU2NWMtMi45MTMtMi45MTEtNi44NjYtNC41NS0xMC45OTMtNC41NQ0KCWMtNC4xMjYsMC04LjA4LDEuNjM5LTEwLjk5Miw0LjU1TDQuNTU4LDM3LjI4NGMtNi4wNzcsNi4wNzUtNi4wNzcsMTUuOTA5LDAsMjEuOTg2bDE3MS4xMzgsMTcxLjEyOEw0LjU3NSw0MDEuNTA1DQoJYy02LjA3NCw2LjA3Ny02LjA3NCwxNS45MTEsMCwyMS45ODZsMzIuNzA5LDMyLjcxOWMyLjkxMSwyLjkxMSw2Ljg2NSw0LjU1LDEwLjk5Miw0LjU1YzQuMTI3LDAsOC4wOC0xLjYzOSwxMC45OTQtNC41NQ0KCWwxNzEuMTE3LTE3MS4xMmwxNzEuMTE4LDE3MS4xMmMyLjkxMywyLjkxMSw2Ljg2Niw0LjU1LDEwLjk5Myw0LjU1YzQuMTI4LDAsOC4wODEtMS42MzksMTAuOTkyLTQuNTVsMzIuNzA5LTMyLjcxOQ0KCWM2LjA3NC02LjA3NSw2LjA3NC0xNS45MDksMC0yMS45ODZMMjg1LjA4LDIzMC4zOTd6Ii8+DQo8L3N2Zz4=";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "" + "4a50e734f56925681729" + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "top_battleShip:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"bundle": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunktop_battleShip"] = self["webpackChunktop_battleShip"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.e(/*! import() */ "src_style_css").then(__webpack_require__.bind(__webpack_require__, /*! ./style.css */ "./src/style.css"));
const renderPlayerNamePage = __webpack_require__(/*! ./pages/playerNamePage */ "./src/pages/playerNamePage.js");
const Game = __webpack_require__(/*! ./classes/game */ "./src/classes/game.js");
const renderSetupPage = __webpack_require__(/*! ./pages/boardSetupPage */ "./src/pages/boardSetupPage.js");
const renderWinnerPage = __webpack_require__(/*! ./pages/winnerPage */ "./src/pages/winnerPage.js");

const root = document.getElementById("content");
root.classList.add("userNamePage");

async function startGame() {
  try {
    const playerName = await renderPlayerNamePage(root);
    const game = new Game(playerName, "Computer");
    root.innerHTML = "";
    root.classList.remove("userNamePage");


    document.addEventListener("winnerPlayer", () => {
      let winnerName = game.player.name;
      renderWinnerPage(winnerName, root);
    })

    document.addEventListener("winnerCpu", () => {
      let winnerName = game.cpu.name;
      renderWinnerPage(winnerName, root);
    })

    renderSetupPage(game, root);
  } catch (error) {
    console.error("Error: ", error);
  }
}

startGame();

})();

/******/ })()
;
//# sourceMappingURL=bundlefa19bb80b22b0ece1aca.js.map