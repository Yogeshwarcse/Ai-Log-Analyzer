import SeverityBadge from './SeverityBadge.jsx';

const fields = [
  { key: 'issue_type', label: 'Issue Type' },
  { key: 'root_cause', label: 'Root Cause' },
  { key: 'suggested_fix', label: 'Suggested Fix' },
];

export default function ResultCard({ log }) {
  if (!log) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
        Upload or select a log to see AI insights.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">AI Verdict</p>
          <h3 className="text-xl font-semibold text-slate-50">{log.filename}</h3>
        </div>
        <SeverityBadge value={log.severity || 'Medium'} />
      </div>

      <div className="space-y-4 text-sm text-slate-200">
        {fields.map((field) => (
          <div key={field.key}>
            <p className="text-xs uppercase tracking-wide text-slate-400">{field.label}</p>
            <p className="mt-1 leading-relaxed">{log[field.key]}</p>
          </div>
        ))}
      </div>

      {log.is_cached ? (
        <p className="mt-6 rounded-lg bg-emerald-600/10 px-4 py-2 text-xs text-emerald-300">
          Served from cache (fingerprint match).
        </p>
      ) : (
        <p className="mt-6 rounded-lg bg-primary/10 px-4 py-2 text-xs text-primary">
          Fresh OpenAI analysis.
        </p>
      )}
    </div>
  );
}

