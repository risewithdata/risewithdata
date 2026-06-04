type Props = {
  title: string;
  value: string;
  detail: string;
};

export function AccentCard({ title, value, detail }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-3 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
