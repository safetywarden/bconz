type AnnouncementBarProps = {
  visible?: boolean;
  message?: string;
};

export function AnnouncementBar({
  visible = false,
  message = "BCONZ enterprise data services are launching soon.",
}: AnnouncementBarProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-3 text-sm font-medium leading-6 lg:px-8">
        {message}
      </div>
    </div>
  );
}
