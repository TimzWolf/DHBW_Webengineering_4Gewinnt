document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("board");
    const status = document.getElementById("status");
    const resetButton = document.getElementById("reset");
    const cells = document.getElementsByClassName("cell");
    const playerCircles = document.getElementsByClassName("playerCircle");

    let currentPlayer = "yellow";
    let gameOver = false;

    // Set up click event listeners for each cell
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", function() {
            if (!gameOver && cells[i].classList.contains("empty")) {
                const columnIndex = Array.prototype.indexOf.call(cells[i].parentNode.children, cells[i]);
                const rowIndex = getLowestEmptyRow(columnIndex);
                if (rowIndex !== -1) {
                    dropToken(columnIndex, rowIndex);
                }
            }
        });
    }

    // Set up click event listener for reset button
    resetButton.addEventListener("click", resetGame);

    function getLowestEmptyRow(columnIndex) {
        for (let row = 5; row >= 0; row--) {
            if (cells[row * 7 + columnIndex].classList.contains("empty")) {
                return row;
            }
        }
        return -1;
    }

    function dropToken(columnIndex, rowIndex) {
        let cell = cells[rowIndex * 7 + columnIndex];
        cell.classList.remove("empty");
        cell.classList.add(currentPlayer);

        if (checkWin(columnIndex, rowIndex)) {
            gameOver = true;
            status.textContent =(currentPlayer === "yellow" ? "Gelb" : "Rot") + " gewinnt!";
            resetButton.style.display = "block";
        } else if (checkDraw()) {
            gameOver = true;
            status.textContent = "Unentschieden!";
            resetButton.style.display = "block";
        } else {
            currentPlayer = (currentPlayer === "yellow" ? "red" : "yellow");
            updatePlayerIndicator();
        }
    }

    function checkWin(columnIndex, rowIndex) {
        if (
            checkVerticalWin(columnIndex, rowIndex) ||
            checkHorizontalWin(columnIndex, rowIndex) ||
            checkDiagonalWin1(columnIndex, rowIndex) ||
            checkDiagonalWin2(columnIndex, rowIndex)
        ) {
            markWinningCells();
            return true;
        }
        return false;
    }

    function markWinningCells() {
        let winningCells
        if(currentPlayer === "yellow"){
            winningCells = "winYellow";
        }
        else{
            winningCells = "winRed";
        }
        // Vertikaler Gewinn
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row < 3; row++) {
                if (
                    cells[row * 7 + col].classList.contains(currentPlayer) &&
                    cells[(row + 1) * 7 + col].classList.contains(currentPlayer) &&
                    cells[(row + 2) * 7 + col].classList.contains(currentPlayer) &&
                    cells[(row + 3) * 7 + col].classList.contains(currentPlayer)
                ) {
                    cells[row * 7 + col].classList.add(winningCells);
                    cells[(row + 1) * 7 + col].classList.add(winningCells);
                    cells[(row + 2) * 7 + col].classList.add(winningCells);
                    cells[(row + 3) * 7 + col].classList.add(winningCells);
                    return;
                }
            }
        }

        // Horizontaler Gewinn
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 6; row++) {
                if (
                    cells[row * 7 + col].classList.contains(currentPlayer) &&
                    cells[row * 7 + col + 1].classList.contains(currentPlayer) &&
                    cells[row * 7 + col + 2].classList.contains(currentPlayer) &&
                    cells[row * 7 + col + 3].classList.contains(currentPlayer)
                ) {
                    cells[row * 7 + col].classList.add(winningCells);
                    cells[row * 7 + col + 1].classList.add(winningCells);
                    cells[row * 7 + col + 2].classList.add(winningCells);
                    cells[row * 7 + col + 3].classList.add(winningCells);
                    return;
                }
            }
        }

        // Diagonaler Gewinn (von links oben nach rechts unten)
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
                if (
                    cells[row * 7 + col].classList.contains(currentPlayer) &&
                    cells[(row + 1) * 7 + col + 1].classList.contains(currentPlayer) &&
                    cells[(row + 2) * 7 + col + 2].classList.contains(currentPlayer) &&
                    cells[(row + 3) * 7 + col + 3].classList.contains(currentPlayer)
                ) {
                    cells[row * 7 + col].classList.add(winningCells);
                    cells[(row + 1) * 7 + col + 1].classList.add(winningCells);
                    cells[(row + 2) * 7 + col + 2].classList.add(winningCells);
                    cells[(row + 3) * 7 + col + 3].classList.add(winningCells);
                    return;
                }
            }
        }

        // Diagonaler Gewinn (von rechts oben nach links unten)
        for (let col = 3; col < 7; col++) {
            for (let row = 0; row < 3; row++) {
                if (
                    cells[row * 7 + col].classList.contains(currentPlayer) &&
                    cells[(row + 1) * 7 + col - 1].classList.contains(currentPlayer) &&
                    cells[(row + 2) * 7 + col - 2].classList.contains(currentPlayer) &&
                    cells[(row + 3) * 7 + col - 3].classList.contains(currentPlayer)
                ) {
                    cells[row * 7 + col].classList.add(winningCells);
                    cells[(row + 1) * 7 + col - 1].classList.add(winningCells);
                    cells[(row + 2) * 7 + col - 2].classList.add(winningCells);
                    cells[(row + 3) * 7 + col - 3].classList.add(winningCells);
                    return;
                }
            }
        }
    }

    function checkVerticalWin(columnIndex, rowIndex) {
        let count = 1;
        let y = rowIndex - 1;

        // Check below
        while (y >= 0 && cells[y * 7 + columnIndex].classList.contains(currentPlayer)) {
            count++;
            y--;
        }

        y = rowIndex + 1;

        // Check above
        while (y < 6 && cells[y * 7 + columnIndex].classList.contains(currentPlayer)) {
            count++;
            y++;
        }

        if (count >= 4) {
            return true;
        }
        return false;
    }

    function checkHorizontalWin(columnIndex, rowIndex) {
        let count = 1;
        let x = columnIndex - 1;

        // Check to the left
        while (x >= 0 && cells[rowIndex * 7 + x].classList.contains(currentPlayer)) {
            count++;
            x--;
        }

        x = columnIndex + 1;

        // Check to the right
        while (x < 7 && cells[rowIndex * 7 + x].classList.contains(currentPlayer)) {
            count++;
            x++;
        }

        if (count >= 4) {
            return true;
        }
        return false;
    }

    function checkDiagonalWin1(columnIndex, rowIndex) {
        let count = 1;
        let x = columnIndex - 1;
        let y = rowIndex - 1;

        // Check upwards left diagonal
        while (x >= 0 && y >= 0 && cells[y * 7 + x].classList.contains(currentPlayer)) {
            count++;
            x--;
            y--;
        }

        x = columnIndex + 1;
        y = rowIndex + 1;

        // Check downwards right diagonal
        while (x < 7 && y < 6 && cells[y * 7 + x].classList.contains(currentPlayer)) {
            count++;
            x++;
            y++;
        }

        if (count >= 4) {
            return true;
        }
        return false;
    }

    function checkDiagonalWin2(columnIndex, rowIndex) {
        let count = 1;
        let x = columnIndex - 1;
        let y = rowIndex + 1;

        // Check downwards left diagonal
        while (x >= 0 && y < 6 && cells[y * 7 + x].classList.contains(currentPlayer)) {
            count++;
            x--;
            y++;
        }

        x = columnIndex + 1;
        y = rowIndex - 1;

        // Check upwards right diagonal
        while (x < 7 && y >= 0 && cells[y * 7 + x].classList.contains(currentPlayer)) {
            count++;
            x++;
            y--;
        }

        if (count >= 4) {
            return true;
        }
        return false;
    }

    function checkDraw() {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains("empty")) {
                return false;
            }
        }
        return true;
    }

    function resetGame() {
        location.reload();
        /* ALTERNATIVE:
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove("winYellow");
            cells[i].classList.remove("winRed");
        }
        currentPlayer = "yellow";
        gameOver = false;
        status.textContent = "";
        resetButton.style.display = "none";
        updatePlayerIndicator();

        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove("yellow");
            cells[i].classList.remove("red");
            cells[i].classList.add("empty");
        }
        */
    }

    function updatePlayerIndicator() {
        for (let i = 0; i < playerCircles.length; i++) {
            playerCircles[i].style.display = "none";
        }

        if (currentPlayer === "yellow") {
            playerCircles[0].style.display = "block";
        } else {
            playerCircles[1].style.display = "block";
        }
    }
    updatePlayerIndicator();
});