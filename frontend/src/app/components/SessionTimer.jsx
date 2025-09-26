'use client';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SessionTimer() {
  const { data: session } = useSession();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!session?.expires) return;

    const expiry = new Date(session.expires).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = expiry - now;
      setTimeLeft(diff);

      if (diff <= 0) {
        toast.error('Session expired!');
        signOut({ callbackUrl: '/login' });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (timeLeft === null) return null;

  return (
    <div className="fixed bottom-2 right-2 text-xs text-gray-500">
      Session expires in {Math.ceil(timeLeft / 1000)}s
    </div>
  );
}
