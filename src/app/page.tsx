'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { Header } from '@/components/dashboard/header';
import { LocationCard } from '@/components/dashboard/location-card';
import { ActionsBar } from '@/components/dashboard/actions-bar';
import { SosModal } from '@/components/dashboard/sos-modal';
import { SuggestionsModal } from '@/components/dashboard/suggestions-modal';
import { TranslationModal } from '@/components/dashboard/translation-modal';
import { ChatModal } from '@/components/dashboard/chat-modal';
import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';
import type { Position } from '@/types';
import { UserIDCard } from '@/components/dashboard/user-id-card';

const DashboardLoadingSkeleton: FC = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
    <div className="flex w-full max-w-2xl flex-col items-center gap-8">
      <Logo />
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-full" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { user, isLoading, logout } = useUser();
  const [isSosOpen, setSosOpen] = useState(false);
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isTranslationOpen, setTranslationOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  if (isLoading || !user) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <Header user={user} onLogout={logout} />
        <main className="flex-grow">
          <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
            <UserIDCard user={user} />
            <LocationCard onPositionChange={setPosition} />
          </div>
        </main>
        <ActionsBar
          onSos={() => setSosOpen(true)}
          onSuggestions={() => setSuggestionsOpen(true)}
          onTranslate={() => setTranslationOpen(true)}
          onChat={() => setChatOpen(true)}
        />
        {/* Modals */}
        <SosModal
          isOpen={isSosOpen}
          onOpenChange={setSosOpen}
          position={position}
        />
        <SuggestionsModal
          isOpen={isSuggestionsOpen}
          onOpenChange={setSuggestionsOpen}
          position={position}
        />
        <TranslationModal
          isOpen={isTranslationOpen}
          onOpenChange={setTranslationOpen}
        />
        <ChatModal 
          isOpen={isChatOpen} 
          onOpenChange={setChatOpen} 
          user={user}
        />
      </div>
    </>
  );
}
