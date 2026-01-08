export default function DocSection({ title, children }) {
  return (
    <section className="mt-20">
      <h2 className="text-4xl font-bold mb-6 border-l-4 border-blue-500 pl-4">
        {title}
      </h2>
      <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}
