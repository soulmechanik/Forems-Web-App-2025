import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';

const MyApplicationPage = () => {
  // Mock data for applications
  const applications = [
    {
      id: 1,
      property: 'Sunset Apartments',
      unit: 'Unit 302',
      status: 'Approved',
      date: '2023-05-15',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      property: 'Riverfront Lofts',
      unit: 'Unit 105',
      status: 'Rejected',
      date: '2023-04-28',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      id: 3,
      property: 'Downtown Suites',
      unit: 'Unit 410',
      status: 'Pending',
      date: '2023-06-02',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 4,
      property: 'Harbor View Residences',
      unit: 'Unit 208',
      status: 'Under Review',
      date: '2023-05-20',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
        <Link href="/vacant-space">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
            style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}
          >
            Get a New Apartment
          </button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600">🏢</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{app.property}</h3>
                  <p className="text-sm text-gray-500">{app.unit}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Applied on {app.date}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.statusColor}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  View details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state (commented out for now) */}
      {/* <div className="mt-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by applying for a new apartment.</p>
        <div className="mt-6">
          <Link href="/vacant-space">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
              style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}
            >
              Get a New Apartment
            </button>
          </Link>
        </div>
      </div> */}
    </DashboardLayout>
  );
};

export default MyApplicationPage;