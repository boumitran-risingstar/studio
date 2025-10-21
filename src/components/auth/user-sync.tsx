"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { createUserInExternalApi } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

export function UserSync() {
  const { user } = useUser();
  const { toast } = useToast();
  const [syncedUids, setSyncedUids] = useState<string[]>([]);

  useEffect(() => {
    const syncUser = async () => {
      if (user && !syncedUids.includes(user.uid)) {
        console.log(`Syncing user: ${user.uid}`);
        const { success, error } = await createUserInExternalApi({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        });

        if (success) {
          setSyncedUids((prev) => [...prev, user.uid]);
        } else if (error && !error.includes('User already exists')) {
          // Only show toast if it's not a "user already exists" error, which is expected.
          toast({
            title: "Could not sync account",
            description: error,
            variant: "destructive",
          });
        }
      }
    };

    syncUser();
  }, [user, syncedUids, toast]);

  return null; // This component does not render anything
}
