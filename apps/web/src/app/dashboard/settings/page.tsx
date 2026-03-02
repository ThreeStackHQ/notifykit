import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your workspace settings</p>
      </div>
      <div className="bg-gray-900 rounded-xl border border-gray-800 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
          <Settings className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-gray-400 font-medium">Coming soon</p>
        <p className="text-gray-600 text-sm mt-1">Workspace settings will be available here</p>
      </div>
    </div>
  );
}
