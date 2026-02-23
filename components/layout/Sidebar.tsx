import { Home, Users, Settings, History } from "lucide-react";

function Sidebar() {
  return (
    <aside
      aria-label="Main navigation"
      className="hidden md:block w-64 bg-white shadow-md"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">ZK Payroll</h1>
      </div>
      <nav aria-label="Primary">
        <a
          className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 border-r-4 border-blue-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          href="#"
          aria-current="page"
        >
          <Home className="w-5 h-5 mr-3" aria-hidden="true" />
          Dashboard
        </a>
        <a
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          href="#"
        >
          <Users className="w-5 h-5 mr-3" aria-hidden="true" />
          Employees
        </a>
        <a
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          href="#"
        >
          <History className="w-5 h-5 mr-3" aria-hidden="true" />
          History
        </a>
        <a
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          href="#"
        >
          <Settings className="w-5 h-5 mr-3" aria-hidden="true" />
          Settings
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
