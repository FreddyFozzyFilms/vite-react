/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { GameState } from "../GameLogic";

export const someRPCFunc = (code : string, gs : GameState) => {
  //blockingFunc();
  let bruh = eval(`${code}; strat(${JSON.stringify(gs)})`)
  return bruh;
};