import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axiosInstance from '../../service/axios';
import AdminLayout from '../../components/AdminLayout';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF69B4', '#AA00FF'];

function AdminDashboard() {
  const [summary, setSummary] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/summary');
      setSummary(res.data.summary || []);
      setTotalProducts(res.data.totalProducts || 0);
      setTotalCategories(res.data.totalCategories || 0);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  // Pie chart 2 data
  const overallData = [
    { name: 'Total Products', value: totalProducts },
    { name: 'Total Categories', value: totalCategories },
  ];

  return (
    <AdminLayout>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart 1: Products per Category */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Products per Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={summary}
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {summary.map((entry, index) => (
                  <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart 2: Total Products vs Categories */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Product vs Category Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={overallData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {overallData.map((entry, index) => (
                  <Cell key={`cell-overall-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </AdminLayout>
  );
}

export default AdminDashboard;
