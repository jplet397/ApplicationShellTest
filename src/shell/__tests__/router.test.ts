import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

// Module Federation remotes are resolved to local stubs via vitest.config.ts aliases.
// No vi.mock() needed — the alias makes the import resolvable at transform time.
import Router from '../router';

// jsdom does not support navigation, so we stub window.location with a controllable object.
let currentHash = '';

function setHash(hash: string) {
  currentHash = hash;
}

function dispatchHashChange() {
  window.dispatchEvent(new Event('hashchange'));
}

async function flushPromises() {
  // Drain multiple microtask/macrotask turns to let chained async calls settle.
  // Router.initialize -> handleHashChange -> loadModule has ~3 await hops.
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

describe('Router', () => {
  let appContainer: HTMLDivElement;

  beforeEach(() => {
    currentHash = '';
    vi.stubGlobal('location', {
      get hash() { return currentHash; },
    });

    appContainer = document.createElement('div');
    appContainer.id = 'appContainer';
    document.body.appendChild(appContainer);
  });

  afterEach(() => {
    if (document.body.contains(appContainer)) {
      document.body.removeChild(appContainer);
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('throws when #appContainer is absent', () => {
      document.body.removeChild(appContainer);
      expect(() => new Router()).toThrow("The 'appContainer' element was not found in the DOM.");
      // Re-add so afterEach cleanup does not fail
      document.body.appendChild(appContainer);
    });

    it('initializes without error when #appContainer is present', () => {
      expect(() => new Router()).not.toThrow();
    });
  });

  describe('default route', () => {
    it('renders Home heading for empty hash', async () => {
      setHash('');
      new Router();
      await flushPromises();
      expect(appContainer.innerHTML).toContain('<h1>Home</h1>');
    });

    it('renders Home heading for unrecognised hash', async () => {
      setHash('#/unknown');
      new Router();
      await flushPromises();
      expect(appContainer.innerHTML).toContain('<h1>Home</h1>');
    });
  });

  describe('#/mfe1 route', () => {
    it('appends the mfe1 web component element', async () => {
      setHash('#/mfe1');
      new Router();
      await flushPromises();
      expect(appContainer.querySelector('microfrontend-one')).not.toBeNull();
    });
  });

  describe('#/about route', () => {
    it('appends the about web component element', async () => {
      setHash('#/about');
      new Router();
      await flushPromises();
      expect(appContainer.querySelector('microfrontend-two')).not.toBeNull();
    });
  });

  describe('#/contact route', () => {
    it('fetches contact.html and appends its content', async () => {
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('<p>Contact us</p>', { status: 200 }),
      );
      setHash('#/contact');
      new Router();
      await flushPromises();
      expect(fetchMock).toHaveBeenCalledWith('contact.html');
      expect(appContainer.innerHTML).toContain('Contact us');
    });
  });

  describe('route transitions', () => {
    it('removes the previous child before loading a new route', async () => {
      setHash('');
      new Router();
      await flushPromises();
      expect(appContainer.innerHTML).toContain('<h1>Home</h1>');

      setHash('#/mfe1');
      dispatchHashChange();
      await flushPromises();

      expect(appContainer.childElementCount).toBe(1);
      expect(appContainer.querySelector('microfrontend-one')).not.toBeNull();
    });
  });

  describe('hashchange event', () => {
    it('re-renders when hash changes to #/about', async () => {
      setHash('');
      new Router();
      await flushPromises();

      setHash('#/about');
      dispatchHashChange();
      await flushPromises();

      expect(appContainer.querySelector('microfrontend-two')).not.toBeNull();
    });
  });
});
