const GameBoard = (() => {
    let currentRound = 0;
    const gameBoard = new Array(9);

    for (let i = 0; i < 9; i++) {
        gameBoard[i] = "_";
    }

    const getGameBoard = () => {
        return gameBoard;
    };

    const reset = () => {
        currentRound = 0;
        for (let i = 0; i < 9; i++) {
            gameBoard[i] = "_";
        }
    };

    const placeOnBoard = (position) => {
        if (gameBoard[position] !== "_") {
            return false;
        }
        gameBoard[position] = currentRound % 2 == 0 ? "X" : "O";
        currentRound++;
        return true;
    };

    const getCurrentRound = () => currentRound;

    const haveWinner = () => {
        if (gameBoard[4] !== "_") {
            return (
                isALine(4, 0, 8) ||
                isALine(4, 2, 6) ||
                isALine(4, 1, 7) ||
                isALine(4, 3, 5) ||
                isALine(0, 1, 2) ||
                isALine(0, 3, 6) ||
                isALine(2, 5, 8) ||
                isALine(6, 7, 8)
            );
        } else {
            return (
                isALine(0, 1, 2) ||
                isALine(0, 3, 6) ||
                isALine(2, 5, 8) ||
                isALine(6, 7, 8)
            );
        }
    };

    function isALine(i, j, k) {
        return (
            gameBoard[i] === gameBoard[j] &&
            gameBoard[j] === gameBoard[k] &&
            gameBoard[i] !== "_"
        );
    }

    return {
        getGameBoard,
        placeOnBoard,
        getCurrentRound,
        haveWinner,
        reset,
    };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let players;
    let activePlayer;

    const init = (player1, player2) => {
        players = [Player(player1, "X"), Player(player2, "O")];
        activePlayer = players[0];
        GameBoard.reset();
        DisplayController.enableInput();
        DisplayController.showCurrentGameInfo();
        DisplayController.updateBoard(GameBoard.getGameBoard());
    };

    const handleCellClick = (position) => {
        if (GameBoard.placeOnBoard(position)) {
            if (GameBoard.haveWinner()) {
                DisplayController.showGameResult(
                    `Game Over! ${activePlayer.name} wins!`
                );
                DisplayController.disableInput();
            } else if (GameBoard.getCurrentRound() === 9) {
                DisplayController.showGameResult("Game Over! It's a tie!");
                DisplayController.disableInput();
            } else {
                switchPlayer();
            }
            DisplayController.updateBoard(GameBoard.getGameBoard());
            DisplayController.showCurrentGameInfo();
        }
    };

    const getActivePlayer = () => activePlayer;

    const getPlayers = () => players;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    return { init, handleCellClick, getPlayers, getActivePlayer };
})();

const DisplayController = (() => {
    const cells = document.querySelectorAll("td");

    const updateBoard = (board) => {
        cells.forEach((cell, index) => {
            cell.textContent = board[index] === "_" ? "" : board[index];
        });
    };

    const showGameResult = (messageText) => {
        let message = document.createElement("dialog");
        message.className = "message";
        const content = `
            <p>${messageText}</p>
            <div>
                <button class="cancel-button">Cancel</button>
                <button class="replay-button">Replay</button>
            </div>
        `;
        message.innerHTML = content;
        document.body.appendChild(message);
        const cancelButton = message.querySelector(".cancel-button");
        cancelButton.addEventListener("click", () => {
            message.close();
            message.remove();
        });
        const replayButton = message.querySelector(".replay-button");
        replayButton.addEventListener("click", () => {
            let player1 = GameController.getPlayers()[0].name;
            let player2 = GameController.getPlayers()[1].name;
            GameController.init(player2, player1);
            message.close();
            message.remove();
        });
        message.showModal();
    };

    const showPlayerNameForm = () => {
        let dialog = document.createElement("dialog");
        dialog.className = "popup";
        const form = `
            <label for="p1Name">Enter Play 1's name: </label>
            <input type="text" id="p1Name" />
            <label for="p2Name">Enter Play 2's name: </label>
            <input type="text" id="p2Name" />
            <button class="cancel-button">Cancel</button>
            <button class="submit-button">Submit</button>
        `;
        dialog.innerHTML = form;
        const cancelButton = dialog.querySelector(".cancel-button");
        cancelButton.addEventListener("click", () => {
            dialog.close();
            dialog.remove();
        });
        const submitButton = dialog.querySelector(".submit-button");
        const input1 = dialog.querySelector("#p1Name");
        const input2 = dialog.querySelector("#p2Name");
        submitButton.addEventListener("click", () => {
            const player1 =
                input1.value.trim().length === 0 ? "player1" : input1.value;
            const player2 =
                input2.value.trim().length === 0 ? "player2" : input2.value;
            GameController.init(player1, player2);
            dialog.close();
            dialog.remove();
        });
        document.body.appendChild(dialog);
        dialog.showModal();
    };

    function showCurrentGameInfo() {
        let gameInfo1 = document.querySelector(".gameInfo1");
        let gameInfo2 = document.querySelector(".gameInfo2");
        gameInfo1.textContent =
            GameController.getActivePlayer().name + "'s turn to play";
        gameInfo2.textContent =
            GameController.getPlayers()[0].name +
            ": X" +
            " vs. " +
            GameController.getPlayers()[1].name +
            ": O";
    }

    const bindCellListeners = () => {
        cells.forEach(function (cell, index) {
            cell.addEventListener("click", () => {
                GameController.handleCellClick(index);
            });
        });
    };

    const disableInput = () => {
        for (let cell of cells) {
            cell.style.pointerEvents = "none";
        }
    };

    const enableInput = () => {
        for (let cell of cells) {
            cell.style.pointerEvents = "auto";
        }
    };

    return {
        updateBoard,
        showGameResult,
        bindCellListeners,
        showPlayerNameForm,
        showCurrentGameInfo,
        disableInput,
        enableInput,
    };
})();

let startGame = document.querySelector(".startGame button");
startGame.addEventListener("click", () => {
    DisplayController.showPlayerNameForm();
});
DisplayController.bindCellListeners();
