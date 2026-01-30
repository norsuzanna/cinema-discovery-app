import { WifiOff } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Offline - Cinema Discovery',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <WifiOff className="h-24 w-24 text-muted-foreground" />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">You&apos;re Offline</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          It looks like you&apos;ve lost your internet connection.
        </p>
        <p className="mt-2 text-muted-foreground">
          Don&apos;t worry, you can still browse cached movies!
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go to Home
      </Link>
    </div>
  );
}