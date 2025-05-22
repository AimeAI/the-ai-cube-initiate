import React from 'react';
import { BarChart, CheckCircle, AlertTriangle, Lightbulb, Target } from 'lucide-react';

interface MissionImpactReportProps {
  accuracy?: number; // Optional for now, will be used later
  // Placeholder for more complex data if needed in the future
  // performanceStrengths?: string[];
  // performanceWeaknesses?: string[];
  // simulationInsights?: string[];
}

const MissionImpactReport: React.FC<MissionImpactReportProps> = ({ accuracy = 75 }) => {
  // Placeholder data
  const performanceStrengths = [
    "Proficient in identifying Type Alpha specimens.",
    "Rapid response time for familiar patterns.",
  ];
  const performanceWeaknesses = [
    "Requires improvement in distinguishing Type Beta from Type Gamma.",
    "Hesitation observed with novel, uncataloged signatures.",
  ];
  const simulationInsights = [
    "Consider focusing on rapid identification under pressure in subsequent drills.",
    "Next simulation phase may introduce stealth variants with dampened signal strength.",
    "Recommend cross-referencing with archival data for ambiguous classifications.",
  ];

  return (
    <div className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-2xl border border-purple-600 max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-purple-400 tracking-wider" style={{ textShadow: '0 0 10px #8A2BE2, 0 0 20px #8A2BE2' }}>
          Mission Impact Report
        </h2>
        <p className="text-sm text-purple-300">CLASSIFICATION ANALYSIS: POST-ENGAGEMENT REVIEW</p>
      </header>

      {/* Overall Accuracy Section */}
      <section className="mb-8 p-4 bg-gray-800 rounded-md border border-blue-500 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart size={28} className="text-blue-400 mr-3" />
            <h3 className="text-2xl font-semibold text-blue-300">Overall Accuracy</h3>
          </div>
          <div 
            className="text-5xl font-bold text-green-400"
            style={{ textShadow: '0 0 8px #32CD32, 0 0 12px #32CD32' }}
          >
            {accuracy}%
          </div>
        </div>
      </section>

      {/* Performance Analysis Section */}
      <section className="mb-8 p-4 bg-gray-800 rounded-md border border-yellow-500 shadow-lg">
        <div className="flex items-center mb-3">
          <Target size={24} className="text-yellow-400 mr-3" />
          <h3 className="text-2xl font-semibold text-yellow-300">Performance Analysis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-medium text-green-400 mb-2 flex items-center">
              <CheckCircle size={20} className="mr-2 text-green-500" /> Strengths
            </h4>
            <ul className="list-disc list-inside pl-2 text-gray-300 space-y-1">
              {performanceStrengths.map((item, index) => (
                <li key={`strength-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium text-red-400 mb-2 flex items-center">
              <AlertTriangle size={20} className="mr-2 text-red-500" /> Weaknesses
            </h4>
            <ul className="list-disc list-inside pl-2 text-gray-300 space-y-1">
              {performanceWeaknesses.map((item, index) => (
                <li key={`weakness-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Simulation Insights & Suggestions Section */}
      <section className="p-4 bg-gray-800 rounded-md border border-indigo-500 shadow-lg">
        <div className="flex items-center mb-3">
          <Lightbulb size={24} className="text-indigo-400 mr-3" />
          <h3 className="text-2xl font-semibold text-indigo-300">Simulation Insights & Future Directives</h3>
        </div>
        <ul className="list-disc list-inside pl-2 text-gray-300 space-y-2">
          {simulationInsights.map((item, index) => (
            <li key={`insight-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <footer className="mt-8 text-center text-xs text-gray-500">
        Report Generated: {new Date().toLocaleString()} | System ID: CLS-RPT-789
      </footer>
    </div>
  );
};

export default MissionImpactReport;
