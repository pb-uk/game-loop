declare module 'src/index' {
  import { version } from 'package';
  type ConfigParameter = Record<string, unknown>;
  type StateParameter = Record<string, unknown>;
  type GameStateParameter = 'notStarted' | 'running' | 'stopped';
  interface CreateGameParameters {
    config?: ConfigParameter;
    render?: LoopFunction;
    update?: LoopFunction;
    getInitialState?: (config: ConfigParameter) => StateParameter;
  }
  interface LoopFunctionParameters {
    config: ConfigParameter;
    state: StateParameter;
    frameLength: number;
    runTime: number;
    gameState: GameStateParameter;
  }
  type LoopFunction = (params: LoopFunctionParameters) => void;
  const NOT_STARTED = 'notStarted';
  const RUNNING = 'running';
  const STOPPED = 'stopped';
  const createGame: (params?: CreateGameParameters) => {
    start: () => void;
    stop: () => void;
    reset: () => void;
  };
  export { version, RUNNING, NOT_STARTED, STOPPED, createGame };
}
//# sourceMappingURL=index.d.ts.map
