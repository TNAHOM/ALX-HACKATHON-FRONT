import { X, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [islogout, setIsLogout] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabases = createClient();
      const { data, error } = await supabases.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message, error);
        return;
      }

      if (!data.session?.user) {
        console.log("User not authenticated, redirecting...", data, error);
        router.push("/login");
      } else {
        console.log("User is authenticated:", data.session.user);
        setUser(data.session.user);
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    if (islogout) {
      const handleLogout = async () => {
        const supabases = createClient();
        await supabases.auth.signOut();
      };
      handleLogout();
      setIsLogout(false);
    }
    setIsLoading(false);
  }, [router, islogout]);
  console.log("user", user);

  return (
    <header className="relative z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-800 p-2"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          <span className="ml-2 text-sm font-medium">Menu</span>
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#f8a4a9] flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <div className="ml-2">
              <h1 className="font-bold text-gray-800">KURIFTU</h1>
              <p className="text-sm text-gray-600">RESORTS</p>
            </div>
          </div>
        </div>

        {/* <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-300">
            Sign Up
          </Button>
          <Button variant="outline" className="border-gray-300">
            Reserve
          </Button>
        </div> */}

        {user?.role === "admin" && <Link href={"/admin"}>Admin</Link>}
        {user?.role === "instructor" && (
          <Link href={"/instructor/dashboard"}>Dashboard</Link>
        )}

        {user?.role === "user" && <Link href={"/profile"}>Profile</Link>}
        {isLoading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <p>{user?.first_name}</p>
            <Button
              variant="outline"
              className="border-gray-300"
              onClick={() => setIsLogout(true)}
            >
              Logout
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline" className="border-gray-300">
              <a
                className="text-purpleStandard border border-purpleStandard px-4 py-1"
                href="/auth/login"
              >
                Login
              </a>
            </Button>
            <Button variant="outline" className="border-gray-300">
              <a
                href="/auth/signup"
                className="px-4 py-1 bg-purpleStandard text-white"
              >
                SignUp
              </a>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
