import Landing from "@/src/components/Landing";
import Image from "next/image";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Mainlayout from "@/src/components/layout/Mainlayout";


export default function Home() {
  // const {user} = useAuth();
  return (
    <AuthProvider>
      <Mainlayout> <Landing/> </Mainlayout>      
    </AuthProvider>
  );
}


