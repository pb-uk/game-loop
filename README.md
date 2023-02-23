# game-loop

> A game loop for browser.

## Quick start

Include game-loop from CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/@pbuk/game-loop@1"></script>
```

Create the callbacks that define the game.

```js
const config = {
  // Things that stay the same.
};

const getInitialState = (config) => {
  return {
    // Things that change.
  };
};

const update = ({ config, state, frameLength, runTime, gameState }) => {
  // Update state (don't change anything else).
};

const render = ({ config, state, frameLength, runTime, gameState }) => {
  // Update all displays (don't change anything).
};
```

Create and manage the game loop.

```js
// Set up the game and call `update` and `render` once with gameState = 'notStarted'.
const { start, stop, reset } = GameLoop.createGame({
  config,
  getInitialState,
  update,
  render,
});

// Starts the game running, or resumes after `stop()`.
start();
// Stops the game (can be resumed with `start()`).
stop();
// Stops the game and resets the state to the initial state.
reset();
```
