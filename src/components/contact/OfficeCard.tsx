import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export function OfficeCard({ title, lines, phone, email, actionHref }: { title: string; lines: string[]; phone?: string; email?: string; actionHref?: string }) {
  return (
    <Card className="p-8">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <address className="mt-3 not-italic text-sm leading-6 text-slate-700">
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </address>
      <div className="mt-4 text-sm text-slate-700">
        {phone ? (
          <div>
            <span className="font-medium text-slate-900">Phone: </span>
            <a href={`tel:${phone}`} className="text-teal-600">
              {phone}
            </a>
          </div>
        ) : null}
        {email ? (
          <div className="mt-2">
            <span className="font-medium text-slate-900">Email: </span>
            <span className="text-slate-700">Hidden; use contact button</span>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="h-40 w-full rounded-md bg-slate-100/60 flex items-center justify-center text-sm text-slate-500">
          Map integration reserved for future
        </div>
        {actionHref ? (
          <div className="ml-4">
            <Button as="a" href={actionHref} variant="secondary" size="normal">
              Contact BCONZ
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
