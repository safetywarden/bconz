import Image from "next/image";

/**
 * Watermarked preview images, shown after an imaging data request. Approved by the data owner for this page:
 * preview size, no header data, no partner name. Files are served as supplied (unoptimized: never re-encoded).
 */
const groups = [
  {
    title: "Portable chest X-ray",
    text: "Bedside AP and semi-erect chest radiographs",
    images: [
      { src: "chest-1.png", width: 1024, height: 853 },
      { src: "chest-2.png", width: 1024, height: 853 },
      { src: "chest-3.png", width: 1024, height: 853 },
    ],
  },
  {
    title: "Extremity X-ray",
    text: "Limb and joint radiographs acquired at the bedside",
    images: [
      { src: "extremity-1.png", width: 1024, height: 853 },
      { src: "extremity-2.png", width: 853, height: 1024 },
    ],
  },
  {
    title: "Vascular duplex ultrasound",
    text: "Colour Doppler and B-mode vessel imaging",
    images: [
      { src: "vascular-1.png", width: 1024, height: 593 },
      { src: "vascular-2.png", width: 1024, height: 593 },
    ],
  },
];

export function ImagingPreviews() {
  return (
    <section aria-labelledby="imaging-previews-heading" className="mt-10 border-t border-slate-200 pt-8">
      <h2 id="imaging-previews-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
        What the imaging data looks like
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Watermarked preview images from the US post-acute imaging dataset, grouped by study type.
      </p>
      <div className="mt-6 space-y-8">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="text-base font-semibold text-slate-950">{g.title}</h3>
            <p className="text-sm leading-6 text-slate-600">{g.text}</p>
            <div className="mt-3 flex flex-wrap items-start gap-3">
              {g.images.map((img) => (
                <Image
                  key={img.src}
                  src={`/previews/imaging/${img.src}`}
                  width={img.width}
                  height={img.height}
                  unoptimized
                  draggable={false}
                  alt={`${g.title}, watermarked preview`}
                  className="h-44 w-auto rounded-lg border border-slate-200 bg-black sm:h-52"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm italic leading-6 text-slate-600">
        Watermarked preview. Full data supplied by the data owner under NDA.
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        If the data fits your project, we can arrange an evaluation sample under NDA.
      </p>
    </section>
  );
}
