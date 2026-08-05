export function TrustStrip() {
  const items = [
    "Longitudinal clinical data",
    "Multi-modal research cohorts",
    "Responsible governance",
    "Diverse patient populations",
    "Institution-led partnerships",
  ];

  return (
    <section className="bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:px-8 lg:px-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
