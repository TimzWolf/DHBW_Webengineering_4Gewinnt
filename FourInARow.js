$(document).ready(function() {
    const status = $("#status");
    const resetButton = $("#reset");
    const cells = $(".cell");
    const playerCircles = $(".playerCircle");

    let currentPlayer = "yellow";
    let gameOver = false;
    updatePlayerScores();
    reloadSizes();
    reloadTheme();
    
    // Set up click event Listener for theme switch
    document.getElementById("themeSwitch").addEventListener("click", function() {
        let theme = loadTheme();
        if (theme === "FourInARowDark.css") {
            theme = "FourInARowWhite.css";
        } else {
            theme = "FourInARowDark.css";
        }
        saveTheme(theme);
        reloadTheme();
    });

    //set up click event Listener for increase Button
    document.getElementById("increaseSize").addEventListener("click", function() {
        let sizes = loadSizes();
        console.log("Width: " , sizes.cellWidth , " Height: " ,  sizes.cellHeight);
        //increase cells
        sizes.cellWidth += 10;
        sizes.cellHeight += 10;

        //increase PlayerCircle
        sizes.playerCircleWidth += 10;
        sizes.playerCircleHeight += 10;

        saveSizes(sizes);
        reloadSizes()
    });

    //set up click event Listener for decrease Button
    document.getElementById("decreaseSize").addEventListener("click", function() {
        let sizes = loadSizes();
        //decrease cells
        sizes.cellWidth -= 10;
        sizes.cellHeight -= 10;

        //decrease PlayerCircle
        sizes.playerCircleWidth -= 10;
        sizes.playerCircleHeight -= 10;

        saveSizes(sizes);
        reloadSizes()
    });

    //Set up click event Listener for resetSize Button
    document.getElementById("resetSize").addEventListener("click", function() {
        let sizes = loadSizes();
        //decrease cells
        sizes.cellWidth = 50;
        sizes.cellHeight = 50;

        //decrease PlayerCircle
        sizes.playerCircleWidth = 20;
        sizes.playerCircleHeight = 20;

        saveSizes(sizes);
        reloadSizes()
    });

    //change sizes in GUI
    function reloadSizes(){
        let sizes = loadSizes();
        cells.css({
            "width": sizes.cellWidth,
            "height": sizes.cellHeight
        });
        playerCircles.css({
            "width": sizes.playerCircleWidth,
            "height": sizes.playerCircleHeight
        });
    }

    //change theme in GUI
    function reloadTheme(){
        let linkElement = document.getElementById("themeCSS");
        linkElement.setAttribute("href", loadTheme());
    }

    // Set up click event listeners for each cell
    cells.on("click", function() {
        if (!gameOver && $(this).hasClass("empty")) {
            const columnIndex = $(this).index();
            const rowIndex = getLowestEmptyRow(columnIndex);
            if (rowIndex !== -1) {
                dropToken(columnIndex, rowIndex);
            }
        }
    });

    // Set up click event listener for reset button
    resetButton.on("click", resetGame);

    // Function to find the lowest empty row in a given column
    function getLowestEmptyRow(columnIndex) {
        for (let row = 5; row >= 0; row--) {
            if (cells.eq(row * 7 + columnIndex).hasClass("empty")) {
                return row;
            }
        }
        return -1;
    }

    // Function to drop a token into a specific column and row
    function dropToken(columnIndex, rowIndex) {
        let cell = cells.eq(rowIndex * 7 + columnIndex);
        cell.removeClass("empty");
        cell.addClass(currentPlayer);

        if (checkWin(columnIndex, rowIndex)) {
            gameOver = true;
            status.text((currentPlayer === "yellow" ? "Gelb" : "Rot") + " gewinnt!");
            resetButton.css("visibility", "visible");
        } else if (checkDraw()) {
            gameOver = true;
            status.text("Unentschieden!");
            resetButton.css("visibility", "visible");
        } else {
            currentPlayer = (currentPlayer === "yellow" ? "red" : "yellow");
            updatePlayerIndicator();
        }
    }

    // Function to check for a win condition
    function checkWin(columnIndex, rowIndex) {
        if (
            checkVerticalWin(columnIndex, rowIndex) ||
            checkHorizontalWin(columnIndex, rowIndex) ||
            checkDiagonalWin1(columnIndex, rowIndex) ||
            checkDiagonalWin2(columnIndex, rowIndex)
        ) {

            // Add 1 to winner score
            let scores = loadScores();
            (currentPlayer === "yellow" ? scores.yellow++ : scores.red++);
            saveScores(scores);

            // Update Scores
            updatePlayerScores();

            markWinningCells();
            return true;
        }
        return false;
    }

    // Function to check for a vertical win
    function checkVerticalWin(columnIndex, rowIndex) {
        let count = 1;
        let y = rowIndex - 1;

        // Check below
        while (y >= 0 && cells.eq(y * 7 + columnIndex).hasClass(currentPlayer)) {
            count++;
            y--;
        }

        y = rowIndex + 1;

        // Check above
        while (y < 6 && cells.eq(y * 7 + columnIndex).hasClass(currentPlayer)) {
            count++;
            y++;
        }
        return count >= 4;
    }

    // Function to check for a horizontal win
    function checkHorizontalWin(columnIndex, rowIndex) {
        let count = 1;
        let x = columnIndex - 1;

        // Check to the left
        while (x >= 0 && cells.eq(rowIndex * 7 + x).hasClass(currentPlayer)) {
            count++;
            x--;
        }

        x = columnIndex + 1;

        // Check to the right
        while (x < 7 && cells.eq(rowIndex * 7 + x).hasClass(currentPlayer)) {
            count++;
            x++;
        }
        return count >= 4;
    }

    // Function to check for a diagonal win (top left to bottom right)
    function checkDiagonalWin1(columnIndex, rowIndex) {
        let count = 1;
        let x = columnIndex - 1;
        let y = rowIndex - 1;

        // Check upwards left diagonal
        while (x >= 0 && y >= 0 && cells.eq(y * 7 + x).hasClass(currentPlayer)) {
            count++;
            x--;
            y--;
        }

        x = columnIndex + 1;
        y = rowIndex + 1;

        // Check downwards right diagonal
        while (x < 7 && y < 6 && cells.eq(y * 7 + x).hasClass(currentPlayer)) {
            count++;
            x++;
            y++;
        }
        return count >= 4;
    }

    // Function to check for a diagonal win (top right to bottom left)
    function checkDiagonalWin2(columnIndex, rowIndex) {
        let count = 1;
        let x = columnIndex - 1;
        let y = rowIndex + 1;

        // Check downwards left diagonal
        while (x >= 0 && y < 6 && cells.eq(y * 7 + x).hasClass(currentPlayer)) {
            count++;
            x--;
            y++;
        }

        x = columnIndex + 1;
        y = rowIndex - 1;

        // Check upwards right diagonal
        while (x < 7 && y >= 0 && cells.eq(y * 7 + x).hasClass(currentPlayer)) {
            count++;
            x++;
            y--;
        }
        return count >= 4;
    }

    // Function to check for a draw
    function checkDraw() {
        for (let i = 0; i < cells.length; i++) {
            if (cells.eq(i).hasClass("empty")) {
                return false;
            }
        }
        return true;
    }

    // Function to mark the winning cells
    function markWinningCells() {
        let winningCells = (currentPlayer === "yellow" ? "winYellow" : "winRed");

        // Vertical win
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row < 3; row++) {
                if (
                    cells.eq(row * 7 + col).hasClass(currentPlayer) &&
                    cells.eq((row + 1) * 7 + col).hasClass(currentPlayer) &&
                    cells.eq((row + 2) * 7 + col).hasClass(currentPlayer) &&
                    cells.eq((row + 3) * 7 + col).hasClass(currentPlayer)
                ) {
                    cells.eq(row * 7 + col).addClass(winningCells);
                    cells.eq((row + 1) * 7 + col).addClass(winningCells);
                    cells.eq((row + 2) * 7 + col).addClass(winningCells);
                    cells.eq((row + 3) * 7 + col).addClass(winningCells);
                    return;
                }
            }
        }

        // Horizontal win
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 6; row++) {
                if (
                    cells.eq(row * 7 + col).hasClass(currentPlayer) &&
                    cells.eq(row * 7 + col + 1).hasClass(currentPlayer) &&
                    cells.eq(row * 7 + col + 2).hasClass(currentPlayer) &&
                    cells.eq(row * 7 + col + 3).hasClass(currentPlayer)
                ) {
                    cells.eq(row * 7 + col).addClass(winningCells);
                    cells.eq(row * 7 + col + 1).addClass(winningCells);
                    cells.eq(row * 7 + col + 2).addClass(winningCells);
                    cells.eq(row * 7 + col + 3).addClass(winningCells);
                    return;
                }
            }
        }

        // Diagonal win (from top left to bottom right)
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
                if (
                    cells.eq(row * 7 + col).hasClass(currentPlayer) &&
                    cells.eq((row + 1) * 7 + col + 1).hasClass(currentPlayer) &&
                    cells.eq((row + 2) * 7 + col + 2).hasClass(currentPlayer) &&
                    cells.eq((row + 3) * 7 + col + 3).hasClass(currentPlayer)
                ) {
                    cells.eq(row * 7 + col).addClass(winningCells);
                    cells.eq((row + 1) * 7 + col + 1).addClass(winningCells);
                    cells.eq((row + 2) * 7 + col + 2).addClass(winningCells);
                    cells.eq((row + 3) * 7 + col + 3).addClass(winningCells);
                    return;
                }
            }
        }

        // Diagonal win (from top right to bottom left)
        for (let col = 3; col < 7; col++) {
            for (let row = 0; row < 3; row++) {
                if (
                    cells.eq(row * 7 + col).hasClass(currentPlayer) &&
                    cells.eq((row + 1) * 7 + col - 1).hasClass(currentPlayer) &&
                    cells.eq((row + 2) * 7 + col - 2).hasClass(currentPlayer) &&
                    cells.eq((row + 3) * 7 + col - 3).hasClass(currentPlayer)
                ) {
                    cells.eq(row * 7 + col).addClass(winningCells);
                    cells.eq((row + 1) * 7 + col - 1).addClass(winningCells);
                    cells.eq((row + 2) * 7 + col - 2).addClass(winningCells);
                    cells.eq((row + 3) * 7 + col - 3).addClass(winningCells);
                    return;
                }
            }
        }
    }

    // Function to reset the game
    function resetGame() {
        location.reload();
        updatePlayerScores()
    }

    // Function to update the player indicator
    function updatePlayerIndicator() {
        for (let i = 0; i < playerCircles.length; i++) {
            playerCircles.eq(i).css("display", "none");
        }

        if (currentPlayer === "yellow") {
            playerCircles.eq(0).css("display", "block");
        } else {
            playerCircles.eq(1).css("display", "block");
        }
    }

    updatePlayerIndicator();

    // Load scores from Cookies
    function loadScores() {
        const scoresCookie = document.cookie.replace(/(?:^|.*;\s*)scores\s*\=\s*([^;]*).*$|^.*$/, "$1");
        if (scoresCookie) {
            return JSON.parse(scoresCookie);
        } else {
            return {
                red: 0,
                yellow: 0
            };
        }
    }

    // Save scores to Cookies
    function saveScores(scores) {
        document.cookie = `scores=${JSON.stringify(scores)}`;
    }

    // Load sizes from Cookies
    function loadSizes() {
        const sizesCookie = document.cookie.replace(/(?:^|.*;\s*)sizes\s*\=\s*([^;]*).*$|^.*$/, "$1");
        if (sizesCookie) {
            return JSON.parse(sizesCookie);
        } else {
            return {
                cellWidth: parseInt(cells.css("width")),
                cellHeight: parseInt(cells.css("height")),
                playerCircleWidth: parseInt(playerCircles.css("width")),
                playerCircleHeight: parseInt(playerCircles.css("height"))
            };
        }
    }

    // Save sizes to Cookies
    function saveSizes(sizes) {
        document.cookie = `sizes=${JSON.stringify(sizes)}`;
    }

    // Load theme from Cookies
    function loadTheme() {
        const themeCookie = document.cookie.replace(/(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$|^.*$/, "$1");
        if (themeCookie) {
            return JSON.parse(themeCookie);
        } else {
            return "FourInARowDark.css";
        }
    }

    // Save theme to Cookies
    function saveTheme(theme) {
        document.cookie = `theme=${JSON.stringify(theme)}`;
    }

    function updatePlayerScores(){
        let scores = loadScores();
        $("#pointsRed").text(scores.red);
        $("#pointsYellow").text(scores.yellow);
    }


});



