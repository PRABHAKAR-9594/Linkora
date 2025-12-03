import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  useEffect(() => {
    toast.error("Something went wrong!");
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center h-screen p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Oops! Something broke 🚨</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try Again</Button>
    </div>
  );
};

export default ErrorFallback;
