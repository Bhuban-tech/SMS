export default function FeatureCard({ title, description }) {
  return (
    <div className="p-6 rounded-2xl border bg-white/70 dark:bg-gray-900/60 shadow-lg hover:scale-[1.02] transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
