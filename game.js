import { state, ui, DIE_URLS } from "./state.js";
import { calculateScoring, isFarkle } from "./scoring.js";
import { showMessage } from "./uiHelpers.js";

export function initializeGame() {
    const submit = submitPlayerName();
    ui.nextBtn.addEventListener("click", () => {
        submit();
    });

    ui.playerNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") ui.nextBtn.click();
    });

    // Add event listeners for click on each dice btn
    ui.diceBtns.forEach((button, i) => {
        button.addEventListener("click", () => { clickDie(button, i); });
    });
    ui.rollBtn.addEventListener("click", rollDice);
    ui.claimBtn.addEventListener("click", claimPoints);
    ui.endBtn.addEventListener("click", endTurn);
    //ui.resetBtn.addEventListener("click", () => {resetBoard("Full"); showMessage("Full game reset.");});

    ui.twoPlayers.addEventListener("click", () => {initializePlayers(2)});
    ui.threePlayers.addEventListener("click", () => {initializePlayers(3)});
    ui.fourPlayers.addEventListener("click", () => {initializePlayers(4)});

    ui.playerSelect.hidden = false;
    ui.playerNameForm.hidden = true;

    resetBoard("Full"); // Reset values
}

function initializePlayers(numPlayers) {
    if (numPlayers === 2) {
        // Remove players 3 and 4
        state.players.pop();
        state.players.pop();
    }
    else if (numPlayers === 3) {
        // Remove player 4
        state.players.pop();
        ui.p3score.hidden = false;
    }
    else {
        ui.p3score.hidden = false;
        ui.p4score.hidden = false;
    }

    ui.playerSelect.hidden = true;
    ui.playerNameForm.hidden = false;
}

function submitPlayerName() {
    let playerIndex = 0; // static
    return function() {
        const name = ui.playerNameInput.value.trim();
        if (name.length === 0) return;
        state.players[playerIndex].name = name;
        playerIndex++;

        if (state.players.length === playerIndex) {
            ui.initialScreen.hidden = true;
            ui.gameScreen.hidden = false;
            resetBoard("Full");
            return;
        }

        updateScoreboard();

        ui.playerNameLabel.textContent = `Enter Player ${playerIndex + 1} Name:`;
        ui.playerNameInput.value = "";
    }
}


function clickDie(button, i) {
    // If buttons selectable and not already kept, select them
    if (!state.locked && !button.classList.contains("kept")) {
        toggleDie(button, i);
    }
}

function toggleDie(button, i) {
    button.classList.toggle("selected");
    state.selected[i] = !state.selected[i]; // toggle
}

function keepDice() {
    ui.diceBtns.forEach((button, i) => {
        if (button.classList.contains("selected")) {
            state.selected[i] = false;
            button.classList.remove("selected");

            state.kept[i] = true;
            button.classList.add("kept");
        }
    });
}

function updateScoreboard() {
    ui.p1score.innerHTML = `${state.players[0].name}:<br>${state.players[0].totalScore}`;
    ui.p2score.innerHTML = `${state.players[1].name}:<br>${state.players[1].totalScore}`;
    if (state.players.length === 3) {
        ui.p3score.innerHTML = `${state.players[2].name}:<br>${state.players[2].totalScore}`;
    }
    else if (state.players.length === 4) {
        ui.p3score.innerHTML = `${state.players[2].name}:<br>${state.players[2].totalScore}`;
        ui.p4score.innerHTML = `${state.players[3].name}:<br>${state.players[3].totalScore}`;
    }
}

function resetBoard(resetType) {
    if (resetType === "Full") {
        state.players.forEach(p => { 
            p.totalScore = 0;
            p.consecutiveFarkles = 0;
        });
    }

    updateScoreboard();

    const current = state.players[state.currentPlayerIndex];
    ui.currentPlayer.textContent = `Turn: ${current.name}`;

    if (resetType != "AllDiceKept") {
        ui.currentRoundScore.textContent = `Current Round Score: 0`;
        state.dice = [1,2,3,4,5,6];
        state.currentRoundScores = [];
        state.currentRoundTotalScore = 0;
    }

    ui.rollBtn.disabled = false;
    ui.claimBtn.disabled = true;
    ui.endBtn.disabled = true;
    ui.diceBtns.forEach((button, i) => {
        button.classList.remove("selected");
        button.classList.remove("kept");
        if (resetType != "AllDiceKept") button.style.backgroundImage = `url("${DIE_URLS[i]}")`;
    });

    state.selected = [false, false, false, false, false, false];
    state.kept = [false, false, false, false, false, false];
    state.rolled = false;
    state.locked = true;
}

