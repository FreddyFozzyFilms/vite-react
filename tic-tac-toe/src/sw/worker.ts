/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { GameState } from "../GameLogic";
import { blockingFunc } from "../utils";

export const someRPCFunc = (code : string, gs) => {
  //blockingFunc();
  let bruh = eval(`${code}; strat(${JSON.stringify(gs)})`)
  return bruh;
};