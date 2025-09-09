import {
  Card,
} from '@/components/ui/card';
import { Suspense } from 'react';
import VerifyPageClient from './page-client';

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense
        fallback={
          <Card className="flex h-96 w-full max-w-md items-center justify-center shadow-lg">
            <p>Loading...</p>
          </Card>
        }
      >
        <VerifyPageClient />
      </Suspense>
    </div>
  );
}
