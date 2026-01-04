import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ phone }) {
  return (
    <div className="bg-linear-to-r from-slate-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4  py-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-0.5" />
              <Link
                href="/phones"
                className="px-2 py-1 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
              >
                Phones
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-0.5" />
              <Link
                href="/phones?brand=samsung"
                className="px-2 py-1 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
              >
                {phone.brand}
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-0.5" />
              <span className="px-2 py-1 rounded-md bg-gray-900 text-white text-xs font-medium truncate max-w-[180px] sm:max-w-none">
                {phone.name}
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}
