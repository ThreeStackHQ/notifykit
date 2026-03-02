'use client';

import { useState, useEffect, useCallback } from 'react';
import { Key, Plus, Trash2, Copy, CheckCheck, AlertTriangle, X } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  keyDisplay: string;
  rateLimitPerHour: number;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}

interface CreatedKey {
  key: string;
  name: string;
  prefix: string;
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

function formatRateLimit(limit: number): string {
  if (limit >= 999999) return 'Unlimited';
  return `${limit.toLocaleString()}/hr`;
}

interface CreateKeyModalProps {
  onClose: () => void;
  onCreated: (key: CreatedKey) => void;
}

function CreateKeyModal({ onClose, onCreated }: CreateKeyModalProps) {
  const [name, setName] = useState('');
  const [rateLimit, setRateLimit] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rateLimitPerHour: parseInt(rateLimit, 10) }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Failed to create API key');
        return;
      }
      const data = (await res.json()) as CreatedKey;
      onCreated(data);
    } catch {
      setError('Failed to create API key');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Create API Key</h2>
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
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Key Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Production, Staging"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Rate Limit</label>
            <select
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="1000">1,000 / hour</option>
              <option value="5000">5,000 / hour</option>
              <option value="999999">Unlimited</option>
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
              <Plus className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface OneTimeKeyDisplayProps {
  createdKey: CreatedKey;
  onClose: () => void;
}

function OneTimeKeyDisplay({ createdKey, onClose }: OneTimeKeyDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function copyKey() {
    await navigator.clipboard.writeText(createdKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">
            API Key Created — <span className="text-teal-400">{createdKey.name}</span>
          </h2>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 mb-5 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 font-semibold text-sm">Copy this key now</p>
            <p className="text-yellow-400/80 text-xs mt-1">
              This is the only time you will see the full key. We cannot show it again.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 mb-5 flex items-center gap-3">
          <code className="text-teal-300 font-mono text-sm flex-1 break-all">{createdKey.key}</code>
          <button
            onClick={() => void copyKey()}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
        >
          I have saved my key — Close
        </button>
      </div>
    </div>
  );
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdKey, setCreatedKey] = useState<CreatedKey | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/keys');
      if (res.ok) {
        const data = (await res.json()) as ApiKey[];
        setKeys(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchKeys();
  }, [fetchKeys]);

  async function handleRevoke(id: string) {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }
    setRevoking(id);
    try {
      await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } finally {
      setRevoking(null);
    }
  }

  function handleKeyCreated(key: CreatedKey) {
    setCreatedKey(key);
    setShowCreateModal(false);
    void fetchKeys();
  }

  const activeKeys = keys.filter((k) => k.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your API keys for sending notifications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Key
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Total Keys</p>
          <p className="text-2xl font-bold text-white">{keys.length}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Active Keys</p>
          <p className="text-2xl font-bold text-teal-400">{activeKeys.length}</p>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No API keys yet</p>
            <p className="text-gray-600 text-sm mt-1">
              Create your first key to start sending notifications
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create API Key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Rate Limit
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Last Used
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {keys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <code className="text-teal-300 font-mono text-sm">
                        nk_live_{key.keyPrefix}...
                      </code>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-white">{key.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-300">
                        {formatRateLimit(key.rateLimitPerHour)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.isActive
                            ? 'bg-green-900/40 text-green-300'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {key.isActive ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400">
                        {key.lastUsedAt ? timeAgo(key.lastUsedAt) : 'Never'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400">{timeAgo(key.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      {key.isActive && (
                        <button
                          onClick={() => void handleRevoke(key.id)}
                          disabled={revoking === key.id}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-sm transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {revoking === key.id ? 'Revoking...' : 'Revoke'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Usage hint */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <p className="text-sm font-medium text-gray-300 mb-3">Quick start</p>
        <pre className="text-xs text-teal-300 overflow-x-auto leading-relaxed">
          {`curl -X POST https://notifykit.threestack.io/api/v1/notify \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"recipient_id":"user_123","title":"Hello!","body":"Your export is ready."}'`}
        </pre>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleKeyCreated}
        />
      )}
      {createdKey && (
        <OneTimeKeyDisplay
          createdKey={createdKey}
          onClose={() => setCreatedKey(null)}
        />
      )}
    </div>
  );
}
