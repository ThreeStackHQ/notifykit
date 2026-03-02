import { NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/api-key';
import { checkRateLimit } from '@/lib/rate-limiter';
import { handleOptions, CORS_HEADERS } from '@/lib/cors';
import { addSubscriber, removeSubscriber, sseKey } from '@/lib/sse-store';

export { handleOptions as OPTIONS };
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get('recipient_id');
  const rawKey = searchParams.get('api_key');

  if (!rawKey) {
    return NextResponse.json({ error: 'Missing api_key' }, { status: 401 });
  }
  if (!recipientId) {
    return NextResponse.json({ error: 'Missing recipient_id' }, { status: 400 });
  }

  const keyData = await verifyApiKey(rawKey);
  if (!keyData) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  // Rate-limit new SSE connection attempts (max 120/hour per API key)
  if (!checkRateLimit(`stream:${keyData.keyId}`, 120)) {
    return NextResponse.json({ error: 'Too many stream connections. Try again later.' }, { status: 429 });
  }

  // Scope SSE subscriptions by workspace+recipient to prevent cross-workspace leakage
  const subKey = sseKey(keyData.workspaceId, recipientId);

  const encoder = new TextEncoder();
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  let controller: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      addSubscriber(subKey, ctrl);

      // Send initial connection message
      ctrl.enqueue(encoder.encode(': connected\n\n'));

      // Heartbeat every 30 seconds
      heartbeatInterval = setInterval(() => {
        try {
          ctrl.enqueue(encoder.encode(':ping\n\n'));
        } catch {
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
          }
        }
      }, 30000);
    },
    cancel() {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      if (controller) {
        removeSubscriber(subKey, controller);
      }
    },
  });

  // Handle abort
  req.signal.addEventListener('abort', () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    if (controller) {
      removeSubscriber(subKey, controller);
      try {
        controller.close();
      } catch {
        // already closed
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      ...CORS_HEADERS,
    },
  });
}
