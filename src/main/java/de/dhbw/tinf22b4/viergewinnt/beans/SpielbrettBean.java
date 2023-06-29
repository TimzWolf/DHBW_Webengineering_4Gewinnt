package de.dhbw.tinf22b4.viergewinnt.beans;

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