


import { AlertCircle, Home, RefreshCw, Phone } from 'lucide-react';

export const ErrorPage = ({}) => {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    console.log('Navigate to home');
  };

  return (
    <div className="size-full flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-destructive/10 rounded-full p-4">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>

            <div className="space-y-2">
              <h1 className="text-foreground">Booking Error</h1>
              <p className="text-muted-foreground">
                We couldn't complete your booking at this time. This might be due to a temporary issue or the selected time slot may no longer be available.
              </p>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleRetry}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={handleGoHome}
                className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Home className="w-5 h-5" />
                Return to Home
              </button>
            </div>

            <div className="pt-4 border-t border-border w-full">
              <p className="text-sm text-muted-foreground mb-3">
                Need help? Contact our support team
              </p>
              <a
                href="tel:1-800-123-4567"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                1-800-123-4567
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Error Code: BK-2024-E001
          </p>
        </div>
      </div>
    </div>
  );
}