function GameBoard() {
    let currentRound = 0;
    const gameBoard = [];
    for (let i = 0; i < 9; i++) {
        gameBoard.push("_");
    }
    const getGameBoard = () => {
        return gameBoard;
    };
    const placeOnBoard = (position) => {
        if (gameBoard[position] !== "_") {
            return false;
        }
        gameBoard[position] = (currentRound % 2 == 0 ? 'X' : 'O');
        currentRound++;
        return true;
    }

    const getCurrentRound = () => currentRound;

    const haveWinner = () => {
        if (gameBoard[4] !== "_") {
            return isALine(gameBoard, 4, 0, 8) || isALine(gameBoard, 4, 2, 6) || isALine(gameBoard, 4, 1, 7) || isALine(gameBoard, 4, 3, 5) ||
                   isALine(gameBoard, 0, 1, 2) || isALine(gameBoard, 0, 3, 6) || isALine(gameBoard, 2, 5, 8) || isALine(gameBoard, 6, 7, 8);
        } else {
            return isALine(gameBoard, 0, 1, 2) || isALine(gameBoard, 0, 3, 6) || isALine(gameBoard, 2, 5, 8) || isALine(gameBoard, 6, 7, 8);
        }
    }

    return { getGameBoard, placeOnBoard, getCurrentRound, haveWinner };
}

function isALine(gameBoard, i, j, k) {
    return gameBoard[i] === gameBoard[j] && gameBoard[j] === gameBoard[k] && gameBoard[i] !== "_";
}

function playGame() {
    const gameBoard = GameBoard();
    let activePlayer = players.player1;
    const playOneRound = (position) => {
        if (!gameBoard.placeOnBoard(position)) {
            console.log("invalid position!")
            return;
        }
        if (gameBoard.haveWinner()) {
            let winner = (gameBoard.getCurrentRound() % 2 === 1 ? players.player1 : players.player2);
            declareWinner(winner);
            disableInput();
            return;
        } else if (gameBoard.getCurrentRound() === 9) {
            declareWinner(null);
            return;
        }
        switchPlayer();
    }

    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = (activePlayer === players.player1 ? players.player2 : players.player1);
    }

    const getGameBoard = () => gameBoard;

    return { playOneRound, getActivePlayer, getGameBoard };
}

let startGame = document.querySelector(".startGame button");
startGame.addEventListener("click", () => {
    let dialog = document.createElement("dialog");
    dialog.className = "popup";
    document.body.appendChild(dialog);
    let label1 = document.createElement("label");
    let input1 = document.createElement("input");
    let label2 = document.createElement("label");
    let input2 = document.createElement("input");
    label1.textContent = "Enter Play 1's name: ";
    label2.textContent = "Enter Play 2's name: ";
    dialog.appendChild(label1); 
    dialog.appendChild(input1); 
    dialog.appendChild(label2); 
    dialog.appendChild(input2); 
    let closeButton = document.createElement("button");
    closeButton.textContent = "cancel";
    closeButton.addEventListener("click", () => {
        dialog.close();
    });
    let submitButton = document.createElement("button");
    submitButton.textContent = "submit";
    submitButton.addEventListener("click", () => {
        players.player1 = (input1.value.trim().length === 0 ? "player1" : input1.value);
        players.player2 = (input2.value.trim().length === 0 ? "player2" : input2.value);
        startNewGame();
        dialog.close();
    });
    dialog.appendChild(closeButton);
    dialog.appendChild(submitButton);
    dialog.showModal();
});

let game;

let tds = document.querySelectorAll("td");

disableInput();
for (let td of tds) {
    td.addEventListener("click", () => {
        let position = parseInt(td.id.slice(4));
        game.playOneRound(position);
        td.textContent = game.getGameBoard().getGameBoard()[position];
        showCurrentGameInfo();
    });
}

function disableInput() {
    for (let td of tds) {
        td.style.pointerEvents = "none";
    }
}

function enableInput() {
    for (let td of tds) {
        td.style.pointerEvents = "auto";
    }
}

function resetBoard() {
    for (let td of tds) {
        td.textContent = "";
    }
}

function declareWinner(winner) {
    let message = document.createElement("dialog");
    message.className = "message";
    let p = document.createElement("p");
    if (winner !== null) {
        p.textContent = `Game Over! The Winner is ${winner}!`;
    } else {
        p.textContent = "Game Over! Game is tied!"
    }
    p.style.margin = "5px";
    message.appendChild(p);
    document.body.appendChild(message);
    let cancelButton = document.createElement("button");
    cancelButton.textContent = ("cancel");
    cancelButton.addEventListener("click", () => {
        message.close();
    });
    let replay = document.createElement("button");
    replay.textContent = "Play again";
    replay.addEventListener("click", () => {
        exchangeStart();
        startNewGame();
        message.close();
    });
    message.appendChild(cancelButton);
    message.appendChild(replay);
    message.showModal();
}

let gameInfo1 = document.querySelector(".gameInfo1");
let gameInfo2 = document.querySelector(".gameInfo2");

let players = {
    player1: "player 1",
    player2: "player 2"
};

function showCurrentGameInfo() {
    gameInfo1.textContent = game.getActivePlayer() + "'s turn to play";
    gameInfo2.textContent = players.player1 + ": X" + " " + players.player2 + ": O"; 
}

function startNewGame() {
    game = playGame();
    resetBoard();
    enableInput();
    showCurrentGameInfo();
}

function exchangeStart() {
    let temp = players.player1;
    players.player1 = players.player2;
    players.player2 = temp;
}







