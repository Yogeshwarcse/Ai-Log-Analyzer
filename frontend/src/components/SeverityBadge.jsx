import clsx from 'clsx';

const severityMap = {
  Low: 'bg-emerald-600/20 text-emerald-300',
  Medium: 'bg-amber-500/20 text-amber-300',
  High: 'bg-orange-600/20 text-orange-200',
  Critical: 'bg-rose-600/20 text-rose-200',
};

export default function SeverityBadge({ value = 'Medium' }) {
  const style = severityMap[value] || severityMap.Medium;
  return (
    <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider', style)}>
      {value}
    </span>
  );
}

