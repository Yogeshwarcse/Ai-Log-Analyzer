import { useState } from 'react';
import { Shield, Zap, AlertTriangle, Upload, Search, Filter, FileText, Clock, Hash } from 'lucide-react';

function App() {
  const [selectedLog, setSelectedLog] = useState(mockLogs[0]);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [sortBySeverity, setSortBySeverity] = useState(true);

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = !search || log.filename.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = !severity || log.severity === severity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10 text-slate-50">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <header className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-semibold">
              Grootan Technologies
            </p>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-50 via-blue-100 to-slate-50 bg-clip-text text-transparent">
            AI-Powered Log Analyzer
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400 leading-relaxed">
            Upload logs, automatically redact confidential data, and receive structured AI insights with smart caching powered by SHA-256 deduplication.
          </p>
        </header>

        <main className="mx-auto mt-12 max-w-7xl space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard 
              label="Total Uploads" 
              value={mockLogs.length} 
              icon={<Shield className="w-5 h-5" />}
              gradient="from-blue-500/20 to-cyan-500/20"
              borderColor="border-blue-500/30"
              iconColor="text-blue-400"
            />
            <StatCard 
              label="Cache Hits" 
              value={mockLogs.filter(l => l.cached).length} 
              icon={<Zap className="w-5 h-5" />}
              gradient="from-purple-500/20 to-pink-500/20"
              borderColor="border-purple-500/30"
              iconColor="text-purple-400"
            />
            <StatCard 
              label="Critical Issues" 
              value={mockLogs.filter(l => l.severity === 'Critical').length} 
              icon={<AlertTriangle className="w-5 h-5" />}
              gradient="from-orange-500/20 to-red-500/20"
              borderColor="border-orange-500/30"
              iconColor="text-orange-400"
            />
          </div>

          {/* Upload & Meta */}
          <section className="grid gap-6 lg:grid-cols-2">
            <UploadZone />
            <MetaPanel log={selectedLog} />
          </section>

          {/* Preview & Results */}
          <section className="grid gap-6 lg:grid-cols-2">
            <LogPreview log={selectedLog} />
            <ResultCard log={selectedLog} />
          </section>

          {/* Logs Table */}
          <section className="space-y-6">
            <SearchFilters
              search={search}
              severity={severity}
              sortBySeverity={sortBySeverity}
              onSearchChange={setSearch}
              onSeverityChange={setSeverity}
              onToggleSort={() => setSortBySeverity(prev => !prev)}
            />
            <LogsTable logs={filteredLogs} onSelect={setSelectedLog} activeId={selectedLog.id} />
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient, borderColor, iconColor }) {
  return (
    <div className={`group relative rounded-2xl border ${borderColor} bg-gradient-to-br ${gradient} backdrop-blur-sm p-6 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{label}</p>
          <p className="mt-3 text-4xl font-bold text-slate-50">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-slate-950/50 ${iconColor} transition-transform group-hover:rotate-12`}>
          {icon}
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
}

function UploadZone() {
  return (
    <div className="group relative rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 backdrop-blur-sm p-8 transition-all hover:border-blue-500/50 hover:bg-slate-900/50">
      <div className="flex flex-col items-center text-center">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 transition-transform group-hover:scale-110">
          <Upload className="w-8 h-8 text-blue-400" />
        </div>
        <p className="mt-4 text-lg font-semibold text-slate-200">Drop log files here</p>
        <p className="mt-2 text-sm text-slate-500">or click to browse</p>
        <button className="mt-6 px-6 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors">
          Select File
        </button>
      </div>
    </div>
  );
}

function MetaPanel({ log }) {
  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Log Metadata</h3>
      <div className="space-y-3">
        <MetaRow icon={<FileText className="w-4 h-4" />} label="Filename" value={log.filename} />
        <MetaRow icon={<Hash className="w-4 h-4" />} label="SHA-256" value={log.hash.slice(0, 16) + '...'} />
        <MetaRow icon={<Clock className="w-4 h-4" />} label="Uploaded" value={log.timestamp} />
        <MetaRow icon={<Zap className="w-4 h-4" />} label="Status" value={log.cached ? 'Cached' : 'Processed'} cached={log.cached} />
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value, cached }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`mt-1 text-sm font-mono truncate ${cached ? 'text-purple-400' : 'text-slate-300'}`}>{value}</p>
      </div>
    </div>
  );
}

