export const LoadingSpinnerPage = ({})=>  {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative size-12">
        <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}


export function LoadingSpinnerButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "size-4 border-2",
    md: "size-5 border-2",
    lg: "size-8 border-[3px]"
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-current border-t-transparent animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
