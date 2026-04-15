"use client";

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useUserStore } from '@/stores/useUserStore';

export default function AuthListener({ children } : { children: React.ReactNode}) {

    const userStore = useUserStore();
  useEffect(() => {
    
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        let role = 'user';
        let username = '';
        try {doc
            const userDoc = getDoc(doc(db, 'users', user.uid))
          
          if (userDoc) {
            role = (await userDoc)?.data()?.role;
            username = (await userDoc)?.data()?.username
          }

        } catch (e) {
          console.log("AuthListener Error:", e);
        }

        userStore.setUser({uid: user.uid, username: username, email: user.email || '', role: role as 'user' | 'admin'});
      } else {
        userStore.removeUser();
      }
    });
  }, [userStore]);

  return <>{children}</>;
}