import { Bell, Search, User } from "lucide-react";

function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b">
            <div className="flex items-center">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                    className="ml-2 outline-none bg-transparent placeholder-gray-400"
                    type="text"
                    placeholder="Search..."
                />
            </div>
            <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                    <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Admin</span>
                </div>
            </div>
        </header>
    );
}

export default Header;