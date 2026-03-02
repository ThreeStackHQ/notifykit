// Global SSE subscriber store
// Map<"workspaceId:recipientId", Set<ReadableStreamDefaultController>>
// Key MUST include workspaceId to prevent cross-workspace notification leakage (IDOR via SSE).
declare global {
  // eslint-disable-next-line no-var
  var sseSubscribers: Map<string, Set<ReadableStreamDefaultController>> | undefined;
}

export function getSSEStore(): Map<string, Set<ReadableStreamDefaultController>> {
  if (!global.sseSubscribers) {
    global.sseSubscribers = new Map();
  }
  return global.sseSubscribers;
}

/** Composite key: workspaceId + recipientId prevents cross-workspace SSE leakage */
export function sseKey(workspaceId: string, recipientId: string): string {
  return `${workspaceId}:${recipientId}`;
}

export function addSubscriber(
  key: string,
  controller: ReadableStreamDefaultController
): void {
  const store = getSSEStore();
  if (!store.has(key)) {
    store.set(key, new Set());
  }
  store.get(key)!.add(controller);
}

export function removeSubscriber(
  key: string,
  controller: ReadableStreamDefaultController
): void {
  const store = getSSEStore();
  store.get(key)?.delete(controller);
  if (store.get(key)?.size === 0) {
    store.delete(key);
  }
}

export function publishToSubscribers(key: string, data: string): void {
  const store = getSSEStore();
  const subs = store.get(key);
  if (!subs) return;
  const message = `data: ${data}\n\n`;
  const encoder = new TextEncoder();
  for (const controller of subs) {
    try {
      controller.enqueue(encoder.encode(message));
    } catch {
      subs.delete(controller);
    }
  }
}
