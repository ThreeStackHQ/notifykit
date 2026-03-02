// Global SSE subscriber store
// Map<recipientId, Set<ReadableStreamDefaultController>>
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

export function addSubscriber(
  recipientId: string,
  controller: ReadableStreamDefaultController
): void {
  const store = getSSEStore();
  if (!store.has(recipientId)) {
    store.set(recipientId, new Set());
  }
  store.get(recipientId)!.add(controller);
}

export function removeSubscriber(
  recipientId: string,
  controller: ReadableStreamDefaultController
): void {
  const store = getSSEStore();
  store.get(recipientId)?.delete(controller);
  if (store.get(recipientId)?.size === 0) {
    store.delete(recipientId);
  }
}

export function publishToSubscribers(recipientId: string, data: string): void {
  const store = getSSEStore();
  const subs = store.get(recipientId);
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
