document.addEventListener("DOMContentLoaded", function (event) {
    init();
});
const WIDTH = 10;
const userPieces = [];
const computerPieces = [];
let displayGrid, userGrid, computerGrid, startButton, rotateButton, infoContainer, turnDisplay;
let selectedShipNameWithIndex;
let draggedShip;
let draggedShipLength;
let allShipsPlaced = false;
let isHorizontal = true;
let isGameOver = false;
const USER = "user";
const CPU = "cpu";
const BOOM = "boom";
const MISS = "miss";
const TAKEN = "taken";
let currentPlayer = USER;
function init() {
    displayGrid = document.querySelector(".grid-display");
    userGrid = document.querySelector(".grid-user");
    computerGrid = document.querySelector(".grid-computer");
    startButton = document.querySelector("#start");
    rotateButton = document.querySelector("#rotate");
    infoContainer = document.querySelector(".info-container");
    turnDisplay = document.querySelector(".turn-display");
    createBoard(userGrid, userPieces);
    createBoard(computerGrid, computerPieces);
    generateCpuShips();
    fillDisplayGrid();
    userPieces.forEach((piece) => piece.addEventListener("dragstart", dragStart));
    userPieces.forEach((piece) => piece.addEventListener("dragover", dragOver));
    userPieces.forEach((piece) => piece.addEventListener("dragenter", dragEnter));
    userPieces.forEach((piece) => piece.addEventListener("dragleave", dragLeave));
    userPieces.forEach((piece) => piece.addEventListener("drop", dragDrop));
    userPieces.forEach((piece) => piece.addEventListener("dragend", dragEnd));
}
function clickPieceEventHandler(piece) {
    return () => userRevealPiece(piece);
}
function startGame() {
    if (displayGrid.childNodes.length > 0) {
        infoContainer.innerHTML = "Ships missing to place";
        return;
    }
    infoContainer.innerHTML = "";
    computerPieces.forEach((piece) => piece.addEventListener("click", clickPieceEventHandler(piece)));
    playTurn(currentPlayer);
}
function playTurn(player) {
    if (isGameOver)
        return;
    if (currentPlayer === USER) {
        turnDisplay.innerHTML = "Your Go";
        // Wait for event listener to trigger userRevealPiece
    }
    if (currentPlayer === CPU) {
        turnDisplay.innerHTML = "Computers Go";
        cpuGo();
        currentPlayer = USER;
        checkForWins();
        playTurn(currentPlayer);
    }
}
function userRevealPiece(piece) {
    if (isGameOver)
        return;
    revealPiece(piece);
    currentPlayer = CPU;
    checkForWins();
    playTurn(currentPlayer);
}
let playerHits = {
    cpu: 0,
    user: 0,
};
function revealPiece(piece) {
    // The user already hit this pieces
    if (piece.classList.contains(BOOM))
        return;
    if (piece.classList.contains(MISS))
        return;
    // the square is free
    if (!piece.classList.contains(TAKEN)) {
        piece.classList.add(MISS);
        return;
    }
    // The square was not hit and is not free.
    piece.classList.add(BOOM);
    piece.classList.remove("hidden");
    playerHits[currentPlayer]++;
}
function cpuGo() {
    let pieceIndex = nextCpuMove(userPieces);
    revealPiece(userPieces[pieceIndex]);
}
/**
 * Calculate next CPU move using the enemy grid
 * @param enemyGrid
 * @return number
 */
function nextCpuMove(enemyGrid) {
    let index = Math.floor(Math.random() * enemyGrid.length);
    // Select a new index if the piece was already hit
    if (enemyGrid[index].classList.contains(BOOM) ||
        enemyGrid[index].classList.contains(MISS))
        return nextCpuMove(enemyGrid);
    return index;
}
function checkForWins() {
    if (playerHits[currentPlayer] === 17) {
        isGameOver = true;
        infoContainer.innerHTML = `${currentPlayer} WINS !`;
        computerPieces.forEach((piece) => piece.removeEventListener("click", clickPieceEventHandler));
    }
}
/**
 * Created board game made by HTMLDivElement with a data-id attribute
 * @param gridContainer HTMLDivElement
 * @param pieces HTMLDivElement[]
 */
function createBoard(gridContainer, pieces) {
    for (let i = 0; i < WIDTH * WIDTH; i++) {
        const piece = document.createElement("div");
        piece.dataset.id = i.toString();
        gridContainer.appendChild(piece);
        pieces.push(piece);
    }
}
/**
 * Initializes Display Grid for the user to deploy his ships
 */
