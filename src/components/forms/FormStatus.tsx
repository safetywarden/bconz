export type FormStatusState = "idle" | "submitting" | "success" | "error";

type FormStatusProps = {
  id?: string;
  status: FormStatusState;
  successTitle?: string;
  successMessage?: string;
  errorMessage?: string;
};

export function FormStatus({
  id,
  status,
  successTitle,
  successMessage,
  errorMessage,
}: FormStatusProps) {
  if (status === "idle") {
    return null;
  }

  if (status === "submitting") {
    return (
      <p id={id} role="status" aria-live="polite" className="text-sm text-slate-600">
        Submitting...
      </p>
    );
  }

  if (status === "success") {
    return (
      <div id={id} role="status" aria-live="polite" className="space-y-2">
        {successTitle ? <h3 className="text-xl font-semibold text-slate-950">{successTitle}</h3> : null}
        {successMessage ? <p className="text-sm text-slate-700">{successMessage}</p> : null}
      </div>
    );
  }

  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700"
    >
      {errorMessage ?? "Unable to submit your enquiry. Please try again."}
    </div>
  );
}
