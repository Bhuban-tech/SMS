export default function InfoBox({ children }) {
  return (
    <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
      {children}
    </div>
  );
}
