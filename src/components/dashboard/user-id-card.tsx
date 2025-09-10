'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon } from 'lucide-react';
import type { User } from '@/types';

interface UserIDCardProps {
  user: User;
}

export function UserIDCard({ user }: UserIDCardProps) {
  const formattedId = user.id.replace(/(\d{4})(?=\d)/g, '$1 ');

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex-row items-center justify-center space-x-2 pb-4">
        <UserIcon className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-headline">Unique User ID</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[60px] items-center justify-center p-2">
        <div className="text-center">
          <p
            className="font-mono text-2xl font-bold tracking-widest text-foreground"
            aria-label={`Your unique ID is ${user.id
              .split('')
              .join(' ')}`}
          >
            {formattedId}
          </p>
          <p className="text-xs text-muted-foreground">
            This is your unique identifier.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
