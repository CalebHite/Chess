## Smart Contract
```
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract Chess {
    // 2D array representing the chessboard
    int104[8][8] public board;

    // Define constants for pieces
    int104 constant EMPTY = 0;
    int104 constant PAWN = 1;
    int104 constant ROOK = 2;
    int104 constant KNIGHT = 3;
    int104 constant BISHOP = 4;
    int104 constant QUEEN = 5;
    int104 constant KING = 6;

    // Negative values represent black pieces
    // Positive values represent white pieces

    address public whitePlayer;
    address public blackPlayer;
    address public winner;

    constructor(address _whitePlayer, address _blackPlayer) {
        whitePlayer = _whitePlayer;
        blackPlayer = _blackPlayer;
        initializeBoard();
    }

    // Initialize the board with the correct setup
    function initializeBoard() public {
        // Pawns
        for (uint8 i = 0; i < 8; i++) {
            board[1][i] = PAWN; // White pawns
            board[6][i] = -PAWN; // Black pawns
        }

        // Rooks
        board[0][0] = ROOK; board[0][7] = ROOK; // White rooks
        board[7][0] = -ROOK; board[7][7] = -ROOK; // Black rooks

        // Knights
        board[0][1] = KNIGHT; board[0][6] = KNIGHT; // White knights
        board[7][1] = -KNIGHT; board[7][6] = -KNIGHT; // Black knights

        // Bishops
        board[0][2] = BISHOP; board[0][5] = BISHOP; // White bishops
        board[7][2] = -BISHOP; board[7][5] = -BISHOP; // Black bishops

        // Queens
        board[0][3] = QUEEN; // White queen
        board[7][3] = -QUEEN; // Black queen

        // Kings
        board[0][4] = KING; // White king
        board[7][4] = -KING; // Black king
    }

    // Move a piece from one position to another
    function movePiece(
        uint8 fromRow,
        uint8 fromCol,
        uint8 toRow,
        uint8 toCol
    ) public {
        require(
            msg.sender == whitePlayer || msg.sender == blackPlayer,
            "Only players can move pieces"
        );
        require(
            fromRow < 8 && fromCol < 8 && toRow < 8 && toCol < 8,
            "Invalid board position"
        );
        require(board[fromRow][fromCol] != EMPTY, "No piece at the source position");

        // Ensure only the correct player moves their pieces
        if (msg.sender == whitePlayer) {
            require(board[fromRow][fromCol] > 0, "You can only move your pieces");
        } else {
            require(board[fromRow][fromCol] < 0, "You can only move your pieces");
        }

        // Move the piece
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = EMPTY;
    }

    // Define the winner based on a checkmate
    function declareWinner(address _winner) public {
        require(
            msg.sender == whitePlayer || msg.sender == blackPlayer,
            "Only players can declare a winner"
        );
        require(winner == address(0), "Winner already declared");
        winner = _winner;
    }

    // Get the board state at a specific position
    function getPiece(uint8 row, uint8 col) public view returns (int104) {
        require(row < 8 && col < 8, "Invalid board position");
        return board[row][col];
    }
}
```