function LogPreview({ log }) {
  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Masked Log Preview</h3>
      <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-4 font-mono text-xs text-slate-400 max-h-64 overflow-auto">
        <pre className="whitespace-pre-wrap">{log.maskedContent}</pre>
      </div>
    </div>
  );
}

function ResultCard({ log }) {
  const severityColors = {
    Critical: 'text-red-400 bg-red-500/20 border-red-500/30',
    High: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    Medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    Low: 'text-blue-400 bg-blue-500/20 border-blue-500/30'
  };

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">AI Analysis</h3>
        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${severityColors[log.severity]}`}>
          {log.severity}
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Summary</p>
          <p className="text-sm text-slate-300 leading-relaxed">{log.summary}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Key Issues</p>
          <ul className="space-y-2">
            {log.issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-orange-400 mt-0.5">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SearchFilters({ search, severity, sortBySeverity, onSearchChange, onSeverityChange, onToggleSort }) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>
      <select
        value={severity}
        onChange={(e) => onSeverityChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800/50 text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors"
      >
        <option value="">All Severities</option>
        <option value="Critical">Critical</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button
        onClick={onToggleSort}
        className={`px-4 py-2 rounded-lg border transition-colors ${
          sortBySeverity
            ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
            : 'bg-slate-900/50 border-slate-800/50 text-slate-400'
        }`}
      >
        Sort by Severity
      </button>
    </div>
  );
}

function LogsTable({ logs, onSelect, activeId }) {
  const severityColors = {
    Critical: 'text-red-400',
    High: 'text-orange-400',
    Medium: 'text-yellow-400',
    Low: 'text-blue-400'
  };

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-950/50 border-b border-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Filename</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => onSelect(log)}
                className={`cursor-pointer transition-colors ${
                  activeId === log.id ? 'bg-blue-500/10' : 'hover:bg-slate-800/30'
                }`}
              >
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{log.filename}</td>
                <td className={`px-6 py-4 text-sm font-semibold ${severityColors[log.severity]}`}>
                  {log.severity}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{log.timestamp}</td>
                <td className="px-6 py-4">
                  {log.cached && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                      <Zap className="w-3 h-3" /> Cached
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const mockLogs = [
  {
    id: 1,
    filename: 'auth-service.log',
    hash: 'a3f5c2e8d4b9f7e1c6a8b3d9e5f2c7a4',
    timestamp: '2024-12-04 14:32:15',
    cached: false,
    severity: 'Critical',
    maskedContent: `[2024-12-04 14:32:10] ERROR: Authentication failed for user [REDACTED_EMAIL]
[2024-12-04 14:32:11] WARN: Multiple login attempts from IP [REDACTED_IP]
[2024-12-04 14:32:12] ERROR: Database connection timeout`,
    summary: 'Critical authentication service failure with database connectivity issues and suspicious login patterns.',
    issues: ['Multiple failed authentication attempts', 'Database connection timeouts', 'Potential brute force attack']
  },
  {
    id: 2,
    filename: 'api-gateway.log',
    hash: 'b7e9f3a2c8d5e1f6b4a7c3d8e2f5a9b1',
    timestamp: '2024-12-04 13:15:42',
    cached: true,
    severity: 'High',
    maskedContent: `[2024-12-04 13:15:40] INFO: Request from [REDACTED_IP]
[2024-12-04 13:15:41] WARN: Rate limit exceeded for API key [REDACTED_KEY]
[2024-12-04 13:15:42] ERROR: 503 Service Unavailable`,
    summary: 'API gateway experiencing rate limiting issues and service degradation.',
    issues: ['Rate limit violations', 'Service unavailability', 'High request volume']
  },
  {
    id: 3,
    filename: 'payment-processor.log',
    hash: 'c9d4e6f8a3b7c2d5e9f1a6b8c4d7e3f2',
    timestamp: '2024-12-04 12:05:18',
    cached: false,
    severity: 'Medium',
    maskedContent: `[2024-12-04 12:05:15] INFO: Processing payment for order [REDACTED_ORDER_ID]
[2024-12-04 12:05:16] INFO: Payment gateway response: success
[2024-12-04 12:05:17] WARN: Slow response time detected (2.3s)`,
    summary: 'Payment processing completed successfully but with performance concerns.',
    issues: ['Elevated response times', 'Performance degradation warning']
  }
];

export default App;