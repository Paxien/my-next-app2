export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-green-500 text-sm">↑ 12% from last month</p>
          </div>

          {/* Activity Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <p className="text-3xl font-bold">567</p>
            <p className="text-blue-500 text-sm">Active in last 24h</p>
          </div>

          {/* Performance Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Performance</h3>
            <p className="text-3xl font-bold">98%</p>
            <p className="text-green-500 text-sm">Uptime this month</p>
          </div>
        </div>

        {/* Recent Updates Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Recent Updates</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-medium">Update Title {item}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This is a brief description of the update that occurred.
                </p>
                <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
