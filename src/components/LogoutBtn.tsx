"use client"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { useUserStore } from "@/stores/useUserStore"

export default function LogoutBtn() {
    const removeUser = useUserStore((state) => state.removeUser);
  const router = useRouter();

  const handleLogout = () => {
    removeUser();
    router.push('/login');
  };
    return (<Button variant={"outline"} onClick={handleLogout}>Logout</Button>)
}