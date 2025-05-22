import React from 'react';

interface ConfusionMatrixPanelProps {
  // Later, we might pass dynamic data here
  data?: {
    truePositive: number;
    falsePositive: number;
    falseNegative: number;
    trueNegative: number;
  };
}

const ConfusionMatrixPanel: React.FC<ConfusionMatrixPanelProps> = ({ data }) => {
  // Static placeholder data
  const placeholderData = {
    truePositive: 15,  // Predicted Positive, Actual Positive
    falsePositive: 2,  // Predicted Positive, Actual Negative (Type I error)
    falseNegative: 3,  // Predicted Negative, Actual Positive (Type II error)
    trueNegative: 10,  // Predicted Negative, Actual Negative
  };

  const currentData = data || placeholderData;

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-xl border border-cyan-500 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">Classification Results</h3>
      <div className="grid grid-cols-3 gap-1 text-center">
        {/* Headers */}
        <div></div> {/* Empty corner */}
        <div className="font-semibold text-lime-400">Predicted Positive</div>
        <div className="font-semibold text-pink-400">Predicted Negative</div>

        {/* Row 1: Actual Positive */}
        <div className="font-semibold text-lime-400 self-center">Actual Positive</div>
        <div className="p-3 bg-gray-700 rounded">
          <div className="text-sm text-gray-400">True Positive</div>
          <div className="text-2xl font-bold text-lime-300">{currentData.truePositive}</div>
        </div>
        <div className="p-3 bg-gray-700 rounded">
          <div className="text-sm text-gray-400">False Negative</div>
          <div className="text-2xl font-bold text-pink-300">{currentData.falseNegative}</div>
        </div>

        {/* Row 2: Actual Negative */}
        <div className="font-semibold text-pink-400 self-center">Actual Negative</div>
        <div className="p-3 bg-gray-700 rounded">
          <div className="text-sm text-gray-400">False Positive</div>
          <div className="text-2xl font-bold text-pink-300">{currentData.falsePositive}</div>
        </div>
        <div className="p-3 bg-gray-700 rounded">
          <div className="text-sm text-gray-400">True Negative</div>
          <div className="text-2xl font-bold text-lime-300">{currentData.trueNegative}</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        (This is a placeholder with static data)
      </p>
    </div>
  );
};

export default ConfusionMatrixPanel;
