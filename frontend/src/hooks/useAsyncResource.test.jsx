// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAsyncResource } from './useAsyncResource.js';

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
let root, container, resource;
function Probe({ load, enabled = true }) {
  resource = useAsyncResource(load, { enabled, initialData: [] });
  return null;
}
const render = (load, enabled = true) => act(async () => {
  root.render(<Probe load={load} enabled={enabled} />);
});
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe('useAsyncResource request lifecycle', () => {
  it('keeps the latest selection when an older request completes afterwards', async () => {
    const old = deferred(), current = deferred();
    const firstLoad = vi.fn(() => old.promise);
    await render(firstLoad);
    const firstSignal = firstLoad.mock.calls[0][0];
    await render(() => current.promise);
    expect(firstSignal.aborted).toBe(true);
    await act(async () => current.resolve(['current event']));
    await act(async () => old.resolve(['stale event']));
    expect(resource.data).toEqual(['current event']);
    expect(resource.loading).toBe(false);
    expect(resource.error).toBe('');
  });

  it('does not let a stale failure hide a successful new request', async () => {
    const old = deferred();
    await render(() => old.promise);
    await render(async () => ['updated agenda']);
    await act(async () => old.reject(new Error('Old connection failed')));
    expect(resource.data).toEqual(['updated agenda']);
    expect(resource.error).toBe('');
  });

  it('clears a failure while retrying and replaces it with recovered data', async () => {
    const retry = deferred();
    const load = vi.fn().mockRejectedValueOnce(new Error('Sin conexión')).mockReturnValueOnce(retry.promise);
    await render(load);
    expect(resource.error).toBe('Sin conexión');
    expect(resource.loading).toBe(false);
    await act(async () => resource.reload());
    expect(resource.error).toBe('');
    expect(resource.loading).toBe(true);
    await act(async () => retry.resolve(['recovered event']));
    expect(resource.data).toEqual(['recovered event']);
    expect(resource.loading).toBe(false);
  });

  it('does not load while disabled and cancels active work when disabled again', async () => {
    const pending = deferred();
    const load = vi.fn(() => pending.promise);
    await render(load, false);
    expect(load).not.toHaveBeenCalled();
    expect(resource.loading).toBe(false);
    await render(load, true);
    const signal = load.mock.calls[0][0];
    await render(load, false);
    expect(signal.aborted).toBe(true);
    await act(async () => pending.resolve(['should not appear']));
    expect(resource.data).toEqual([]);
    expect(resource.loading).toBe(false);
  });
});
