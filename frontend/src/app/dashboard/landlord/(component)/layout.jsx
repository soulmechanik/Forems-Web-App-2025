'use client';



import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Switchrole from '@/components/Switchrole';
import Link from 'next/link';

export default function GlassMorphMenu({ children }) {
  const pathname = usePathname();
  const basePath = pathname.split('/').slice(0, 3).join('/'); // Gets /dashboard/landlord
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [currentRole, setCurrentRole] = useState('Landlord');
  const [activeItem, setActiveItem] = useState('Overview');
  const [expandedGroups, setExpandedGroups] = useState({
    'TENANT MANAGEMENT': true,
    'PROPERTY MANAGEMENT': true,
    'FINANCE': true,
    'DOCUMENTS': true,
    'COMMUNICATIONS': true,
    'ACCOUNT': true
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isMenuOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isMenuOpen]);

  // Helper function to create full paths
  const createPath = (path) => {
    return `${basePath}${path}`;
  };

  const menuGroups = [
    {
      title: "TENANT MANAGEMENT",
      items: [
        { id: 6, name: 'My Tenants', icon: 'groups', color: 'text-indigo-500', href: createPath('/tenantmanagement/mytenants') },
        { id: 7, name: 'Maintenance ', icon: 'construction', color: 'text-orange-500', href: createPath('/tenantmanagement/maintenance') },
        { id: 8, name: 'Tenancy Application', icon: 'description', color: 'text-blue-500', href: createPath('/tenantmanagement/tenancyapplication') },
        { id: 31, name: 'Advertise Vacancy', icon: 'campaign', color: 'text-purple-500', href: createPath('/tenantmanagement/advertisevacancy') },
      ]
    },
    {
      title: "PROPERTY MANAGEMENT",
      items: [
        { id: 9, name: 'My Properties', icon: 'apartment', color: 'text-gray-600', href: createPath('/propertymanagement/myproperties') },
        { id: 10, name: 'Managers', icon: 'supervisor_account', color: 'text-cyan-500', href: createPath('/propertymanagement/managers') },
        { id: 11, name: 'Artisans', icon: 'engineering', color: 'text-amber-500', href: createPath('/propertymanagement/artisans') },
        { id: 12, name: 'Get Prepaid Meter', icon: 'speed', color: 'text-red-500', href: createPath('/propertymanagement/getprepaidmeter') },
        { id: 13, name: 'Waste Management', icon: 'delete', color: 'text-lime-500', href: createPath('/propertymanagement/wastemanagement') },
        { id: 14, name: 'Valuation', icon: 'calculate', color: 'text-teal-500', href: createPath('/propertymanagement/valuation') },
        { id: 15, name: 'Rating', icon: 'star', color: 'text-yellow-500', href: createPath('/propertymanagement/rating') },
      ]
    },
    {
      title: "FINANCE",
      items: [
        { id: 16, name: 'Rent Payment', icon: 'payments', color: 'text-green-500', href: createPath('/finance/rentpayment') },
        { id: 17, name: 'Service Charge', icon: 'receipt', color: 'text-blue-500', href: createPath('/finance/servicecharge') },
        { id: 18, name: 'Invoices', icon: 'description', color: 'text-purple-500', href: createPath('/finance/invoices') },
      ]
    },
    {
      title: "DOCUMENTS",
      items: [
        { id: 19, name: 'Receipts', icon: 'receipt', color: 'text-emerald-500', href: createPath('/documents/receipts') },
        { id: 20, name: 'Tenancy Contract', icon: 'description', color: 'text-indigo-500', href: createPath('/documents/tenancycontract') },
        { id: 21, name: 'Inventory Reports', icon: 'summarize', color: 'text-cyan-500', href: createPath('/documents/inventoryreports') },
        { id: 22, name: 'Quit Notice', icon: 'exit_to_app', color: 'text-red-500', href: createPath('/documents/quitnotice') },
        { id: 23, name: 'Insurance', icon: 'security', color: 'text-blue-500', href: createPath('/documents/insurance') },
        { id: 24, name: 'Tax', icon: 'attach_money', color: 'text-green-600', href: createPath('/documents/tax') },
      ]
    },
    {
      title: "COMMUNICATIONS",
      items: [
        { id: 25, name: 'Announcements', icon: 'campaign', color: 'text-purple-500', href: createPath('/communications/announcements') },
        { id: 26, name: 'Support', icon: 'support', sublabel: 'WhatsApp', color: 'text-emerald-500', href: createPath('/communications/support') },
      ]
    },
    {
      title: "ACCOUNT",
      items: [
        { id: 27, name: 'Profile', icon: 'person', color: 'text-gray-600', href: createPath('/account/profile') },
        { id: 28, name: 'Settings', icon: 'settings', color: 'text-gray-500', href: createPath('/account/settings') },
        { id: 29, name: 'Switch Account', icon: 'switch_account', color: 'text-indigo-500', href: createPath('/account/switchaccount') },
        { id: 30, name: 'Logout', icon: 'logout', color: 'text-red-500', href: createPath('/account/logout') },
      ]
    }
  ];

  // Material Icon component
  const MaterialIcon = ({ icon, className = "" }) => (
    <span className={`material-icons-outlined ${className}`}>{icon}</span>
  );

  const roles = ['Landlord', 'Tenant', 'Agent'];

  const toggleGroup = (groupTitle) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  // Filter menu items based on search query
  const filteredMenuGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-0 font-sans flex flex-col lg:flex-row">
      {/* Desktop Sidebar - REDESIGNED */}
      <aside className={`hidden lg:flex flex-col bg-[#fafafa] shadow-sm z-10 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-60'}`}>
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isSidebarCollapsed ? (
            <div className="flex items-center">
              <img 
                src="/newlogoforems.png" 
                alt="Forems Africa" 
             
              />
            
            </div>
          ) : (
            <img 
              src="/forems logo no bg.png" 
              alt="Forems Africa" 
              className="w-10 h-10  mx-auto"
            />
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <MaterialIcon icon={isSidebarCollapsed ? "chevron_right" : "chevron_left"} className="text-gray-600 text-sm" />
          </button>
        </div>
        
        {/* Search Feature - Only visible when sidebar is not collapsed */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1.5 pl-7 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <MaterialIcon icon="search" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <MaterialIcon icon="close" className="text-xs" />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-3 px-2 relative">
          {/* Vertical line connecting titles - Positioned below the search bar */}
          {!isSidebarCollapsed && (
            <div className="absolute left-3 top-3 bottom-16 w-px bg-gray-300"></div>
          )}

          {/* Collapsible Groups */}
          <div className="relative">
            {(searchQuery ? filteredMenuGroups : menuGroups).map((group, index) => (
              <div key={index} className="mb-1 px-1 relative">
                {/* Dot connector */}
                {!isSidebarCollapsed && (
                  <div className="absolute left-0 top-3 w-2 h-2 rounded-full bg-black z-10"></div>
                )}
                
                {!isSidebarCollapsed ? (
                  <>
                    <button 
                      className="flex items-center justify-between w-full px-2 py-1.5 pl-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors rounded"
                      onClick={() => toggleGroup(group.title)}
                    >
                      <span>{group.title}</span>
                      <MaterialIcon 
                        icon={expandedGroups[group.title] ? "arrow_drop_down" : "arrow_right"} 
                        className="text-gray-400 text-sm" 
                      />
                    </button>
                    
                    {expandedGroups[group.title] && (
                      <ul className="mt-0.5 space-y-0.5">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            <Link href={item.href}>
                              <button
                                className={`flex items-center w-full px-2 cursor-pointer py-1.5 pl-6 text-xs transition-all rounded ${activeItem === item.name ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveItem(item.name)}
                              >
                                <MaterialIcon icon={item.icon} className={`mr-2 text-xs ${activeItem === item.name ? 'text-gray-600' : item.color}`} />
                                <span className="font-normal truncate">{item.name}</span>
                                {item.sublabel && (
                                  <span className="ml-auto text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded-full">{item.sublabel}</span>
                                )}
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // Collapsed view - show only group icons with tooltips on hover
                  <div className="relative group">
                    <button
                      className={`flex items-center cursor-pointer justify-center w-full p-1.5 mb-1 text-xs transition-all rounded ${expandedGroups[group.title] ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                      onClick={() => toggleGroup(group.title)}
                    >
                      <MaterialIcon 
                        icon={group.items[0]?.icon || 'folder'} 
                        className={`text-xs ${expandedGroups[group.title] ? 'text-gray-600' : 'text-gray-500'}`} 
                      />
                    </button>
                    
                    {/* Tooltip for collapsed items */}
                    <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                      {group.title}
                    </div>
                    
                    {/* Expanded submenu in collapsed mode */}
                    {expandedGroups[group.title] && isSidebarCollapsed && (
                      <div className="absolute left-full top-0 ml-1 bg-white rounded shadow-lg border border-gray-200 overflow-hidden z-40 min-w-[160px]">
                        {group.items.map((item) => (
                          <Link href={item.href} key={item.id}>
                            <button
                              className={`flex items-center w-full px-3 py-2 text-xs transition-all ${activeItem === item.name ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                              onClick={() => setActiveItem(item.name)}
                            >
                              <MaterialIcon icon={item.icon} className={`mr-2 text-xs ${activeItem === item.name ? 'text-indigo-600' : item.color}`} />
                              <span className="font-normal">{item.name}</span>
                            </button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Support Section */}
        {!isSidebarCollapsed && (
          <div className="p-2 border-t border-gray-200">
            <div className="bg-indigo-50 rounded p-1.5 flex items-center">
              <div className="bg-indigo-100 p-1 rounded mr-1.5">
                <MaterialIcon icon="support" className="text-indigo-600 text-xs" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-800">Need help?</p>
                <p className="text-[9px] text-gray-600">Contact support</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop Header - ENHANCED DESIGN */}
        <header className="hidden lg:flex items-center justify-between p-3 bg-white border-b border-gray-200">
          {/* Left section with page title */}
          <div className="flex items-center">
            <h2 className="text-sm font-normal text-gray-700">Dashboard Overview.  <Switchrole/> </h2>
          </div>
          
          {/* Right section with notifications and profile */}
          <div className="flex items-center space-x-2">
            {/* Notification and messages */}
            <div className="flex items-center space-x-1">
              <button className="p-1.5 rounded hover:bg-gray-100 transition-colors relative">
                <MaterialIcon icon="notifications" className="text-gray-600 text-base" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-1.5 rounded hover:bg-gray-100 transition-colors relative">
                <MaterialIcon icon="email" className="text-gray-600 text-base" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              </button>
            </div>
            
            {/* Separator */}
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100 transition-colors"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-xs">
                  AJ
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-gray-700">Alex Johnson</p>
                  <p className="text-[10px] text-gray-500 flex items-center">
                    {currentRole}
                    <MaterialIcon icon={showRoleDropdown ? "expand_less" : "expand_more"} className="text-[10px] ml-0.5" />
                  </p>
                </div>
              </button>
              
              {showRoleDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded shadow-lg border border-gray-200 overflow-hidden z-50 min-w-[120px]">
                  {roles.map((role, index) => (
                    <button
                      key={index}
                      className={`w-full py-1.5 px-2 text-left text-xs hover:bg-indigo-50 transition-colors ${currentRole === role ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}
                      onClick={() => {
                        setCurrentRole(role);
                        setShowRoleDropdown(false);
                      }}
                    >
                      {role} 
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header - UNCHANGED */}
        <header className="lg:hidden flex justify-between items-center p-4 bg-white border-b border-gray-200">
           <img 
                src="/newlogoforems.png" 
                alt="Forems Africa" 
                className='mr-2 w-70 h-20'
              />
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center w-10 h-10"
          >
            <div className="w-5 h-0.5 bg-gray-700 mb-1.5"></div>
            <div className="w-5 h-0.5 bg-gray-700 mb-1.5"></div>
            <div className="w-3.5 h-0.5 bg-gray-700 ml-auto"></div>
          </button>
        </header>

        {/* Main Content - UPDATED TO SHOW CHILDREN */}
        <main className="p-4 space-y-5 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Glass Morphism Menu Overlay - FIXED Z-INDEX ISSUES */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col">
          <div 
            className={`absolute inset-0 bg-white/10 backdrop-blur-2xl transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className={`relative z-[61] flex flex-col h-full p-5 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex-1 text-center">
              <img 
                src="/newlogoforems.png" 
                alt="Forems Africa" 
             
              />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <MaterialIcon icon="close" className="text-gray-700 text-2xl" />
              </button>
            </div>

            <div className="bg-white/200 backdrop-blur-lg rounded-xl p-3 mb-4 border border-indigo-200 relative z-[62]">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center text-white font-bold text-sm mr-3">
                  AJ
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h2 className="text-sm font-semibold text-gray-800 mr-2">Alex Johnson</h2>
                    <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center">
                      <MaterialIcon icon="verified" className="text-blue-600 text-[10px] mr-1" />
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-600 mr-2">{currentRole}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-[63]">
               
                
                {showRoleDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[64]">
                    {roles.map((role, index) => (
                      <button
                        key={index}
                        className={`w-full py-2 px-3 text-left text-xs hover:bg-indigo-50 transition-colors ${currentRole === role ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700'}`}
                        onClick={() => {
                          setCurrentRole(role);
                          setShowRoleDropdown(false);
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 mt-2 z-[62]">
              <div className="space-y-4"> <Switchrole className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg border hover:scale-105 transition-all duration-300 z-" />

                {[
                  {
                    title: "QUICK ACTIONS",
                    items: [
                      { id: 1, name: 'Overview', icon: 'dashboard', color: 'text-blue-600', href: createPath('/overview') },
                      { id: 2, name: 'Maintenance', icon: 'handyman', color: 'text-amber-600', href: createPath('/tenantmanagement/maintenance') },
                      { id: 3, name: 'Order Meter', icon: 'speed', color: 'text-red-500', href: createPath('/propertymanagement/getprepaidmeter') },
                      { id: 4, name: 'Payment', icon: 'payments', color: 'text-green-600', href: createPath('/finance/rentpayment') },
                      { id: 5, name: 'Announcements', icon: 'campaign', color: 'text-purple-500', href: createPath('') },
                    ]
                  },
                  ...menuGroups
                ].map((group, index) => (
                  <div 
                    key={index} 
                    className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/30"
                  >
                    <h3 className="text-gray-700 font-semibold mb-3 text-xs tracking-wide">{group.title}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex flex-col items-center">
                          <Link href={item.href}>
                            <button
                              className={`w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 backdrop-blur-md rounded-lg border border-white/100 hover:scale-105 transition-all duration-300`}
                              onClick={() => {
                                console.log(`Clicked: ${item.name}`);
                                setIsMenuOpen(false);
                              }}
                            >
                              <MaterialIcon icon={item.icon} className={`text-xl ${item.color}`} />
                            </button>
                          </Link>
                          <div className="mt-2 text-center w-full">
                            <span className="text-gray-700 font-normal text-xs block">{item.name}</span>
                            {item.sublabel && (
                              <span className="text-[10px] text-gray-500 mt-0.5 block">{item.sublabel}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Icons CSS */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
    </div>
  );
}