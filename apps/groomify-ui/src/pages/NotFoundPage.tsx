import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/button";
export const NotFoundPage = ({}) => {

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[150px] leading-none font-bold text-gray-300 dark:text-gray-700">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="size-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Search className="size-12 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoHome}
            className="gap-2"
          >
            <Home className="size-4" />
            Go Home
          </Button>
          <Button
            onClick={handleGoBack}
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-600">
        Error Code: 404
      </div>
    </div>
  );
}