import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  isSubmitting: boolean;
  children?: React.ReactNode;
  loadingText?: string;
};

export function SubmitButton({
  isSubmitting,
  children = "Submit",
  loadingText = "Submitting...",
}: SubmitButtonProps) {
  return (
    <Button variant="primary" size="large" type="submit" disabled={isSubmitting}>
      {isSubmitting ? loadingText : children}
    </Button>
  );
}
