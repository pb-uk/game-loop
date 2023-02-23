declare module "src/game-loop" {
    type ConfigParameter = Record<string, unknown>;
    type StateParameter = Record<string, unknown>;
    type GameStateParameter = 'hidden' | 'notStarted' | 'running' | 'stopped' | 'wasHidden';
    export interface GameParameters {
        config?: ConfigParameter;
        render?: LoopFunction;
        update?: LoopFunction;
        getInitialState?: (config: ConfigParameter) => StateParameter;
        stopWhenHidden?: boolean;
    }
    interface LoopFunctionParameters {
        config: ConfigParameter;
        state: StateParameter;
        frameLength: number;
        runTime: number;
        gameState: GameStateParameter;
    }
    type LoopFunction = (params: LoopFunctionParameters) => void;
    const HIDDEN = "hidden";
    const NOT_STARTED = "notStarted";
    const RUNNING = "running";
    const STOPPED = "stopped";
    const WAS_HIDDEN = "wasHidden";
    const createGame: (params?: GameParameters) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        setStopWhenHidden: (set?: boolean) => void;
    };
    export { HIDDEN, RUNNING, NOT_STARTED, STOPPED, WAS_HIDDEN, createGame };
}
declare module "src/index" {
    export { version } from "package";
    export { HIDDEN, RUNNING, NOT_STARTED, STOPPED, createGame } from "src/game-loop";
}
//# sourceMappingURL=index.d.ts.map