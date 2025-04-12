import pb from "@/lib/pocketbase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertByUserId } from "../../../pocketbase-fns/by-user-id";
import { setPocketCookie, setUserType } from "../../../actions/user-is-valid";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: { [key: string]: any }) =>
      pb
        .collection("users")
        .authWithPassword(userData.email, userData.password),
    onSuccess: async (data) => {
      console.log("Success:", data);
      queryClient.invalidateQueries({ queryKey: ["isLoggedIn"] });
      queryClient.invalidateQueries({ queryKey: ["record"] });
      console.log(data.token, "this is the token");
      await setPocketCookie(data.token);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });
}

export function useLogOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => pb.authStore.clear(),
    onSuccess: async () => {
      console.log("Success: logged out");
      queryClient.invalidateQueries({ queryKey: ["isLoggedIn"] });
      await setPocketCookie("");
      await setUserType("");
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });
}

export function useSetUserType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userInfo: { [key: string]: any }) =>
      upsertByUserId("role", userInfo.userId, userInfo),
    onSuccess: async (data) => {
      console.log("Success user type:", data);
      queryClient.invalidateQueries({ queryKey: ["role"] });
      await setUserType(data.type);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });
}
