import React, { useState, useEffect } from 'react';

// Sacred Decision Tree Data
const DECISION_SCENARIOS = [
  {
    id: 'crystal_classification',
    title: 'Crystal Classification Oracle',
    rootQuestion: 'What type of energy crystal approaches?',
    tree: {
      question: 'Is the crystal glowing?',
      yes: {
        question: 'What color is the glow?',
        yes: { 
          question: 'Is it pulsing rapidly?',
          yes: { result: 'Temporal Crystal', confidence: 0.95, power: 'Time Manipulation' },
          no: { result: 'Wisdom Crystal', confidence: 0.88, power: 'Knowledge Enhancement' }
        },
        no: { 
          question: 'Does it emit heat?',
          yes: { result: 'Fire Crystal', confidence: 0.92, power: 'Energy Amplification' },
          no: { result: 'Void Crystal', confidence: 0.85, power: 'Reality Bending' }
        }
      },
      no: {
        question: 'Is it vibrating?',
        yes: {
          question: 'High or low frequency?',
          yes: { result: 'Harmony Crystal', confidence: 0.87, power: 'Sound Manipulation' },
          no: { result: 'Earth Crystal', confidence: 0.91, power: 'Matter Control' }
        },
        no: { result: 'Null Crystal', confidence: 0.79, power: 'Unknown Properties' }
      }
    }
  },
  {
    id: 'path_selection',
    title: 'Sacred Path Navigator',
    rootQuestion: 'Which mystical path leads to enlightenment?',
    tree: {
      question: 'Do you seek power or wisdom?',
      yes: { 
        question: 'Through creation or destruction?',
        yes: { 
          question: 'Building worlds or healing souls?',
          yes: { result: 'Architect of Realities', confidence: 0.93, power: 'World Creation' },
          no: { result: 'Guardian of Life', confidence: 0.89, power: 'Healing Mastery' }
        },
        no: { 
          question: 'Breaking chains or barriers?',
          yes: { result: 'Liberator of Minds', confidence: 0.86, power: 'Freedom Granting' },
          no: { result: 'Breaker of Limits', confidence: 0.91, power: 'Boundary Destruction' }
        }
      },
      no: { 
        question: 'Ancient knowledge or future sight?',
        yes: { 
          question: 'Forgotten languages or lost technologies?',
          yes: { result: 'Keeper of Words', confidence: 0.88, power: 'Universal Translation' },
          no: { result: 'Master of Artifacts', confidence: 0.92, power: 'Sacred Technology' }
        },
        no: { 
          result: 'Oracle of Tomorrow', confidence: 0.94, power: 'Prophetic Vision' 
        }
      }
    }
  }
];

interface DecisionNode {
  question?: string;
  result?: string;
  confidence?: number;
  power?: string;
  yes?: DecisionNode;
  no?: DecisionNode;
}

interface DecisionHistory {
  question: string;
  choice: string;
  confidence: number;
}

// Main Decision Tree Game Component
const DecisionTreeGame: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<DecisionNode | null>(null);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [decisionHistory, setDecisionHistory] = useState<DecisionHistory[]>([]);
  const [confidence, setConfidence] = useState(1.0);

  useEffect(() => {
    setCurrentNode(DECISION_SCENARIOS[currentScenario].tree);
    setCurrentPath(['root']);
    setDecisionHistory([]);
    setConfidence(1.0);
  }, [currentScenario]);

  const makeDecision = (choice: 'yes' | 'no') => {
    if (!currentNode || gameState !== 'playing' || !currentNode.question) return;

    const nextNode = choice === 'yes' ? currentNode.yes : currentNode.no;
    if (!nextNode) return;

    const newPath = [...currentPath, choice];
    const newHistory = [...decisionHistory, {
      question: currentNode.question,
      choice: choice,
      confidence: Math.random() * 0.1 + 0.85 // Simulate AI confidence
    }];

    setCurrentPath(newPath);
    setDecisionHistory(newHistory);
    
    if (nextNode.result) {
      // Reached a leaf node (result)
      setCurrentNode(nextNode);
      setGameState('result');
      setConfidence(nextNode.confidence || 0.8);
    } else {
      // Continue with next question
      setCurrentNode(nextNode);
      setConfidence(confidence * (Math.random() * 0.1 + 0.9));
    }
  };

  const resetGame = () => {
    setCurrentScenario((prev) => (prev + 1) % DECISION_SCENARIOS.length);
    setGameState('intro');
  };

  const startGame = () => {
    setGameState('playing');
  };

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 font-orbitron">
            DECISION TREES
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Sacred Chamber of Binary Wisdom
          </p>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30 mb-8">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">
              {DECISION_SCENARIOS[currentScenario].title}
            </h3>
            <p className="text-slate-300">
              {DECISION_SCENARIOS[currentScenario].rootQuestion}
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
          >
            Begin Sacred Classification
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-3xl">🔮</span>
            </div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
              {currentNode?.result}
            </h2>
            <p className="text-xl text-slate-300 mb-4">
              Sacred Power: {currentNode?.power}
            </p>
            <div className="text-lg text-cyan-400">
              Confidence: {(confidence * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30 mb-8">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              Decision Path Analysis
            </h3>
            <div className="space-y-2">
              {decisionHistory.map((decision, index) => (
                <div key={index} className="text-sm text-slate-300 text-left">
                  <span className="text-cyan-400">Q:</span> {decision.question}
                  <br />
                  <span className="text-yellow-400">A:</span> {decision.choice === 'yes' ? 'Yes' : 'No'} 
                  <span className="text-slate-500 ml-2">
                    ({(decision.confidence * 100).toFixed(1)}% confidence)
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Explore Next Oracle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sacred Visualization */}
      <div className="h-2/3 flex items-center justify-center p-8">
        <div className="text-center">
          {/* Sacred Tree Visualization */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center mb-4 animate-pulse">
              <span className="text-4xl">🌳</span>
            </div>
            <div className="text-cyan-400 text-sm">
              Path: {currentPath.join(' → ')}
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < decisionHistory.length
                    ? 'bg-cyan-400'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Decision Interface */}
      <div className="h-1/3 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-cyan-400 mb-2">
                Sacred Query
              </h3>
              <p className="text-lg text-slate-300">
                {currentNode?.question}
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => makeDecision('yes')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-green-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                Yes / True
              </button>
              <button
                onClick={() => makeDecision('no')}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-purple-500 text-white font-semibold rounded-lg hover:from-red-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                No / False
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <div className="text-sm text-slate-400">
                Confidence: {(confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionTreeGame;