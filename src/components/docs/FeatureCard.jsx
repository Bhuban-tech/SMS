// export default function FeatureCard({ title, description }) {
//   return (
//     <div className="p-6 rounded-2xl border bg-white/70 dark:bg-gray-900/60 shadow-lg hover:scale-[1.02] transition">
//       <h3 className="text-xl font-semibold mb-2">{title}</h3>
//       <p className="text-gray-600 dark:text-gray-400">{description}</p>
//     </div>
//   );
// }

// components/docs/FeatureCard.jsx
import Link from "next/link";

export default function FeatureCard({ title, description, href }) {
  const CardContent = (
    <div className="cursor-pointer rounded-xl border p-10 hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}
