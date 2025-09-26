'use client';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AuthGuard({ children }) {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Session expired. Redirecting to login...');
      setTimeout(() => signIn(), 1500);
    }
  }, [status]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return null;

  return <>{children}</>;
}
