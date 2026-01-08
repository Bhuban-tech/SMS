// components/docs/Screenshot.jsx
import Image from "next/image";

export default function Screenshot({ src, alt }) {
  return (
    <div className="my-12 rounded-xl overflow-hidden shadow-2xl border">
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={800}
        className="w-full h-auto"
      />
    </div>
  );
}
