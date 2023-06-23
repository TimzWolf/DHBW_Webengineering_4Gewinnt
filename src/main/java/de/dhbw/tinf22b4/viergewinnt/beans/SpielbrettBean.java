package de.dhbw.tinf22b4.viergewinnt.beans;

public class SpielbrettBean {
    private static final int ROWS = 6;
    private static final int COLS = 7;
    private static final int EMPTY = 0;
    private static final int PLAYER1 = 1;
    private static final int PLAYER2 = 2;

    private int[][] board;
    private int currentPlayer;
    private boolean inGame;

    public SpielbrettBean() {
        reset();
    }

    public void reset() {
        board = new int[ROWS][COLS];
        currentPlayer = PLAYER1;
        resetBoard();
        inGame = true;
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
                    inGame = false;
                    return true;
                }
            }
        }

        // Check columns
        for (int j = 0; j < COLS; j++) {
            for (int i = 0; i < ROWS - 3; i++) {
                int player = board[i][j];
                if (player != EMPTY && board[i + 1][j] == player && board[i + 2][j] == player && board[i + 3][j] == player) {
                    inGame = false;
                    return true;
                }
            }
        }

        // Check diagonals (positive slope)
        for (int i = 0; i < ROWS - 3; i++) {
            for (int j = 0; j < COLS - 3; j++) {
                int player = board[i][j];
                if (player != EMPTY && board[i + 1][j + 1] == player && board[i + 2][j + 2] == player && board[i + 3][j + 3] == player) {
                    inGame = false;
                    return true;
                }
            }
        }

        // Check diagonals (negative slope)
        for (int i = 3; i < ROWS; i++) {
            for (int j = 0; j < COLS - 3; j++) {
                int player = board[i][j];
                if (player != EMPTY && board[i - 1][j + 1] == player && board[i - 2][j + 2] == player && board[i - 3][j + 3] == player) {
                    inGame = false;
                    return true;
                }
            }
        }

        return false;
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
}