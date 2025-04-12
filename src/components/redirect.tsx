import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Moon, Sun, User } from "lucide-react";
import { useLogOut, useSetUserType } from "@/hooks/mutation/login";
import { getByUserId } from "../../pocketbase-fns/by-user-id";
import { setUserType } from "../../actions/user-is-valid";
import pb from "@/lib/pocketbase";

export default function RedirectOr({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, email } = useAuth();
  const { mutate: setUserTypeFn } = useSetUserType();
  const router = useRouter();
  const { mutate: logOut } = useLogOut();

  const {
    data: userType,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["role", userId],
    queryFn: () => getByUserId("role", `${userId}`),
    enabled: !!userId,
  });

  const {data:allUserType} = useQuery({
    queryKey: ["allUserType"],
    queryFn: () => pb.collection("role").getFullList(),
    enabled: !!userId,
  })

  if(allUserType){
    console.log(allUserType, userId)
  }

  useEffect(() => {
    if (isError) {
      setUserType("");
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && userType?.role) {
      setUserType(userType.role);
    }
  }, [userType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return userType ? (
    <>
      <Popover>
        <PopoverTrigger className="border bg-black dark:bg-white dark:hover:bg-gray-500  dark:text-black text-white hover:bg-gray-500 justify-center flex items-center w-10 h-10 m-2 rounded-full fixed top-0 right-0">
          <User />
        </PopoverTrigger>
        <PopoverContent className="p-2 gap-4 flex flex-col">
          <div className={`flex justify-between items-center`}>{email}</div>
          <div className="flex justify-between items-center gap-2 text-xs">
            <Button
              className="text-xs"
              variant="outline"
              onClick={() => router.push(`/profile/${userType.role}s`)}
            >
              Edit profile
            </Button>
            <Button className="text-xs" onClick={() => logOut()}>
              Log Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {userType.role == "admin" ? children : <div>wellcome</div>}
    </>
  ) : (
    <div className="flex flex-col items-center gap-4 justify-center h-screen">
      <div>Choose Your Account Type</div>
      <div className="flex items-center gap-4 justify-center">
        <Button
          variant="outline"
          className="p-4 w-[200px] h-[200px] "
          onClick={() => setUserTypeFn({ userId, role: "employee" })}
        >
          Employee
        </Button>
        <Button
          variant="outline"
          className="p-4 w-[200px] h-[200px] "
          onClick={() => setUserTypeFn({ userId, role: "maintenance" })}
        >
          Maintenance
        </Button>
      </div>
    </div>
  );
}
