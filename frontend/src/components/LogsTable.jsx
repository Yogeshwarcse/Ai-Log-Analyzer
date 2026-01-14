import { formatDistanceToNow } from 'date-fns';
import SeverityBadge from './SeverityBadge.jsx';

const severityOrder = ['Low', 'Medium', 'High', 'Critical'];

export default function LogsTable({ logs = [], onSelect, activeId, enforceSeveritySort = false }) {
  if (!logs.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
        No logs yet. Upload one to get started.
      </div>
    );
  }

  const tableData = enforceSeveritySort
    ? [...logs].sort((a, b) => {
        const aRank = severityOrder.indexOf(a.severity) ?? 0;
        const bRank = severityOrder.indexOf(b.severity) ?? 0;
        return bRank - aRank;
      })
    : logs;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/70 text-left text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-3">Filename</th>
            <th className="px-4 py-3">Uploaded</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Hash</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900">
          {tableData.map((log) => (
            <tr
              key={log.id}
              className={`cursor-pointer transition hover:bg-slate-900/60 ${
                log.id === activeId ? 'bg-slate-900/80' : ''
              }`}
              onClick={() => onSelect(log)}
            >
              <td className="px-4 py-3 font-medium text-slate-100">{log.filename}</td>
              <td className="px-4 py-3 text-slate-400">
                {formatDistanceToNow(new Date(log.uploaded_at), { addSuffix: true })}
              </td>
              <td className="px-4 py-3 text-slate-400">{(log.file_size / 1024).toFixed(1)} KB</td>
              <td className="px-4 py-3 text-xs text-slate-500">{log.file_hash.slice(0, 10)}...</td>
              <td className="px-4 py-3">
                <SeverityBadge value={log.severity} />
              </td>
              <td className="px-4 py-3 text-slate-300">{log.is_cached ? 'Cached' : 'Fresh'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

