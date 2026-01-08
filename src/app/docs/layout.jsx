// app/docs/layout.jsx
import DocSidebar from "@/components/DocSidebar";

export default function DocsLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">

      {/* Sidebar */}
      <aside className="hidden md:flex w-72 border-r border-gray-200 dark:border-gray-800
        bg-gray-50 dark:bg-gray-900 sticky top-0 h-screen">

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <DocSidebar />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
          {children}
        </div>
      </main>

    </div>
  );
}
