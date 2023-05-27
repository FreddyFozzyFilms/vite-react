import * as React from 'react';
import './style.css';

import Board from './components/Board';

import { GameState, isWin, isFull, updateGameState } from './GameLogic';

interface PvPProps {
  N: number;
}
function PvP(props: PvPProps) {
  const { N } = props;

  const [gameState, setGameState] = React.useState<GameState>({
    board: Array(N).fill(Array(N).fill(-1)),
    lastMove: [-1, -1],
    turn: 0,
  });

  // so entire game state resets everytime component remounts
  React.useEffect(() => {
    setGameState({
      board: Array(N).fill(Array(N).fill(-1)),
      lastMove: [-1, -1],
      turn: 0,
    });
  }, [N]);

  return (
    <div className="game-holder">
      {isFull(gameState.board) && !isWin(gameState) ? (
        <h1>Tie</h1>
      ) : (
        <h1>
          {isWin(gameState)
            ? `Player ${(gameState.turn + 1) % 2} YOU WIN!`
            : `Player ${gameState.turn}'s turn`}
        </h1>
      )}
      <Board
        mat={gameState.board}
        onChange={
          isWin(gameState)
            ? (r, e) => {}
            : (r, e) => {
                setGameState((gs) => {
                  const updatedState = updateGameState(gs, [r, e]);
                  return updatedState !== null ? updatedState : gs;
                });
              }
        }
      />
    </div>
  );
}

interface PvAiProps {
  N: number;
  strategy: (gs: GameState) => [number, number];
}
function PvAi(props: PvAiProps) {
  const { N, strategy } = props;

  const [gameState, setGameState] = React.useState<GameState>({
    board: Array(N).fill(Array(N).fill(-1)),
    lastMove: [-1, -1],
    turn: 0,
  });

  // so entire game state resets everytime component remounts
  React.useEffect(() => {
    setGameState({
      board: Array(N).fill(Array(N).fill(-1)),
      lastMove: [-1, -1],
      turn: 0,
    });
  }, [N]);

  return (
    <div className="game-holder">
      {isFull(gameState.board) && !isWin(gameState) ? (
        <h1>Tie</h1>
      ) : (
        <h1>
          {isWin(gameState)
            ? `Player ${(gameState.turn + 1) % 2} YOU WIN!`
            : `Player ${gameState.turn}'s turn`}
        </h1>
      )}
      <Board
        mat={gameState.board}
        onChange={
          isWin(gameState)
            ? (r, e) => {}
            : (r, e) => {
                setGameState((gs) => {
                  let gs1 = updateGameState(gs, [r, e]);
                  if (!gs1) return gs; // no more changes if player move is invalid
                  return gs1;
                });
                setTimeout(
                  () =>
                    setGameState((gs1) => {
                      let gs2 = updateGameState(gs1, strategy(gs1));
                      if (!gs2) return gs1; // no more changes if ai move is invalid
                      return gs2;
                    }),
                  500
                );
              }
        }
      />
    </div>
  );
}

function iterateWithDelay(
  array: any[],
  effect: (t : any) => any,
  delay: number,
  end: () => any
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let index = 0;

    function next() {
      if (index < array.length) {
        setTimeout(() => {
          effect(array[index]);
          index++;
          next();
        }, delay);
      } else {
        end(); // Resolve without any arguments
      }
    }

    next();
  });
}

interface AivAiProps {
  N: number;
  strategys: [
    (gs: GameState) => [number, number],
    (gs: GameState) => [number, number]
  ];
}
function AivAi(props: AivAiProps) {
  const { N, strategys } = props;

  const [gameState, setGameState] = React.useState<GameState>({
    board: Array(N).fill(Array(N).fill(-1)),
    lastMove: [-1, -1],
    turn: 0,
  });

  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  // so entire game state resets everytime component remounts
  React.useEffect(() => {
    setGameState({
      board: Array(N).fill(Array(N).fill(-1)),
      lastMove: [-1, -1],
      turn: 0,
    });
  }, [N]);

  function runGame(gs: GameState): (GameState | null)[] {
    let gameSeq: (GameState | null)[] = [];
    let temp : GameState | null = gs;
    while (temp) {
      temp = updateGameState(temp, strategys[temp.turn](temp));
      gameSeq.push(temp);
    }
    gameSeq.pop();
    return gameSeq;
  }

  return (
    <div className="game-holder">
      {isFull(gameState.board) && !isWin(gameState) ? (
        <h1>Tie</h1>
      ) : (
        <h1>
          {isWin(gameState)
            ? `Ai ${(gameState.turn + 1) % 2} WINS!`
            : `Ai ${gameState.turn}'s turn`}
        </h1>
      )}
      <Board mat={gameState.board} onChange={() => {}} />
      <button
        className="button glow-button"
        onClick={
          isPlaying
            ? () => {}
            : () => {
                setIsPlaying(true);
                iterateWithDelay(
                  runGame({
                    board: Array(N).fill(Array(N).fill(-1)),
                    lastMove: [-1, -1],
                    turn: 0,
                  }),
                  setGameState,
                  500,
                  () => setIsPlaying(false)
                );
              }
        }
      >
        Play Game
      </button>
    </div>
  );
}

// board state is controlled by the App component
// via useState hook attached to the board matrix
export default function App() {
  const [mode, setMode] = React.useState<number>(0);

  function naiveStrat(gs: GameState): [number, number] {
    let N = gs.board.length;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (gs.board[i][j] == -1) return [i, j];
      }
    }
    return [-1, -1]
  }
  return (
    <div className="app">
      <button
        className="button glow-button"
        onClick={() => setMode((prev) => (prev + 1) % 3)}
      >
        {['P v P', 'P v Ai', 'Ai v Ai'][mode]}
      </button>
      {
        [
          <PvP N={4} />,
          <PvAi N={4} strategy={naiveStrat} />,
          <AivAi N={4} strategys={[naiveStrat, naiveStrat]} />,
        ][mode]
      }
    </div>
  );
}
