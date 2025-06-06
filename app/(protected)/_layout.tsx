import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { ActivityIndicator, View } from "react-native";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/Login");
      }
      setChecking(false);
    });
  }, [router]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}