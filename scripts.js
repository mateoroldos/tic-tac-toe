// BOARD MODULE
const board = (() => {
    
    //BOARD MANAGEMENT
    // Board array
    let gameBoardPlay = ["", "", "", "", "", "", "", "", ""];
    // Player variables
    let playerOne;
    let playerTwo;

    // Change board when player plays
    function playerPlay (playerKey, numberOfSpot) {
        gameBoardPlay[numberOfSpot] = playerKey;
    } 
    
    // Check board if the player who has played has won
    function checkForWinner (key) {
        if (
            gameBoardPlay[0] == key && gameBoardPlay[1] == key & gameBoardPlay[2] == key ||gameBoardPlay[3] == key && gameBoardPlay[4] == key & gameBoardPlay[5] == key ||gameBoardPlay[6] == key && gameBoardPlay[7] == key & gameBoardPlay[8] == key ||gameBoardPlay[0] == key && gameBoardPlay[3] == key & gameBoardPlay[6] == key ||gameBoardPlay[1] == key && gameBoardPlay[4] == key & gameBoardPlay[7] == key ||gameBoardPlay[2] == key && gameBoardPlay[5] == key & gameBoardPlay[8] == key ||
            gameBoardPlay[0] == key && gameBoardPlay[4] == key & gameBoardPlay[8] == key ||
            gameBoardPlay[2] == key && gameBoardPlay[4] == key & gameBoardPlay[6] == key
        ) {
            // declare winner
            displayController.anounceResult(gameFlow.returnGameResult());
            gameFlow.restartGame();         
        }
        else if (gameFlow.returnNumberOfTurn() === 8) {
            displayController.anounceResult("Tie");
            gameFlow.restartGame();
        }
    }

    // Restart board
    function restartBoard () {
        for (let index = 0; index < gameBoardPlay.length; index++) {
            gameBoardPlay[index] = "";
        }
    }

    // PLAYERS MANAGEMENT
    // Players Object Factory Function
    const playerCreator = (name, symbol) => {
        return { name, symbol };
    };

    // Function for creating player one
    function createPlayerOne (name,key) {
        playerOne = playerCreator(name, key);     
    }

    // Function for creating player two
    function createPlayerTwo (name,key) {
        playerTwo = playerCreator(name, key);
    }

    // Ceck the name of a player with a given number of player
    function getPlayerName (playerNumber) {
        switch (playerNumber) {
            case 1:
                return playerOne.name;

            case 2:
                return playerTwo.name;
        
            default:
                break;
        }
    }

    return {
        gameBoardPlay,
        playerPlay,
        restartBoard,
        checkForWinner,
        createPlayerOne,
        createPlayerTwo,
        getPlayerName,
    };

})();

// GAME FLOW MODULE
const gameFlow = (() => {

    // Number of turn
    let numberOfTurn = 0;
    // The result of the game
    let gameResult;

    //When a player select a spot => change board, check if he has won, change number of turn, change the game result
    function playTurn (spotSelected) {

        switch (numberOfTurn) {
            // Case the turn of player 1
            case 0:
            case 2:
            case 4:
            case 6:
            case 8:
                board.playerPlay ("o", spotSelected);
                board.checkForWinner("o");
                numberOfTurn = numberOfTurn + 1;
                gameResult = board.getPlayerName(2)
            return gameResult;

            // Case the turn of player 2
            case 1:
            case 3:
            case 5:
            case 7:
                board.playerPlay ("x", spotSelected);
                board.checkForWinner("x");
                numberOfTurn = numberOfTurn + 1;
                gameResult = board.getPlayerName(1)
            return gameResult;

            default:
            break;
        }
    }

    // Restart full game
    function restartGame () {
        numberOfTurn = 0
        board.restartBoard();
        displayController.restartDisplay();
        return numberOfTurn;
    }

    // Acess game result
    function returnGameResult() {
        return gameResult;
    }

    // Acess number of turn
    function returnNumberOfTurn() {
        return numberOfTurn;
    }

    return {
        playTurn,
        restartGame,
        returnGameResult,
        returnNumberOfTurn,
    };

})();

