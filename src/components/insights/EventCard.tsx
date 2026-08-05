import { Card } from "@/components/ui/card";

export function EventCard({ title, date, description, type }: { title: string; date: string; description: string; type: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
        <span className="font-semibold text-slate-950">{type}</span>
        <span>{date}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </Card>
  );
}
