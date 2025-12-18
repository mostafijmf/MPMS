"use client";
import ErrorPage from "@/components/error-page";

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <ErrorPage error={error?.message} />
    </div>
  );
}
