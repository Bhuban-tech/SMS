export default function DocHeader({ title, description }) {
  return (
    <header className="mb-16">
      <h1 className="text-6xl font-black bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
        {title}
      </h1>
      {description && (
        <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          {description}
        </p>
      )}
    </header>
  );
}
