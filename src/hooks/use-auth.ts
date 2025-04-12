import pb from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const { data: record, isLoading:recordLoading } = useQuery({
    queryKey: ["record"],
    queryFn: () => pb.authStore.record
  });

  const { data: isLoggedIn } = useQuery({
    queryKey: ["isLoggedIn"],
    queryFn: () => pb.authStore.isValid,
  });

  const logOut = async () => {
    pb.authStore.clear();
    setUserId(null);
    setEmail(null);
  };

  const logIn = async (email: string, password: string) => {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    setUserId(authData.record.id);
    setEmail(authData.record.email);
    return authData;
  };

  const signUp = async (
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    const data = { email, password, passwordConfirm };
    const record = await pb.collection("users").create(data);
    logIn(email, password);
    return record;
  };

  useEffect(() => {
    async function checkVerified() {
      if (userId) {
        const userdata = await pb.collection("users").getOne(userId);
        setIsVerified(userdata.verified);
      }
    }
    if (isLoggedIn) {
      checkVerified();
    }
  }, [isLoggedIn, userId]);

  return {
    isLoggedIn,
    logOut,
    isVerified,
    userId: record?.id||'',
    email: record?.email,
    logIn,
    signUp,
  };
}
