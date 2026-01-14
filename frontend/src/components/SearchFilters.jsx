import { SEVERITY_OPTIONS } from '../utils/constants.js';

export default function SearchFilters({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  sortBySeverity,
  onToggleSort,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search filename or issue..."
        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-primary focus:outline-none"
      />
      <select
        value={severity}
        onChange={(event) => onSeverityChange(event.target.value)}
        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-primary focus:outline-none"
      >
        <option value="">All severities</option>
        {SEVERITY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onToggleSort}
        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
          sortBySeverity
            ? 'bg-primary/90 text-white'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        {sortBySeverity ? 'Sorted by Severity' : 'Sort by Severity'}
      </button>
    </div>
  );
}

