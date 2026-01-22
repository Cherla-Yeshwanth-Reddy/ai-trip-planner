import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total_users: 0, total_trips: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stats")
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      alert("Access Denied.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* BRANDED HEADER (Gradient) */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 pb-24 pt-10 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Portal</h1>
            <p className="text-blue-100 mt-1 opacity-90">Manage your application metrics and users</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-blue-600 px-6 py-2.5 rounded-xl transition text-sm font-bold shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT CONTAINER (Overlapping the header) */}
      <div className="max-w-7xl mx-auto px-6 -mt-16">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Users" value={stats.total_users} icon="👥" color="blue" />
          <StatCard title="Trips Generated" value={stats.total_trips} icon="✈️" color="emerald" />
          <StatCard title="System Status" value="Online" icon="🟢" color="purple" isText />
        </div>

        {/* DATA TABLE CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-12">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-800">User Database</h2>
            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {users.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-6">User</th>
                  <th className="p-6">Role</th>
                  <th className="p-6">User ID</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-700">{u.username}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border bg-blue-50 text-blue-700 border-blue-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-6 font-mono text-xs text-slate-400">
                      {u.id}
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-wide transition">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Stats Component ---
function StatCard({ title, value, icon, color, isText }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    purple: "text-purple-600 bg-purple-50",
  };
  const theme = colors[color] || colors.blue;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex items-center gap-6 hover:-translate-y-1 transition-transform duration-300">
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl ${theme}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
        <h3 className={`font-black ${isText ? "text-2xl" : "text-4xl"} text-slate-800`}>
          {value}
        </h3>
      </div>
    </div>
  );
}