import React from 'react';
import { FileText, Users, Clock, CheckCircle } from 'lucide-react';
import NewCase from './NewCase';

const Dashboard = () => {
  const stats = [
    { label: 'Active Cases', value: '10', icon: Clock, color: 'bg-blue-500' },
    { label: 'Solved Cases', value: '48', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Total Suspects', value: '86', icon: Users, color: 'bg-purple-500' },
    { label: 'Evidence Files', value: '234', icon: FileText, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, Detective</h1>
          <p className="text-slate-600">Here's what's happening with your cases</p>
        </div>
        <button onClick={() => navigate('/new-case')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + New Case
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCases />
        <PendingEvidence />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <p className="text-slate-600">{label}</p>
    </div>
  );
};

const RecentCases = () => {
  const cases = [
    { id: 'CS-2024-001', title: 'Downtown Robbery', status: 'In Progress', date: '2024-03-15' },
    { id: 'CS-2024-002', title: 'Vehicle Theft', status: 'Solved', date: '2024-03-14' },
    { id: 'CS-2024-003', title: 'Vandalism Report', status: 'New', date: '2024-03-13' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Cases</h2>
      <div className="space-y-4">
        {cases.map((case_) => (
          <div key={case_.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">{case_.title}</p>
              <p className="text-sm text-slate-600">Case ID: {case_.id}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                case_.status === 'Solved' ? 'bg-green-100 text-green-800' :
                case_.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {case_.status}
              </span>
              <p className="text-sm text-slate-600 mt-1">{case_.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PendingEvidence = () => {
  const evidence = [
    { type: 'Fingerprint Analysis', case: 'CS-2024-001', priority: 'High' },
    { type: 'Voice Recognition', case: 'CS-2024-003', priority: 'Medium' },
    { type: 'Facial Recognition', case: 'CS-2024-001', priority: 'High' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Pending Evidence Analysis</h2>
      <div className="space-y-4">
        {evidence.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">{item.type}</p>
              <p className="text-sm text-slate-600">Case: {item.case}</p>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              item.priority === 'High' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {item.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;