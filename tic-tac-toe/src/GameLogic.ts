export interface GameState {
    board: number[][];
    lastMove: [number, number];
    turn: number;
  }
  
  export function isWin(gs: GameState): boolean {
    let { board, lastMove, turn } = gs;
    let [moveR, moveC] = lastMove;
  
    if (moveR === -1 && moveC === -1) return false;
    // if it's currently player 1's turn that means player 0 just went
    // so we want to check if the current board state is a win for player 0
    // thus we check if the previous player's move is a winning position (and not the current player)
    turn = (turn + 1) % 2;
  
    let N = board.length;
    let checkRow = (i : number) => {
      for (let j = 0; j < N; j++) {
        if (board[i][j] != turn) return false;
      }
      return true;
    };
    let checkColumn = (j : number) => {
      for (let i = 0; i < N; i++) {
        if (board[i][j] != turn) return false;
      }
      return true;
    };
    let checkDiagL = () => {
      // left diagonal
      for (let i = 0; i < N; i++) {
        if (board[i][i] != turn) return false;
      }
      return true;
    };
    let checkDiagR = () => {
      // right diagonal
      for (let i = 0; i < N; i++) {
        if (board[i][N - i-1] != turn) return false;
      }
      return true;
    };
    return checkRow(moveR) || checkColumn(moveC) || checkDiagL() || checkDiagR();
  }
  
  export function isFull(board: number[][]): boolean {
    let N = board.length;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (board[i][j] == -1) return false;
      }
    }
    return true;
  }
  
  export function updateGameState(
    gs: GameState,
    move: [number, number]
  ): GameState | null {
    // return null if game has already reached a win condition
    if (isWin(gs)) return null;
    // return null if move is invalid
    if (gs.board[move[0]][move[1]] !== -1) return null;
  
    let newBoard = gs.board.map((row, rindex) =>
      row.map((elem, eindex) => {
        if (eindex != move[1] || rindex != move[0]) return elem;
        if (elem == -1) {
          return gs.turn;
        }
        return elem;
      })
    );
    // we don't need to worry about turn not being upated because we want the turn of the player who just went and not the turn of the next player
    // setWin(checkWin(newBoard, turn));
    return {
      board: newBoard,
      lastMove: move, // move made to get to the current boad state
      turn: (gs.turn + 1) % 2, // 0 player O, 1 player X
    };
  }
  