import * as React from 'react';

import Board from './components/Board';
import { GameState, isWin, isFull, updateGameState } from './GameLogic';

import { workerInstance, blockingFunc, randomIntFromInterval } from "./utils";


import CodeMirror from "@uiw/react-codemirror";
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view'
import { javascript } from "@codemirror/lang-javascript";

interface PvAiProps {
    N: number;
    strategy: (gs: GameState) => [number, number];
  }
export default function PvAi(props: PvAiProps) {
  const { N, strategy } = props;

  const [gameState, setGameState] = React.useState<GameState>({
    board: Array(N).fill(Array(N).fill(-1)),
    lastMove: [-1, -1],
    turn: 0,
  });

  const [random, setRandom] = React.useState<number>(0);
  const [output, setOutput] = React.useState([0,0])
  const [code, setCode] = React.useState<string>(
    "function strat(gs) { \n let N = gs.board.length; \n for (let i = 0; i < N; i++) {\n for (let j = 0; j < N; j++) {\n if (gs.board[i][j] == -1) return [i, j];\n }\n }\nreturn [-1, -1]\n}"
  );

  const workerCall = React.useCallback(async () => {
    const move = await workerInstance.someRPCFunc(code, gameState);
    // worker is inherently unsafe, therefore we must sanitize the output
    console.log('fail1')
    if (!Array.isArray(move) || move.length !== 2)
      return
    console.log('fail2')

    if (gameState.turn == 0)
      return
    setTimeout(async () => {
      setGameState((gs1) => {
        let gs2 = updateGameState(gs1, [parseInt(move[0]), parseInt(move[1])]);
        if (!gs2) return gs1; // no more changes if ai move is invalid
        return gs2;
      });
    }, 500);

  }, [code, gameState]);

  React.useEffect(() => {
    workerCall();
  }, [workerCall]);

  const normalFuncCall = React.useCallback(() => {
    blockingFunc();
  }, []);

  const randomIntHandler = React.useCallback(() => {
    setRandom(randomIntFromInterval(1, 100));
  }, []);

  const onChange = React.useCallback((value : string, viewUpdate:ViewUpdate) => {
    console.log("value:", value);
    setCode(value);
  }, []);

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
            ? () => {}
            : (r, e) => {
                setGameState((gs) => {
                  if (gs.turn == 1) return gs
                  let gs1 = updateGameState(gs, [r, e]);
                  if (!gs1) return gs; // no more changes if player move is invalid
                  return gs1;
                });
              }
        }
      />

  <CodeMirror
    value={code}
    theme="dark"
    extensions={[javascript({ jsx: true })]}
    onChange={onChange}
  />

  </div>
  );
}
