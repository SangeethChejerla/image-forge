'use client';

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const tools = [
    { href: '/converter', label: 'Converter' },
    { href: '/compressor', label: 'Compressor' },
    { href: '/pdf-unlocker', label: 'PDF Unlocker' },
    { href: '/watermark-remover', label: 'Watermark Remover' },
    { href: '/background-remover', label: 'Background Remover' },
    { href: '/text-overlay', label: 'Text Overlay' },
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 p-6 shadow-lg">
        <h2 className="text-3xl font-extrabold text-blue-400 mb-8">ImageForge</h2>
        <nav>
          <ul className="space-y-2">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className={`block py-2 px-4 rounded-md transition-colors ${
                    pathname === tool.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;