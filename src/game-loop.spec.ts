import { expect } from 'chai';
import * as sinon from 'sinon';

import * as GameLoop from './game-loop.js';

const mockVisibility = () => {
  let visibilityChangeCallback: unknown;

  global.document = global.document || {};
  global.document.addEventListener = (event: string, callback: unknown) => {
    visibilityChangeCallback = callback;
  };

  return ({
    triggerVisibilityChange(state: string) {
      if (visibilityChangeCallback == null) {
        throw new Error('Callback not set');
      }
      document.visibilityState = state;
      visibilityChangeCallback();
    },
  });
};

const mockAnimationFrame = () => {
  let rafCallback: FrameRequestCallback|null;

  global.window = global.window || {};
  global.window.cancelAnimationFrame = sinon.fake(),
  global.window.requestAnimationFrame = (callback) => {
    rafCallback = callback;
    return 1;
  };

  return ({
    triggerAnimationFrame() {
      if (rafCallback == null) {
        throw new Error('Callback not set');
      }
      rafCallback(performance.now());
      rafCallback = null;
    },
  });
};

describe('GameLoop', function () {
  it('should export the gameState constants', function () {
    expect(GameLoop.HIDDEN).to.equal('hidden');
    expect(GameLoop.NOT_STARTED).to.equal('notStarted');
    expect(GameLoop.RUNNING).to.equal('running');
    expect(GameLoop.STOPPED).to.equal('stopped');
  });

  it('should create and run an empty game', async function () {
    const af = mockAnimationFrame();
    const game = GameLoop.createGame();

    af.triggerAnimationFrame();

    expect(game.start).not.to.throw;
    expect(game.stop).not.to.throw;
  });

  it('should call the update and render functions', function () {
    const af = mockAnimationFrame();
    const update = sinon.fake();
    const render = sinon.fake();
    const game = GameLoop.createGame({ update, render });
    game.start();

    expect(update.called).to.be.false;
    expect(render.called).to.be.false;

    af.triggerAnimationFrame();

    expect(update.called).to.be.true;
    expect(render.called).to.be.true;
  });

  it.skip('should stop/start when the document goes out/comes in to view', function () {
    expect(false).to.be.true;
  });
});
