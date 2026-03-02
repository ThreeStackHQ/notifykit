'use client';

import { useState, useMemo } from 'react';
import { Bell, Send, Search, Filter, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export interface NotificationRow {
  id: string;
  workspaceId: string;
  recipientId: string;
  title: string;
  body: string;
  category: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationFeedProps {
  notifications: NotificationRow[];
}

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const CATEGORY_COLORS: Record<string, string> = {
  info: 'bg-blue-900/40 text-blue-300',
  success: 'bg-green-900/40 text-green-300',
  warning: 'bg-yellow-900/40 text-yellow-300',
  error: 'bg-red-900/40 text-red-300',
};

function getCategoryBadge(category: string) {
  return CATEGORY_COLORS[category] ?? 'bg-gray-800 text-gray-300';
}

interface SendTestModalProps {
  onClose: () => void;
  onSent: (notification: NotificationRow) => void;
}

function SendTestModal({ onClose, onSent }: SendTestModalProps) {
  const [form, setForm] = useState({
    recipient_id: 'test_user',
    title: 'Test Notification',
    body: 'This is a test notification from NotifyKit dashboard.',
    category: 'info',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard/test-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Failed to send notification');
        return;
      }
      const notification = (await res.json()) as NotificationRow;
      onSent(notification);
      onClose();
    } catch {
      setError('Failed to send notification');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Send Test Notification</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Recipient ID
            </label>
            <input
              type="text"
              value={form.recipient_id}
              onChange={(e) => setForm({ ...form, recipient_id: e.target.value })}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NotificationFeed({ notifications: initialNotifications }: NotificationFeedProps) {
  const [notifications, setNotifications] =
    useState<NotificationRow[]>(initialNotifications);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTestModal, setShowTestModal] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(notifications.map((n) => n.category));
    return ['all', ...Array.from(cats)];
  }, [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
      if (statusFilter === 'read' && !n.isRead) return false;
      if (statusFilter === 'unread' && n.isRead) return false;
      return true;
    });
  }, [notifications, search, categoryFilter, statusFilter]);

  // Stats
  const total = notifications.length;
  const readCount = notifications.filter((n) => n.isRead).length;
  const readRate = total > 0 ? Math.round((readCount / total) * 100) : 0;
  const uniqueRecipients = new Set(notifications.map((n) => n.recipientId)).size;
  const unreadCount = total - readCount;

  function handleTestSent(notification: NotificationRow) {
    setNotifications((prev) => [notification, ...prev]);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor your notification activity</p>
        </div>
        <button
          onClick={() => setShowTestModal(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Send className="w-4 h-4" />
          Send Test
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Sent',
            value: total.toLocaleString(),
            icon: Bell,
            color: 'text-teal-400',
            bg: 'bg-teal-900/20',
          },
          {
            label: 'Read Rate',
            value: `${readRate}%`,
            icon: CheckCircle,
            color: 'text-green-400',
            bg: 'bg-green-900/20',
          },
          {
            label: 'Active Recipients',
            value: uniqueRecipients.toLocaleString(),
            icon: Filter,
            color: 'text-blue-400',
            bg: 'bg-blue-900/20',
          },
          {
            label: 'Unread',
            value: unreadCount.toLocaleString(),
            icon: AlertCircle,
            color: 'text-yellow-400',
            bg: 'bg-yellow-900/20',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
        >
          <option value="all">All Status</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
      </div>

      {/* Notifications Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No notifications found</p>
            <p className="text-gray-600 text-sm mt-1">
              {total === 0
                ? 'Send your first notification using the Send Test button'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Sent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{n.body}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(n.category)}`}
                      >
                        {n.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {n.isRead ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/40 text-green-300">
                          <CheckCircle className="w-3 h-3" />
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300">
                          <Clock className="w-3 h-3" />
                          Unread
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400 font-mono">{n.recipientId}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400">{timeAgo(n.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <SendTestModal
          onClose={() => setShowTestModal(false)}
          onSent={handleTestSent}
        />
      )}
    </div>
  );
}
