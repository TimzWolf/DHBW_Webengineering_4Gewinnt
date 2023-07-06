package de.dhbw.tinf22b4.viergewinnt.beans;
import java.util.Random;

public class SpielbrettBean {
    private static final int ROWS = 6;
    private static final int COLS = 7;
    private static final int EMPTY = 0;
    private static final int PLAYER1 = 1;
    private static final int PLAYER2 = 2;
    private static final int WINROW = 3;

    private int[][] board;
    private int currentPlayer;
    private boolean inGame;
    private int[] playerGamesWon;
    private int currentWinner;

    public SpielbrettBean() {
        resetScore();
        reset();
    }

    public void reset() {
        board = new int[ROWS][COLS];
        currentPlayer = PLAYER1;
        currentWinner = 0;
        resetBoard();
        inGame = true;
    }

    public void resetScore() {
        playerGamesWon = new int[]{0,0};
    }

    public void resetBoard() {
        for (int i = 0; i < ROWS; i++) {
            for (int j = 0; j < COLS; j++) {
                board[i][j] = EMPTY;
            }
        }
    }

    public boolean setStone(int column) {
        if (column < 0 || column >= COLS) {
            return false;
        }

        for (int i = ROWS - 1; i >= 0; i--) {
            if (board[i][column] == EMPTY) {
                if(inGame)board[i][column] = currentPlayer;
                return true;
            }
        }

        return false;
    }

    public boolean checkWin() {
        // Check rows
        for (int i = 0; i < ROWS; i++) {
            for (int j = 0; j < COLS - 3; j++) {
                int player = board[i][j];
                if (player != EMPTY && board[i][j + 1] == player && board[i][j + 2] == player && board[i][j + 3] == player) {
                    for(int l = 0 ; l <= 3 ; l++) board[i][j+l]=WINROW;
                    return handleWin();
                }
            }
        }

        // Check columns
        for (int j = 0; j < COLS; j++) {
            for (int i = 0; i < ROWS - 3; i++) {
                int player = board[i][j];
                if (player != EMPTY && board[i + 1][j] == player && board[i + 2][j] == player && board[i + 3][j] == player) {
                    for(int l = 0 ; l <= 3 ; l++) board[i+l][j]=WINROW;
                    return handleWin();
                }
            }
        }

        // Check diagonals (positive slope)
        for (int i = 0; i < ROWS - 3; i++) {
            for (int j = 0; j < COLS - 3; j++) {
                int player = board[i][j];
                if (player != EMPTY && board[i + 1][j + 1] == player && board[i + 2][j + 2] == player && board[i + 3][j + 3] == player) {
                    for(int l = 0 ; l <= 3 ; l++) board[i+l][j+l]=WINROW;
                    return handleWin();
                }
            }
        }

        // Check diagonals (negative slope)
        for (int i = 3; i < ROWS; i++) {
            for (int j = 0; j < COLS - 3; j++) {
                int player = board[i][j];
                if (player != EMPTY && board[i - 1][j + 1] == player && board[i - 2][j + 2] == player && board[i - 3][j + 3] == player) {
                    for(int l = 0 ; l <= 3 ; l++) board[i-l][j+l]=WINROW;
                    return handleWin();
                }
            }
        }

        return false;
    }

    /*public int getBestMove() {
        int bestMove = 0;
        int maxScore = 0;
        for (int i = 0; i < COLS; i++){
            for (int j = ROWS - 1; j >= 0; j--){
                if (board[j][i] == EMPTY){
                    int currentScore = bestScore(j, i);
                    if (maxScore < currentScore){
                        maxScore = currentScore;
                        bestMove = j;
                    }
                }
            }
        }
        if (maxScore == 0) {
            Random random = new Random();
            bestMove = random.nextInt(8);
        }
        return bestMove;
    }

    public int bestScore(int row, int col){
        int maxScore = 0;
        if (col == 0) {
            for (int i = row + 1; i < ROWS; i++) {
                if (board[i][col] != currentPlayer) {
                    maxScore = Math.max(maxScore, i - row -1);
                    break;
                }
            }
            for (int i = col + 1; i < COLS; i++){
                if (board[row][i] != currentPlayer || board[row][i] == EMPTY){
                    maxScore = Math.max(maxScore, i- col - 1);
                    break;
                }
            }
            for (int i = 1; i < ROWS; i++) {
                if (row + i < ROWS) {
                    if (board[row + 1][col + 1] != currentPlayer || board[row + 1][col + 1] == EMPTY) {
                        maxScore = Math.max(maxScore, i - 1);
                        break;
                    }
                } else {
                    break;
                }
            }
            for (int i = 1; i < ROWS; i++) {
                if (row - i >= 0) {
                    if (board[row - 1][col + 1] != currentPlayer || board[row - 1][col + 1] == EMPTY) {
                        maxScore = Math.max(maxScore, i - 1);
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        return maxScore;
    } */

