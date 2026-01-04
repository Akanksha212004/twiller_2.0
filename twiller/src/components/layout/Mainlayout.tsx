// // "use client";

// // import { LoadingSpinner } from "@/src/components/loading-spinner";
// // import { useAuth } from "@/src/context/AuthContext";
// // import Sidebar from "@/src/components/layout/Sidebar";
// // import React, { useState } from "react";

// // const Mainlayout = ({ children }: any) => {
// //     const { user, isLoading } = useAuth();
// //     const [currentPage, setCurrentPage] = useState("home");
// //     if (isLoading) {
// //         return (
// //             <div className="min-h-screen bg-black flex items-center justify-center">
// //                 <div className="text-center">
// //                     <div className="text-white text-4xl font-bold mb-4">X</div>
// //                     <LoadingSpinner />
// //                 </div>
// //             </div>
// //         );
// //     }
// //     if (!user) {
// //         return <>{children}</>
// //     }
// //     return (
// //         <div>
// //             <div className="min-h-screen bg-black text-white flex">
// //                 <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
// //                 <main>
// //                     {children}
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Mainlayout;





// "use client";

// import { LoadingSpinner } from "@/src/components/loading-spinner";
// import { useAuth } from "@/src/context/AuthContext";
// import Sidebar from "@/src/components/layout/Sidebar";
// import React, { useState } from "react";
// import ProfilePage from "../ProfilePage";
// import RightSidebar from "@/src/components/layout/RightSidebar";

// const Mainlayout = ({ children }: any) => {
//   const { user, isLoading } = useAuth();
//   const [currentPage, setCurrentPage] = useState("home");

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-white text-4xl font-bold mb-4">X</div>
//           <LoadingSpinner />
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <>{children}</>;
//   }

//   return (
//     <div className="min-h-screen bg-black text-white flex justify-center">
//       <div className="w-20 sm:w-24 md:w-64 border-r border-gray-800">
//         <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
//       </div>
//       <main>
//         {currentPage === "profile" ? <ProfilePage/>: children}
//       </main>
//       <div className="hidden lg:block w-80 p-4">
//         <RightSidebar />
//       </div>
//     </div>

//   );
// };

// export default Mainlayout;






"use client";

import { LoadingSpinner } from "@/src/components/loading-spinner";
import { useAuth } from "@/src/context/AuthContext";
import Sidebar from "@/src/components/layout/Sidebar";
import React, { useState } from "react";
import ProfilePage from "../ProfilePage";
import RightSidebar from "@/src/components/layout/RightSidebar";

const Mainlayout = ({ children }: any) => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-4xl font-bold mb-4">X</div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-20 sm:w-24 md:w-64 border-r border-gray-800">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

      <main className="flex-1 max-w-2xl min-w-0 overflow-auto border-r border-gray-800">
        {currentPage === "profile" ? <ProfilePage /> : children}
      </main>

      <div className="hidden lg:block w-80 p-4">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Mainlayout;
