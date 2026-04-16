"use client";

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useUserStore } from '@/stores/useUserStore';

export default function AuthListener({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const removeUser = useUserStore((state) => state.removeUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let role: 'user' | 'admin' = 'user';
        let username = '';

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists()) {
            const data = userDoc.data();
            role = (data?.role as 'user' | 'admin') ?? 'user';
            username = data?.username ?? '';
          }
        } catch (e) {
          console.log("AuthListener Error:", e);
        }

        setUser({
          uid: user.uid,
          username: username,
          email: user.email || '',
          role,
        });
      } else {
        removeUser();
      }
    });

    return () => unsubscribe();
  }, [setUser, removeUser]);

  return <>{children}</>;
}