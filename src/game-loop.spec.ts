import { expect } from 'chai';
import * as sinon from 'sinon';

import * as GameLoop from './game-loop.js';

describe('GameLoop', function () {
  beforeEach(function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.window = {
      cancelAnimationFrame: sinon.fake(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      requestAnimationFrame(callback) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.callback = callback;
      },
    };
  });

  it('should export the gameState constants', function () {
    expect(GameLoop.RUNNING).to.equal('running');
  });

  it('should create an empty game', function () {
    const game = GameLoop.createGame();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.callback(performance.now());
    expect(game.start).not.to.throw;
    expect(game.stop).not.to.throw;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.callback(performance.now());
  });

  it('should call the update and render functions', function () {
    const update = sinon.fake();
    const render = sinon.fake();
    const game = GameLoop.createGame({ update, render });
    game.start();

    expect(update.called).to.be.false;
    expect(render.called).to.be.false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.callback(performance.now());
    expect(update.called).to.be.true;
    expect(render.called).to.be.true;
  });
});
