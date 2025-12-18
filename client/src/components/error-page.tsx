"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ErrorPage = ({ error }: { error: string }) => {
  const router = useRouter();
  return (
    <Card className="border shadow-lg max-w-xl mx-auto my-20">
      <CardContent className="sm:p-8 p-5">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
            <div className="relative h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="size-10 text-red-500" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="md:text-3xl text-2xl font-bold tracking-tight text-balance">Something went wrong</h1>
            <p className="text-muted-foreground text-pretty max-w-md mx-auto leading-relaxed">
              We encountered an unexpected error.
            </p>
          </div>

          <Card className="w-full bg-destructive/5 border-destructive">
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Error Details</p>
                <p className="text-sm font-mono text-destructive wrap-break-word">{error}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full sm:w-auto">
            <Button onClick={() => router.refresh()} className="gap-2 w-full sm:w-auto" size="lg">
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent" size="lg" asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorPage;