    public int getBestMove() {
        int bestMove = -1;
        int maxScore = -1;

        for (int column = 0; column < COLS; column++) {
            if (setStone(column)) {
                int connectedPieces = calcMaxScore(currentPlayer);
                resetStone(column);

                if (connectedPieces > maxScore) {
                    maxScore = connectedPieces;
                    bestMove = column;
                }
            }
        }

        if (maxScore <= 0) {
            System.out.println("random");
            Random random = new Random();
            bestMove = random.nextInt(8);
        }
        System.out.println("best move:" + bestMove);
        return bestMove;
    }

    private int calcMaxScore(int player) {
        int maxConnected = -1;

        // Check for connected pieces horizontally
        for (int i = 0; i < ROWS; i++) {
            for (int j = 0; j <= COLS - WINROW; j++) {
                int count = 0;
                for (int k = 1; k < WINROW; k++) {
                    if (board[i][j + k] == player) {
                        count++;
                    } else {
                        break;
                    }
                }
                maxConnected = Math.max(maxConnected, count);
            }
        }

        // Check for connected pieces vertically
        for (int j = 0; j < COLS; j++) {
            for (int i = 0; i <= ROWS - WINROW; i++) {
                int count = 0;
                for (int k = 1; k < WINROW; k++) {
                    if (board[i + k][j] == player) {
                        count++;
                    } else {
                        break;
                    }
                }
                maxConnected = Math.max(maxConnected, count);
            }
        }

        // Check for connected pieces diagonally (positive)
        for (int i = 0; i <= ROWS - WINROW; i++) {
            for (int j = 0; j <= COLS - WINROW; j++) {
                int count = 0;
                for (int k = 1; k < WINROW; k++) {
                    if (board[i + k][j + k] == player) {
                        count++;
                    } else {
                        break;
                    }
                }
                maxConnected = Math.max(maxConnected, count);
            }
        }

        // Check for connected pieces diagonally (negative)
        for (int i = WINROW - 1; i < ROWS; i++) {
            for (int j = 0; j <= COLS - WINROW; j++) {
                int count = 0;
                for (int k = 1; k < WINROW; k++) {
                    if (board[i - k][j + k] == player) {
                        count++;
                    } else {
                        break;
                    }
                }
                maxConnected = Math.max(maxConnected, count);
            }
        }

        return maxConnected;
    }

    private void resetStone(int column) {
        for (int i = 0; i < ROWS; i++) {
            if (board[i][column] != EMPTY) {
                board[i][column] = EMPTY;
                break;
            }
        }
    }


    public boolean checkDraw() {
        boolean isDraw = true;
        for(int i = 0 ; i < COLS ; i++)
            if(board[0][i] == EMPTY)
                isDraw = false;
        if(isDraw) inGame = false;
        return isDraw;
    }

    private boolean handleWin() {
        if(isInGame()) addWin();
        currentWinner = getCurrentPlayer();
        inGame = false;
        return true;
    }

    public int getCurrentPlayer() {
        return currentPlayer;
    }

    public void switchPlayer() {
        currentPlayer = (currentPlayer == PLAYER1) ? PLAYER2 : PLAYER1;
    }

    public int[][] getBoard() {
        return board;
    }

    public boolean isInGame() {
        return inGame;
    }

    private void addWin() {
        playerGamesWon[getCurrentPlayer()-1]++;
    }

    public int getWins(int player) {
        return playerGamesWon[player-1];
    }

    public int getCurrentWinner() {
        return currentWinner;
    }
}