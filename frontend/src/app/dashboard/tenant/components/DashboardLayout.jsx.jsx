import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    { name: 'Overview', href: '/start', icon: '🏠' },
    { name: 'My Applications', href: 'dashboard/tenant/myapplication', icon: '📝' },
    { name: 'Vacant Spaces', href: '/vacant-space', icon: '🏢' },
    { name: 'Join Requests', href: '/join-request', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
                <h1 className="text-xl font-bold text-purple-700">TenantDashboard</h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                <div className="ml-3 relative">
                  <div>
                    <button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                        <span className="text-purple-700 font-medium">T</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md cursor-pointer ${
                        router.pathname === item.href
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 flex z-40">
            <div className="fixed inset-0">
              <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
            </div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={toggleSidebar}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-purple-700">TenantDashboard</h1>
                </div>
                <nav className="mt-5 px-4 space-y-1">
                  {navigationItems.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <div
                        className={`group flex items-center px-3 py-3 text-base font-medium rounded-md cursor-pointer ${
                          router.pathname === item.href
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.name}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="md:ml-64 flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;