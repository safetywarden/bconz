import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";

export function ResourceCard({ title, description, icon }: { title: string; description: string; icon: IconName }) {
  return (
    <Card className="p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 text-slate-950">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <p className="mt-6 text-lg font-semibold text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <Button variant="secondary" size="normal" as="a" href="/contact" className="mt-6">
        Request this resource
      </Button>
    </Card>
  );
}
