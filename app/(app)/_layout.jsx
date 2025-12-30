import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AppLayout() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}
