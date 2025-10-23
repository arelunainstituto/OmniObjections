export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p className="text-lg text-muted-foreground">Carregando OmniObjections...</p>
      </div>
    </div>
  );
}

