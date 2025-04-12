import React from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

const Results = () => {
  const suspects = [
    {
      id: 1,
      name: "John Doe",
      matchPercentage: 87,
      matches: {
        face: 92,
        fingerprint: 85,
        iris: 88,
        voice: 83
      }
    },
    {
      id: 2,
      name: "Jane Smith",
      matchPercentage: 45,
      matches: {
        face: 42,
        fingerprint: 48,
        iris: 46,
        voice: 44
      }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Analysis Results</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </button>
      </div>

      <div className="space-y-6">
        {suspects.map((suspect, index) => (
          <div
            key={suspect.id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden ${
              index === 0 ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{suspect.name}</h3>
                  <p className="text-slate-600">Suspect ID: {suspect.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{suspect.matchPercentage}%</div>
                  <p className="text-sm text-slate-600">Overall Match</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(suspect.matches).map(([type, percentage]) => (
                  <div key={type} className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-slate-800">{percentage}%</div>
                    <p className="text-sm text-slate-600 capitalize">{type} Match</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="flex items-center text-blue-600 hover:text-blue-700">
                  <ChevronDown className="w-5 h-5 mr-1" />
                  View Detailed Comparison
                </button>
              </div>
            </div>

            {index === 0 && (
              <div className="bg-blue-50 px-6 py-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <p className="text-sm text-blue-700 font-medium">Highest probability match</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;