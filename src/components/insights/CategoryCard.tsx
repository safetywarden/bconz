import { Card } from "@/components/ui/card";

export function CategoryCard({ title }: { title: string }) {
  return (
    <Card className="p-6">
      <p className="text-base font-semibold text-slate-950">{title}</p>
    </Card>
  );
}
