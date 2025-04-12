import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

const CaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const cases = [
    {
      id: 'CS-2024-001',
      title: 'Downtown Robbery',
      date: '2024-03-15',
      status: 'In Progress',
      suspects: 3,
      evidenceCount: 8,
    },
    {
      id: 'CS-2024-002',
      title: 'Vehicle Theft',
      date: '2024-03-14',
      status: 'Solved',
      suspects: 1,
      evidenceCount: 5,
    },
    {
      id: 'CS-2024-003',
      title: 'Vandalism Report',
      date: '2024-03-13',
      status: 'New',
      suspects: 2,
      evidenceCount: 4,
    },
  ];

  const filteredCases = cases.filter(case_ => 
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || case_.status === filterStatus)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Case History</h1>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Solved">Solved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredCases.map((case_) => (
            <div key={case_.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{case_.title}</h3>
                  <p className="text-sm text-slate-600">Case ID: {case_.id}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  case_.status === 'Solved' ? 'bg-green-100 text-green-800' :
                  case_.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {case_.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-4 text-sm text-slate-600">
                  <span>Date: {case_.date}</span>
                  <span>Suspects: {case_.suspects}</span>
                  <span>Evidence: {case_.evidenceCount}</span>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-700">
                  View Details
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseHistory;