import Landing from "@/components/Landing";
import Image from "next/image";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Mainlayout from "@/components/layout/Mainlayout";


export default function Home() {
  // const {user} = useAuth();
  return (
    <AuthProvider>
      <Mainlayout> <Landing/> </Mainlayout>      
    </AuthProvider>
  );
}


