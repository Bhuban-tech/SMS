"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = ({
  href = "/dashboard",
  showText = true,
  size = 60,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className="flex items-center gap-2 cursor-pointer select-none"
    >
      {/* Logo Image */}
      <div className="relative">
        <Image
          src="/kritimsms_logo.png"   
          alt="App Logo"
          width={size}
          height={size}
          priority
          className="rounded-md"
        />
      </div>

      {showText && (
        <span className="hidden sm:block text-lg font-bold text-white tracking-wide">
          Kritim<span className="text-teal-600">SMS</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
