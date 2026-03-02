const CSS = `
.nk-bell{position:fixed;width:48px;height:48px;border-radius:50%;background:#0d9488;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:99999;transition:background .2s}
.nk-bell:hover{background:#0f766e}
.nk-bell svg{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.nk-badge{position:absolute;top:4px;right:4px;min-width:18px;height:18px;border-radius:9px;background:#ef4444;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px;font-family:sans-serif;line-height:1}
.nk-badge.nk-hidden{display:none}
.nk-panel{position:fixed;width:340px;max-height:480px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:99998;display:flex;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;transition:opacity .15s,transform .15s}
.nk-panel.nk-hidden{opacity:0;pointer-events:none;transform:translateY(8px)}
.nk-panel-header{padding:16px 20px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between}
.nk-panel-title{font-size:15px;font-weight:600;color:#111;margin:0}
.nk-panel-close{background:none;border:none;cursor:pointer;color:#888;font-size:18px;padding:0;line-height:1}
.nk-list{overflow-y:auto;flex:1}
.nk-item{padding:12px 20px;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background .1s}
.nk-item:hover{background:#f9f9f9}
.nk-item.nk-unread{background:#f0fdf4}
.nk-item-title{font-size:13px;font-weight:600;color:#111;margin:0 0 4px}
.nk-item-body{font-size:12px;color:#555;margin:0;line-height:1.4}
.nk-item-meta{font-size:11px;color:#aaa;margin:4px 0 0;display:flex;align-items:center;gap:6px}
.nk-badge-cat{font-size:10px;padding:1px 6px;border-radius:10px;background:#e0f2fe;color:#0284c7;font-weight:500}
.nk-empty{padding:32px 20px;text-align:center;color:#aaa;font-size:13px}
.nk-br{position:fixed;bottom:24px}
.nk-br.nk-right{right:24px}
.nk-br.nk-left{left:24px}
.nk-panel.nk-right{right:24px;bottom:84px}
.nk-panel.nk-left{left:24px;bottom:84px}
`;

interface NotifyKitOptions {
  apiUrl?: string;
  recipientId: string;
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  category: string;
  actionUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

function init(opts: NotifyKitOptions): void {
  const { recipientId, apiKey, position = 'bottom-right' } = opts;
  const baseUrl = opts.apiUrl || '';

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // Bell button
  const wrap = document.createElement('div');
  wrap.className = `nk-br nk-${position === 'bottom-left' ? 'left' : 'right'}`;

  const bell = document.createElement('button');
  bell.className = 'nk-bell';
  bell.setAttribute('aria-label', 'Notifications');
  bell.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`;

  const badge = document.createElement('span');
  badge.className = 'nk-badge nk-hidden';
  bell.appendChild(badge);
  wrap.appendChild(bell);
  document.body.appendChild(wrap);

  // Panel
  const panel = document.createElement('div');
  const side = position === 'bottom-left' ? 'nk-left' : 'nk-right';
  panel.className = `nk-panel nk-hidden ${side}`;
  panel.innerHTML = `<div class="nk-panel-header"><p class="nk-panel-title">Notifications</p><button class="nk-panel-close" aria-label="Close">&#x2715;</button></div><div class="nk-list"></div>`;
  document.body.appendChild(panel);

  const list = panel.querySelector('.nk-list') as HTMLElement;
  let open = false;
  const notifications: Notification[] = [];

  function updateBadge(): void {
    const unread = notifications.filter((n) => !n.isRead).length;
    if (unread > 0) {
      badge.textContent = unread > 99 ? '99+' : String(unread);
      badge.classList.remove('nk-hidden');
    } else {
      badge.classList.add('nk-hidden');
    }
  }

  function renderNotif(n: Notification): HTMLElement {
    const item = document.createElement('div');
    item.className = `nk-item${n.isRead ? '' : ' nk-unread'}`;
    item.dataset.id = n.id;
    item.innerHTML = `<p class="nk-item-title">${escapeHtml(n.title)}</p><p class="nk-item-body">${escapeHtml(n.body)}</p><p class="nk-item-meta"><span class="nk-badge-cat">${escapeHtml(n.category)}</span>${timeAgo(new Date(n.createdAt))}</p>`;
    if (n.actionUrl && /^https?:\/\//i.test(n.actionUrl)) {
      // Only allow http/https URLs — reject javascript: and data: schemes
      item.addEventListener('click', () => {
        window.open(n.actionUrl!, '_blank', 'noopener,noreferrer');
      });
    }
    return item;
  }

  function renderAll(): void {
    list.innerHTML = '';
    if (notifications.length === 0) {
      list.innerHTML = '<div class="nk-empty">No notifications yet</div>';
      return;
    }
    notifications.forEach((n) => list.appendChild(renderNotif(n)));
  }

  async function markRead(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${baseUrl}/api/v1/notifications/${id}/read?api_key=${encodeURIComponent(apiKey)}`, {
            method: 'PATCH',
          })
        )
      );
    } catch {
      // silent
    }
    ids.forEach((id) => {
      const n = notifications.find((x) => x.id === id);
      if (n) {
        n.isRead = true;
        const el = list.querySelector(`[data-id="${id}"]`);
        if (el) el.classList.remove('nk-unread');
      }
    });
    updateBadge();
  }

  function togglePanel(): void {
    open = !open;
    panel.classList.toggle('nk-hidden', !open);
    if (open) {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
      markRead(unreadIds);
    }
  }

  bell.addEventListener('click', togglePanel);
  panel.querySelector('.nk-panel-close')?.addEventListener('click', togglePanel);

  // Fetch initial notifications
  fetch(`${baseUrl}/api/v1/notifications?recipient_id=${encodeURIComponent(recipientId)}&api_key=${encodeURIComponent(apiKey)}`)
    .then((r) => r.json())
    .then((data: Notification[]) => {
      notifications.splice(0, notifications.length, ...data);
      renderAll();
      updateBadge();
    })
    .catch(() => {});

  // SSE stream
  let es: EventSource | null = null;
  function connectSSE(): void {
    if (es) es.close();
    es = new EventSource(
      `${baseUrl}/api/v1/stream?recipient_id=${encodeURIComponent(recipientId)}&api_key=${encodeURIComponent(apiKey)}`
    );
    es.onmessage = (evt) => {
      try {
        const n: Notification = JSON.parse(evt.data);
        notifications.unshift(n);
        list.insertBefore(renderNotif(n), list.firstChild);
        const empty = list.querySelector('.nk-empty');
        if (empty) empty.remove();
        updateBadge();
      } catch {
        // ignore ping
      }
    };
    es.onerror = () => {
      setTimeout(connectSSE, 5000);
    };
  }
  connectSSE();
}

(window as unknown as Record<string, unknown>)['NotifyKit'] = { init };
