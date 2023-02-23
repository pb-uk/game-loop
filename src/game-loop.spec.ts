import { expect } from 'chai';
import * as sinon from 'sinon';
import { JSDOM } from 'jsdom';

import * as GameLoop from './game-loop.js';

describe('GameLoop', function () {
  beforeEach(function () {
    // eslint-disable-next-line
    // @ts-ignore
    global.window = new JSDOM('', { pretendToBeVisual: true }).window;
    global.document = global.window.document; // new JSDOM().document;
  });

  it('should export the gameState constants', function () {
    expect(GameLoop.HIDDEN).to.equal('hidden');
    expect(GameLoop.NOT_STARTED).to.equal('notStarted');
    expect(GameLoop.RUNNING).to.equal('running');
    expect(GameLoop.STOPPED).to.equal('stopped');
  });

  it('should create and run an empty game', async function () {
    const game = GameLoop.createGame();

    // af.triggerAnimationFrame();

    expect(game.start).not.to.throw;
    expect(game.stop).not.to.throw;
  });

  it('should call the update and render functions', function () {
    const update = sinon.fake();
    const render = sinon.fake();
    const requestAnimationFrameSpy = sinon.spy(window, 'requestAnimationFrame');
    const game = GameLoop.createGame({ update, render });

    game.start();

    // Should not be called until the next animation frame.
    expect(update.called).to.be.false;
    expect(render.called).to.be.false;

    // Trigger the animation frame callback.
    requestAnimationFrameSpy.getCall(0).args[0](performance.now());
    // Need to stop otherwise it will hang waiting for the next animation frame.
    game.stop();

    // Should be called now!
    expect(update.called).to.be.true;
    expect(render.called).to.be.true;
  });

  it.skip('should stop/start when the document goes out/comes in to view', function () {
    const visibilitychangeListenerSpy = sinon.spy(document, 'addEventListener');
    const requestAnimationFrameSpy = sinon.spy(window, 'requestAnimationFrame');
    const cancelAnimationFrameSpy = sinon.spy(window, 'cancelAnimationFrame');
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
    });

    const game = GameLoop.createGame();
    expect(requestAnimationFrameSpy.callCount).to.equal(0);
    game.start();
    expect(requestAnimationFrameSpy.callCount).to.equal(1);
    expect(cancelAnimationFrameSpy.callCount).to.equal(0);

    // Trigger the visibility change callback.
    // document.visibilityState = 'hidden';
    // visibilitychangeListenerSpy.getCall(0).args[1]();
    expect(cancelAnimationFrameSpy.callCount).to.equal(1);

    // document.visibilityState = 'visible';
    // visibilitychangeListenerSpy.getCall(0).args[1]();
    expect(requestAnimationFrameSpy.callCount).to.equal(1);
  });
});