function fillDisplayGrid() {
    const destroyer = new Destroyer();
    const cruiser = new Cruiser();
    const submarine = new Submarine();
    const battleship = new Battleship();
    const carrier = new Carrier();
    const destroyerElement = destroyer.createElement();
    displayGrid.appendChild(destroyerElement);
    const cruiserElement = cruiser.createElement();
    displayGrid.appendChild(cruiserElement);
    const submarineElement = submarine.createElement();
    displayGrid.appendChild(submarineElement);
    const battleshipElement = battleship.createElement();
    displayGrid.appendChild(battleshipElement);
    const carrierElement = carrier.createElement();
    displayGrid.appendChild(carrierElement);
    function rotate() {
        destroyerElement.classList.toggle("destroyer-container-vertical");
        submarineElement.classList.toggle("submarine-container-vertical");
        cruiserElement.classList.toggle("cruiser-container-vertical");
        battleshipElement.classList.toggle("battleship-container-vertical");
        carrierElement.classList.toggle("carrier-container-vertical");
        isHorizontal = !isHorizontal;
        return;
    }
    rotateButton.addEventListener("click", rotate);
    startButton.addEventListener("click", startGame);
    destroyerElement.addEventListener("mousedown", (e) => {
        selectedShipNameWithIndex = e.target.id;
    });
    destroyerElement.addEventListener("dragstart", dragStart);
    cruiserElement.addEventListener("mousedown", (e) => {
        selectedShipNameWithIndex = e.target.id;
    });
    cruiserElement.addEventListener("dragstart", dragStart);
    submarineElement.addEventListener("mousedown", (e) => {
        selectedShipNameWithIndex = e.target.id;
    });
    submarineElement.addEventListener("dragstart", dragStart);
    battleshipElement.addEventListener("mousedown", (e) => {
        selectedShipNameWithIndex = e.target.id;
    });
    battleshipElement.addEventListener("dragstart", dragStart);
    carrierElement.addEventListener("mousedown", (e) => {
        selectedShipNameWithIndex = e.target.id;
    });
    carrierElement.addEventListener("dragstart", dragStart);
}
/**
 * Generates and displays CPU ships in random positions and orientations
 */
function generateCpuShips() {
    const destroyer = new Destroyer();
    const cruiser = new Cruiser();
    const submarine = new Submarine();
    const battleship = new Battleship();
    const carrier = new Carrier();
    const destroyerPosition = destroyer.generateRandom(computerPieces);
    for (let i = 0; i < destroyerPosition.length; i++) {
        computerPieces[destroyerPosition[i]].classList.add(TAKEN, destroyer.name, "hidden");
    }
    const cruiserPosition = cruiser.generateRandom(computerPieces);
    for (let i = 0; i < cruiserPosition.length; i++) {
        computerPieces[cruiserPosition[i]].classList.add(TAKEN, cruiser.name, "hidden");
    }
    const submarinePosition = submarine.generateRandom(computerPieces);
    for (let i = 0; i < submarinePosition.length; i++) {
        computerPieces[submarinePosition[i]].classList.add(TAKEN, submarine.name, "hidden");
    }
    const battleshipPosition = battleship.generateRandom(computerPieces);
    for (let i = 0; i < battleshipPosition.length; i++) {
        computerPieces[battleshipPosition[i]].classList.add(TAKEN, battleship.name, "hidden");
    }
    const carrierPosition = carrier.generateRandom(computerPieces);
    for (let i = 0; i < carrierPosition.length; i++) {
        computerPieces[carrierPosition[i]].classList.add(TAKEN, carrier.name, "hidden");
    }
}
/**
 * Returns false if the positions overflows the board on the right
 * @param positions number[]
 * @returns boolean
 */
function isAtRightEdge(positions, width) {
    return positions[positions.length] % width > positions.length;
}
/**
 * Returns false if the positions overflows the board on the left
 * @param positions number[]
 * @returns boolean
 */
function isAtLeftEdge(positions, width) {
    return positions[positions.length - 1] % width < positions[0] % width;
}
/**
 * Returns false if the positions overflows the grid at the botton
 * @param positions
 * @returns boolean
 */
function isAtBottomEdge(positions, width) {
    return positions[positions.length - 1] >= width * width;
}
/**
 * Returns false if the positions overflows the grid at the top
 * @param positions number[]
 * @return boolean
 */
function isAtTopEdge(positions) {
    return positions[0] < 0;
}
/**
 * Validates the positions do not overflow the grid
 * @param position
 * @return boolean
 */
function isInsideGrid(position, width) {
    return (!isAtLeftEdge(position, width) &&
        !isAtRightEdge(position, width) &&
        !isAtBottomEdge(position, width) &&
        !isAtTopEdge(position));
}
/**
 * Validates the positions are free in the grid
 * @param positions number[]
 * @param grid HTMLDivElement[]
 * @return boolean is the position taken or free
 */
