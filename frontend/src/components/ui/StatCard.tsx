interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  colorClass?: string;
}

export function StatCard({ title, value, icon: Icon, description, colorClass = "text-amber-500" }: StatCardProps) {
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 flex items-start gap-4">
      <div className={`p-3 rounded-lg bg-neutral-900 ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {description && (
          <p className="text-xs text-neutral-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
