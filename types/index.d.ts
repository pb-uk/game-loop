declare module "src/game-loop" {
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
    const NOT_STARTED = "notStarted";
    const RUNNING = "running";
    const STOPPED = "stopped";
    const createGame: (params?: CreateGameParameters) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
    };
    export { RUNNING, NOT_STARTED, STOPPED, createGame };
}
declare module "src/index" {
    export { version } from "package";
    export { RUNNING, NOT_STARTED, STOPPED, createGame } from "src/game-loop";
}
//# sourceMappingURL=index.d.ts.map