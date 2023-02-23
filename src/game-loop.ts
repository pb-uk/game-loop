type ConfigParameter = Record<string, unknown>;
type StateParameter = Record<string, unknown>;
type GameStateParameter =
  | 'hidden'
  | 'notStarted'
  | 'running'
  | 'stopped'
  | 'wasHidden';

export interface GameParameters {
  config?: ConfigParameter;
  render?: LoopFunction;
  update?: LoopFunction;
  getInitialState?: (config: ConfigParameter) => StateParameter;
  // Maximum time (in ms) for a background step, or false to stop counting time
  // when in the background.
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

// The state is HIDDEN when it is moved off screen while is is running so
// animation frames will no longer fire.
const HIDDEN = 'hidden';
const NOT_STARTED = 'notStarted';
const RUNNING = 'running';
const STOPPED = 'stopped';
const WAS_HIDDEN = 'wasHidden';

const emptyFunction = () => {
  // Does nothing.
};

const createGame = (params: GameParameters = {}) => {
  const render = params.render ?? emptyFunction;
  const update = params.update ?? emptyFunction;
  const getInitialState = params.getInitialState ?? (() => ({}));
  const config = params.config ?? {};

  // Process time of current frame.
  let frameTime: number | null;
  // Cumulative run time in ms.
  let runTime = 0;
  // Current state of the loop runner.
  let gameState: GameStateParameter = NOT_STARTED;
  // Stores the animation frame callback ref. so we can cancel it.
  let rafCallback: number;
  // Stop when hidden.
  let stopWhenHidden = false;

  let state = getInitialState(config);

  const loop = (currentFrameTime: number) => {
    const frameLength = currentFrameTime - (frameTime ?? currentFrameTime);
    frameTime = currentFrameTime;

    if (gameState === RUNNING || gameState === WAS_HIDDEN) {
      runTime += frameLength;
    }

    // Pass only what is necessary to update and render.
    update({ config, state, frameLength, runTime, gameState });
    render({ config, state, frameLength, runTime, gameState });

    if (gameState === WAS_HIDDEN) {
      gameState = RUNNING;
    }
    if (gameState === RUNNING) {
      window.requestAnimationFrame(loop);
    }
  };

  const start = () => {
    window.cancelAnimationFrame(rafCallback);
    gameState = RUNNING;
    frameTime = null;
    rafCallback = window.requestAnimationFrame(loop);
  };

  const stop = () => {
    gameState = STOPPED;
  };

  const reset = () => {
    gameState = NOT_STARTED;
    state = getInitialState(config);
    window.cancelAnimationFrame(rafCallback);
    frameTime = null;
    rafCallback = window.requestAnimationFrame(loop);
  };

  const visibilitychangeListener = () => {
    if (document.visibilityState === 'visible') {
      if (gameState === HIDDEN) {
        // Resume running.
        if (stopWhenHidden) {
          frameTime = null;
        }
        gameState = WAS_HIDDEN;
        rafCallback = window.requestAnimationFrame(loop);
      }
    } else {
      if (gameState === RUNNING || gameState === WAS_HIDDEN) {
        gameState = HIDDEN;
        // Don't want to attempt to render when hidden even if we are still running.
        window.cancelAnimationFrame(rafCallback);
      }
    }
  };

  const setStopWhenHidden = (set = true) => {
    stopWhenHidden = !!set;
  };

  reset();
  setStopWhenHidden(params.stopWhenHidden);

  document.addEventListener('visibilitychange', visibilitychangeListener);

  return {
    start,
    stop,
    reset,
    setStopWhenHidden,
  };
};

export { HIDDEN, RUNNING, NOT_STARTED, STOPPED, WAS_HIDDEN, createGame };
