import { format } from 'date-fns';

export default function MetaPanel({ log }) {
  if (!log) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-400">
        Upload a file to see its metadata.
      </div>
    );
  }

  const rows = [
    { label: 'Filename', value: log.filename },
    { label: 'Size', value: `${(log.file_size / 1024).toFixed(1)} KB` },
    { label: 'Uploaded', value: format(new Date(log.uploaded_at), 'PPpp') },
    { label: 'SHA-256', value: log.file_hash },
    { label: 'Fingerprint', value: log.fingerprint_hash },
    { label: 'Status', value: log.is_cached ? 'Cached result' : 'Fresh analysis' },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-200">
      <h4 className="mb-4 text-base font-semibold text-slate-100">File metadata</h4>
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs uppercase tracking-wide text-slate-500">{row.label}</dt>
            <dd className="mt-1 break-all text-slate-100">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