function isTaken(positions, grid) {
    return positions.some((position) => grid[position].classList.contains(TAKEN));
}
/**
 * Validates the position inside the grid.
 * Checks if the position is taken by another ship and if it's inside the grid.
 * @param position
 * @param grid
 * @return boolean
 */
function validatePosition(position, grid) {
    return isInsideGrid(position, WIDTH) && !isTaken(position, grid);
}
class Ship {
    generateHorizontalDirections() {
        let direction = [];
        for (let i = 0; i < this.size; i++) {
            direction.push(i);
        }
        return direction;
    }
    generateVerticalDirections() {
        let direction = [];
        for (let i = 0; i < this.size; i++) {
            direction.push(i * WIDTH);
        }
        return direction;
    }
    createElement() {
        let element = document.createElement("div");
        element.classList.add("ship", `${this.name}-container`);
        element.setAttribute("draggable", "true");
        for (let i = 0; i < this.size; i++) {
            let pieceElement = document.createElement("div");
            pieceElement.setAttribute("id", `${this.name}-${i}`);
            element.appendChild(pieceElement);
        }
        return element;
    }
    generateRandom(grid) {
        let randomDirection = Math.floor(Math.random() * this.directions.length);
        let position = this.directions[randomDirection];
        let direction = randomDirection === 0 ? 1 : WIDTH;
        let randomStart = Math.abs(Math.floor(Math.random() * WIDTH * WIDTH - this.size * direction));
        position = position.map((index) => index + randomStart);
        if (validatePosition(position, grid))
            return position;
        return this.generateRandom(grid);
    }
}
class Destroyer extends Ship {
    constructor() {
        super();
        this.name = "destroyer";
        this.size = 2;
        this.directions = [
            this.generateHorizontalDirections(),
            this.generateVerticalDirections(),
        ];
    }
}
class Cruiser extends Ship {
    constructor() {
        super();
        this.name = "cruiser";
        this.size = 3;
        this.directions = [
            this.generateHorizontalDirections(),
            this.generateVerticalDirections(),
        ];
    }
}
class Submarine extends Ship {
    constructor() {
        super();
        this.name = "submarine";
        this.size = 3;
        this.directions = [
            this.generateHorizontalDirections(),
            this.generateVerticalDirections(),
        ];
    }
}
class Battleship extends Ship {
    constructor() {
        super();
        this.name = "battleship";
        this.size = 4;
        this.directions = [
            this.generateHorizontalDirections(),
            this.generateVerticalDirections(),
        ];
    }
}
class Carrier extends Ship {
    constructor() {
        super();
        this.name = "carrier";
        this.size = 5;
        this.directions = [
            this.generateHorizontalDirections(),
            this.generateVerticalDirections(),
        ];
    }
}
// interface IDraggable {
//   dragStart(): void;
//   dragOver(e: Event): void;
//   dragEnter(e: Event): void;
//   dragLeave(): void;
//   dragDrop(): void;
//   dragEnd(): void;
// }
// class Draggable implements IDraggable {
//   dragStart(): void {}
//   dragOver(e: Event): void {}
//   dragEnter(e: Event): void {}
//   dragLeave(): void {}
//   dragDrop(): void {}
//   dragEnd(): void {}
// }
// class Piece {
//   constructor() {
//     super();
//   }
// }
//class DraggablePiece extends Piece implements IDraggable {}
// Drag and Drop events
function dragStart() {
    draggedShip = this;
    draggedShipLength = this.childNodes.length;
    console.log(draggedShip);
}
function dragOver(e) {
    e.preventDefault();
}
function dragEnter(e) {
    e.preventDefault();
}
function dragLeave() {
    // console.log('drag leave')
}
function dragDrop() {
    const shipClass = draggedShip.lastChild.id.slice(0, -2);
    const selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
    const selectedGridIndex = parseInt(this.dataset.id);
    let positions = [];
    for (let i = 0; i < draggedShipLength; i++) {
        if (isHorizontal) {
            positions.push(i - selectedShipIndex);
        }
        else {
            positions.push((i - selectedShipIndex) * WIDTH);
        }
    }
    positions = positions.map((position) => position + selectedGridIndex);
    if (validatePosition(positions, userPieces)) {
        for (let i = 0; i < positions.length; i++) {
            userPieces[positions[i]].classList.add(TAKEN, shipClass);
        }
        displayGrid.removeChild(draggedShip);
        if (!displayGrid.querySelector(".ship"))
            allShipsPlaced = true;
    }
}
function dragEnd() {
    // console.log('dragend')
}
