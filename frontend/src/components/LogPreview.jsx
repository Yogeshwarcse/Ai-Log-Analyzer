import { FiEye } from 'react-icons/fi';

export default function LogPreview({ logText = '', title = 'Sanitized Log' }) {
  if (!logText) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-500">
        Upload a log to preview masked content.
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
        <FiEye className="text-primary" />
        <span>{title}</span>
      </div>
      <pre className="h-[260px] overflow-y-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
        {logText}
      </pre>
    </div>
  );
}

