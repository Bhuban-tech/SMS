export default function FeatureGrid({ children }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {children}
    </div>
  );
}
