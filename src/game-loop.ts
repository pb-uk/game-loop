type ConfigParameter = Record<string, unknown>;
type StateParameter = Record<string, unknown>;
type GameStateParameter = 'hidden' |'notStarted' | 'running' | 'stopped';

export interface GameParameters {
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

// The state is HIDDEN when it is moved off screen while is is running so
// animation frames will no longer fire.
const HIDDEN = 'hidden';
const NOT_STARTED = 'notStarted';
const RUNNING = 'running';
const STOPPED = 'stopped';

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

  let gameState: GameStateParameter = NOT_STARTED;

  let rafCallback: number;
  let state = getInitialState(config);

  const loop = (currentFrameTime: number) => {
    const frameLength = currentFrameTime - (frameTime ?? currentFrameTime);
    frameTime = currentFrameTime;

    if (gameState === RUNNING) {
      runTime += frameLength;
    }

    // Pass only what is necessary to update and render.
    update({ config, state, frameLength, runTime, gameState });
    render({ config, state, frameLength, runTime, gameState });

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

  reset();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (gameState === HIDDEN) {
        // Resume running.
        start();
      }
    } else {
      if (gameState === RUNNING) {
        window.cancelAnimationFrame(rafCallback);
        gameState = HIDDEN;
      }
    }
  });

  return {
    start,
    stop,
    reset,
  };
};

export { HIDDEN, RUNNING, NOT_STARTED, STOPPED, createGame };