// Switch to the next player
function nextPlayer(currentPlayer, isFarkle) {
    state.currentPlayerIndex++;
    if (state.currentPlayerIndex >= state.players.length) {
        state.currentPlayerIndex = 0;
    }
    const nextPlayerUp = state.players[state.currentPlayerIndex];

    if (isFarkle) showMessage(`Farkle! ${currentPlayer.name} ends turn. Next: ${nextPlayerUp.name}`);
    else showMessage(`${currentPlayer.name} ends turn. Next: ${nextPlayerUp.name}`);

    resetBoard("NextTurn");
}

function endTurn() {
    // If at least one score has been claimed this round and roll not currently ongoing
    if (state.currentRoundScores.length > 0 && state.locked) {
        const current = state.players[state.currentPlayerIndex];
        current.totalScore += state.currentRoundTotalScore;

        nextPlayer(current, false);
    }
}

// Randomly rolls dice, sets dice imgs
function rollDice() {
    if (state.rolled) return;
    if (state.kept.every(c => c === true)) {
        resetBoard("AllDiceKept");
    }

    let newRolls = [];
    // For each dice button
    ui.diceBtns.forEach((button, i) => {
        if (!button.classList.contains("selected") && !button.classList.contains("kept")) {
            const value = Math.floor(Math.random() * 6) + 1; // Rand value
            state.dice[i] = value; // Set each die value
            newRolls.push(value); // Add value to newRolls array
            button.style.backgroundImage = `url(${DIE_URLS[value - 1]})`;
        }
    });
    
    state.locked = false;
    state.rolled = true;
    ui.rollBtn.disabled = true;
    ui.claimBtn.disabled = false;
    ui.endBtn.disabled = true;

    if (isFarkle(newRolls)) {
        farkleSequence();
    } else {
        const currentPlayer = state.players[state.currentPlayerIndex];
        currentPlayer.consecutiveFarkles = 0;
    }
}

function farkleSequence() {
    const currentPlayer = state.players[state.currentPlayerIndex];

    showMessage("Farkle!");

    state.currentRoundTotalScore = 0;
    
    currentPlayer.consecutiveFarkles++;
    if (currentPlayer.consecutiveFarkles === 3) {
        showMessage(`${currentPlayer.name}: 3 Farkles in a row. -1000 points.`);
        currentPlayer.totalScore -= 1000;
        currentPlayer.consecutiveFarkles = 0;
    }

    nextPlayer(currentPlayer, true);
}

// Claim points button clicked
function claimPoints() {
    if (!newDieSelected()) return;

    const counts = [0,0,0,0,0,0];
    
    state.selected.forEach((element, i) => {
        if (element) {
            counts[state.dice[i] - 1]++;
        }
    });

    const points = calculateScoring(counts);
    if (points === 0) {
        showMessage("Invalid dice selection.");
        return;
    }
    state.currentRoundScores.push(points);
    //state.totalScore += points; // moved to endTurn()
    state.currentRoundTotalScore += points;
    ui.currentRoundScore.textContent = `Current Round Score: ${state.currentRoundTotalScore}`;

    keepDice();
    if (state.kept.every(c => c === true)) {
        showMessage("You used all your dice! Roll again, or play it safe and end your turn.");
    }

    ui.rollBtn.disabled = false;
    ui.claimBtn.disabled = true;
    ui.endBtn.disabled = false;
    state.locked = true; // Force next dice roll
    state.rolled = false; // end current roll
}

function newDieSelected() {
    // If any selected die exists
    for (const button of ui.diceBtns) {
        if (button.classList.contains("selected")) {
            return true;
        }
    }
    return false;
}