// DISPLAY CONTROLLER MODULE
const displayController = (() => {

    // Add global event listeners
    function globalEvents() {

        //Create Players
        const startGameForm = document.querySelector("#start-game-form")
        startGameForm.addEventListener("submit", (e) => {
            e.preventDefault();
            board.createPlayerOne(startGameForm.playerOneName.value, "x");
            board.createPlayerTwo(startGameForm.playerTwoName.value, "o");
            let modal = document.getElementById("welcomeFormModal"); 
            modal.style.display = "none";
        })

        // Play Again Button
        let playAgainBtn = document.getElementById("play-again-btn")
        playAgainBtn.addEventListener("click", () => {
            gameFlow.restartGame();
        });
    }
    
    // Display current board on display
    function displayBoard (array) {
        for (let index = 0; index < array.length; index++) {
            const spotDiv = document.createElement("div");
            spotDiv.classList.add("spot-div");
            spotDiv.setAttribute("id",index)
            
            const spotKey = document.createElement("div");
            spotKey.classList.add("spot-key")
            spotKey.setAttribute("id","spot-key-"+index)
            spotKey.innerHTML = array[index];

            spotDiv.appendChild(spotKey);

            const boardDiv = document.getElementById("board");
            boardDiv.appendChild(spotDiv);
        }

        // Fire events listeners
        playerSelectionEvents()
    }

    // When a spot is clicked, change it´s display
    function refreshSpotDisplay(selectedSpotId, array) {
        const spotKey = document.getElementById("spot-key-"+selectedSpotId);
        spotKey.innerHTML = array[selectedSpotId];
    }

    // Delete the full board display
    function eraseBoard() {
        const spotDiv = document.querySelectorAll(".spot-div");
        const boardDisplay = document.getElementById("board");
        for (let index = 0; index < spotDiv.length; index++) {
            boardDisplay.removeChild(spotDiv[index])
        }
    }

    // Restart the board display, displaying new board
    function restartDisplay () {
        eraseBoard();
        displayBoard(board.gameBoardPlay);
    }

    // When a spot is clicked, give a clicked data-set to avoid it from being clicked again
    function giveClickedStatus (clickedDivId) {
        const clickedDiv = document.getElementById(clickedDivId)
        clickedDiv.setAttribute("data-clicked","yes")
    }

    // Player selection spot event
    function playerSelectionEvents() {
        const spotDivs = document.querySelectorAll(".spot-div");
        for (let index = 0; index < spotDivs.length; index++) {
            spotDivs[index].addEventListener("click", (e) => {
                if (e.target.dataset.clicked !== "yes") {
                    gameFlow.playTurn(e.target.id);
                    refreshSpotDisplay(e.target.id, board.gameBoardPlay);
                    giveClickedStatus(e.target.id);
                }
            });
        }
    }

    // Anounce result in display
    function anounceResult(result) {
        
        let modalContentWindow = document.querySelector("#end-game-modal-content")
        let oldModalContentDiv = document.querySelector(".modal-content-div")

        modalContentWindow.removeChild(oldModalContentDiv);
        
        let newModalContentDiv = document.createElement("div");
        newModalContentDiv.classList.add("modal-content-div")

        let modalContent = document.createElement("div");

        // If the result was a tie, display tie, if not, display the winner
        modalContent.classList.add("modal-text");
        if (result === "Tie") {
            modalContent.innerHTML = "The game was a tie";
        }
        else {
            modalContent.innerHTML = result + " is the winner";
        }
        
        newModalContentDiv.appendChild(modalContent);

        modalContentWindow.appendChild(newModalContentDiv);

        let modal = document.getElementById("endGameModal");
        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        span = document.querySelector(".close");
        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // Display welcome form
    function welcomeForm() {
        let modal = document.getElementById("welcomeFormModal");
        modal.style.display = "block";
    }

    return {
        displayBoard,
        anounceResult,
        globalEvents,
        eraseBoard,
        restartDisplay,
        welcomeForm,
    }

})();

displayController.welcomeForm();
displayController.globalEvents();
displayController.displayBoard(board.gameBoardPlay);
