import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/teams" className="card">Teams</Link>
        <Link to="/tasks" className="card">Tasks</Link>
        <Link to="/notifications" className="card">Notifications</Link>
        <Link to="/audit-logs" className="card">Audit Logs</Link>
      </div>
    </div>
  );
}
