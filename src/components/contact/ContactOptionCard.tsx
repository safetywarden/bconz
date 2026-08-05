import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export function ContactOptionCard({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  large = false,
}: {
  title: string;
  description: string;
  icon: IconName;
  actionLabel?: string;
  actionHref?: string;
  large?: boolean;
}) {
  return (
    <Card className={large ? "p-8" : "p-6"}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 text-slate-900">
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-950">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          {actionHref ? (
            <div className="mt-3">
              <Button as="a" href={actionHref} variant="primary" size="normal">
                {actionLabel ?? "Contact"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
