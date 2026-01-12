// "use client";
// import { X } from "lucide-react";
// import Profile from "@/app/profile/page";

// export default function ProfileModal({ open, onClose }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
    
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

    
//       <div className="relative w-full max-w-2xl mx-4 animate-scaleIn">
       

//         <button
//             onClick={onClose}
//             className="absolute right-8 top-8 z-10 text-gray-500 hover:text-gray-800 cursor-pointer">
//           <X className="h-6 w-6 text-white" />
//           </button> 

//         <Profile isModal />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import Profile from "@/app/profile/page";

export default function ProfileModal({ onClose }) {
  // Disable body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return <Profile isModal onClose={onClose} />;
}
