import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface EthicsPoints {
  fairness: number;
  privacy: number;
  transparency: number;
}

interface Choice {
  text: string;
  next: number;
  ethics: keyof EthicsPoints;
  explanation: string;
}

interface Scenario {
  title: string;
  story: string;
  choices: Choice[];
}

const EthicsFramework: React.FC = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [ethicsPoints, setEthicsPoints] = useState<EthicsPoints>({
    fairness: 0,
    privacy: 0,
    transparency: 0
  });
  const [showExplanation, setShowExplanation] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);

  const scenarios: Scenario[] = [
    {
      title: "🌟 The Awakening",
      story: `Welcome, young Digital Guardian! You've been chosen to protect the cyber realm where AI systems help millions of people every day. 
      
      Your first mission begins in the city of Algorithmia, where an AI system called ARIA (Artificial Reasoning and Intelligence Assistant) helps students with their homework. But something strange is happening...
      
      Some students are getting much better help than others, and it's causing problems at school. As a Digital Guardian, it's your job to investigate and make sure AI is being fair to everyone.`,
      choices: [
        {
          text: "🔍 Investigate why some students get better help than others",
          next: 1,
          ethics: "fairness",
          explanation: "Great choice! **Fairness** in AI means ensuring equal treatment for all users. By investigating disparities, you're practicing algorithmic fairness - making sure AI doesn't accidentally favor some groups over others."
        },
        {
          text: "📊 Check what data ARIA is using to help students",
          next: 2,
          ethics: "transparency",
          explanation: "Excellent thinking! **Transparency** means understanding how AI systems work. When we know what data an AI uses, we can better understand its decisions and spot potential problems."
        }
      ]
    },
    {
      title: "🔍 The Fairness Investigation",
      story: `You discover that ARIA gives more detailed help to students from certain schools. The AI learned from data that included school ratings, and now it assumes students from "better" schools need more advanced help.
      
      This isn't fair! A student's potential shouldn't be judged by their school. You find three students affected: Maya (needs help with math), Alex (struggling with science), and Jordan (working on a creative writing project).
      
      How should you fix this bias?`,
      choices: [
        {
          text: "🎯 Retrain ARIA to ignore school data and focus only on the actual question",
          next: 3,
          ethics: "fairness",
          explanation: "Perfect! This demonstrates **bias mitigation** - removing unfair factors from AI decision-making. By focusing on the actual question rather than irrelevant school data, ARIA can help all students equally."
        },
        {
          text: "📋 Create a feedback system so students can report unfair treatment",
          next: 4,
          ethics: "transparency",
          explanation: "Smart approach! This creates **accountability mechanisms** - ways for people to report problems and understand AI decisions. Feedback systems help catch bias that developers might miss."
        }
      ]
    },
    {
      title: "📊 The Data Detective",
      story: `You dive into ARIA's data sources and discover something concerning: the AI has access to students' browsing history, family income data, and even their parents' education levels!
      
      While this might help ARIA give personalized advice, it's also very private information. Some students don't even know their data is being used this way.
      
      You meet Sam, a student who's worried about their privacy, and Riley, who wants the best possible help even if it means sharing more data.`,
      choices: [
        {
          text: "🔒 Implement strong privacy controls and get clear consent from students",
          next: 5,
          ethics: "privacy",
          explanation: "Excellent! **Privacy by design** means building systems that protect personal information from the start. Clear consent ensures people understand and agree to how their data is used."
        },
        {
          text: "🔍 Make the data usage completely transparent so students know exactly what's being used",
          next: 6,
          ethics: "transparency",
          explanation: "Great thinking! **Data transparency** means clearly explaining what information is collected and how it's used. This empowers people to make informed decisions about their privacy."
        }
      ]
    },
    {
      title: "🏆 The Master Guardian",
      story: `Congratulations, Digital Guardian! Through your journey, you've learned to balance the three pillars of AI ethics:
      
      🛡️ **Fairness**: Ensuring AI treats everyone equally and doesn't perpetuate bias
      🔒 **Privacy**: Protecting people's personal information and giving them control
      ⚖️ **Transparency**: Making AI decisions understandable and accountable
      
      Your final challenge: A new AI system is being developed that could help predict and prevent cyberbullying in schools. It would analyze chat messages and social media posts to identify potential problems before they escalate.
      
      This could protect students, but it also raises serious questions about privacy and fairness. As a Master Guardian, how do you approach this complex ethical dilemma?`,
      choices: [
        {
          text: "🌟 Convene a council of students, parents, teachers, and experts to design ethical guidelines together",
          next: -1,
          ethics: "fairness",
          explanation: "Outstanding! **Participatory design** involves all stakeholders in making ethical decisions. This ensures diverse perspectives and builds systems that serve everyone's interests fairly."
        },
        {
          text: "⚖️ Develop a comprehensive ethical framework that can be applied to future AI systems",
          next: -1,
          ethics: "transparency",
          explanation: "Exceptional thinking! **Ethical frameworks** provide systematic approaches to complex problems. Creating reusable guidelines helps ensure consistent ethical consideration across different AI applications."
        }
      ]
    }
  ];

  const makeChoice = (choiceIndex: number) => {
    const scenario = scenarios[currentScenario];
    const choice = scenario.choices[choiceIndex];
    
    // Award ethics points
    setEthicsPoints(prev => ({
      ...prev,
      [choice.ethics]: prev[choice.ethics] + 1
    }));
    
    // Show explanation
    setShowExplanation(choice.explanation);
    
    // Move to next scenario after delay
    setTimeout(() => {
      setShowExplanation('');
      if (choice.next === -1 || choice.next >= scenarios.length) {
        setIsComplete(true);
      } else {
        setCurrentScenario(choice.next);
      }
    }, 3000);
  };

  const restart = () => {
    setCurrentScenario(0);
    setEthicsPoints({ fairness: 0, privacy: 0, transparency: 0 });
    setShowExplanation('');
    setIsComplete(false);
  };

  const getProgress = () => {
    return Math.min((currentScenario / (scenarios.length - 1)) * 100, 100);
  };

  const getTotalPoints = () => {
    return ethicsPoints.fairness + ethicsPoints.privacy + ethicsPoints.transparency;
  };

  const getTitle = () => {
    const total = getTotalPoints();
    if (total >= 8) return "🌟 Master Digital Guardian";
    if (total >= 5) return "⚡ Advanced Digital Guardian";
    if (total >= 3) return "🛡️ Skilled Digital Guardian";
    return "Digital Guardian";
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-void-black via-[#1a0a2e] to-void-black">
        {/* Sacred Background */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-axis-x/20 via-axis-y/20 to-axis-z/20 animate-pulse" />
        </div>

        {/* Sacred Wireframes */}
        <div className="fixed top-[10%] right-[5%] w-24 h-24 border border-axis-x/20 animate-float pointer-events-none" />
        <div className="fixed bottom-[15%] left-[8%] w-24 h-24 border border-axis-y/20 animate-float-reverse pointer-events-none" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8 p-8 bg-gradient-to-r from-axis-x/10 to-axis-y/10 border border-axis-x/30 rounded-2xl backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-node-core mb-4 glow-text">
              The Digital Guardian's Quest
            </h1>
            <p className="text-xl text-sacred-text mb-6">
              An Interactive Journey Through AI Ethics
            </p>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-axis-x via-axis-y to-axis-z transition-all duration-500"
                style={{ width: '100%' }}
              />
            </div>
            
            {/* Ethics Counters */}
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="bg-gradient-to-r from-axis-y to-axis-x px-4 py-2 rounded-full font-bold">
                🛡️ Fairness: {ethicsPoints.fairness}
              </div>
              <div className="bg-gradient-to-r from-axis-y to-axis-x px-4 py-2 rounded-full font-bold">
                🔒 Privacy: {ethicsPoints.privacy}
              </div>
              <div className="bg-gradient-to-r from-axis-y to-axis-x px-4 py-2 rounded-full font-bold">
                ⚖️ Transparency: {ethicsPoints.transparency}
              </div>
            </div>
          </div>

          {/* Completion Card */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-void-black/90 to-[#1a0a2e]/80 border border-axis-y/30 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
            <div className="text-center p-8 bg-gradient-to-r from-node-core/20 to-axis-y/20 rounded-2xl">
              <h2 className="text-3xl font-bold text-axis-x mb-6">{getTitle()}</h2>
              <div className="text-lg text-sacred-text space-y-4">
                <p><strong>Quest completed! You've mastered the art of AI ethics.</strong></p>
                <p>Through your choices, you've learned that AI ethics isn't about finding perfect solutions, but about carefully balancing different values:</p>
                <ul className="text-left max-w-2xl mx-auto space-y-2 mt-6">
                  <li><span className="text-node-core font-bold">Fairness</span> ensures AI treats everyone equally</li>
                  <li><span className="text-node-core font-bold">Privacy</span> protects people's personal information</li>
                  <li><span className="text-node-core font-bold">Transparency</span> makes AI decisions understandable</li>
                </ul>
                <p className="mt-6">Real AI systems face these challenges every day. By understanding these principles now, you're prepared to build a better digital future!</p>
              </div>
              
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={restart}
                  className="bg-gradient-to-r from-axis-z to-node-core text-void-black px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  🔄 Begin New Quest
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-axis-x to-axis-y text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  🏠 Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];

  return (
    <div className="min-h-screen bg-gradient-to-br from-void-black via-[#1a0a2e] to-void-black">
      {/* Sacred Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] border-2 border-axis-x rounded-full animate-spin-slow" />
        <div className="absolute top-1/3 right-1/3 w-[200px] h-[200px] border-2 border-axis-y rounded-full animate-spin-reverse scale-75" />
        <div className="absolute bottom-1/4 left-1/2 w-[120px] h-[120px] border-2 border-axis-z rounded-full animate-spin-slow scale-50" />
      </div>

      {/* Sacred Wireframes */}
      <div className="fixed top-[10%] right-[5%] w-24 h-24 border border-axis-x/20 animate-float pointer-events-none" />
      <div className="fixed bottom-[15%] left-[8%] w-24 h-24 border border-axis-y/20 animate-float-reverse pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 p-8 bg-gradient-to-r from-axis-x/10 to-axis-y/10 border border-axis-x/30 rounded-2xl backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-node-core mb-4 glow-text">
            The Digital Guardian's Quest
          </h1>
          <p className="text-xl text-sacred-text mb-6">
            An Interactive Journey Through AI Ethics
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-axis-x via-axis-y to-axis-z transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          
          {/* Ethics Counters */}
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-gradient-to-r from-axis-y to-axis-x px-4 py-2 rounded-full font-bold">
              🛡️ Fairness: {ethicsPoints.fairness}
            </div>
            <div className="bg-gradient-to-r from-axis-y to-axis-x px-4 py-2 rounded-full font-bold">
              🔒 Privacy: {ethicsPoints.privacy}
            </div>
            <div className="bg-gradient-to-r from-axis-y to-axis-x px-4 py-2 rounded-full font-bold">
              ⚖️ Transparency: {ethicsPoints.transparency}
            </div>
          </div>
        </div>

        {/* Story Card */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-void-black/90 to-[#1a0a2e]/80 border border-axis-y/30 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-2xl font-bold text-axis-x mb-6 text-center">{scenario.title}</h2>
          
          <div className="text-lg text-sacred-text leading-relaxed mb-8 whitespace-pre-line">
            {scenario.story}
          </div>

          {!showExplanation && (
            <div className="space-y-4">
              {scenario.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => makeChoice(index)}
                  className="w-full p-6 bg-gradient-to-r from-axis-x/20 to-axis-y/20 border-2 border-transparent rounded-xl text-left text-sacred-text hover:border-axis-x hover:bg-axis-x/30 hover:shadow-lg hover:shadow-axis-x/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <span className="relative z-10">{choice.text}</span>
                </button>
              ))}
            </div>
          )}

          {showExplanation && (
            <div className="bg-gradient-to-r from-node-core/10 to-axis-z/10 border border-node-core rounded-xl p-6">
              <h3 className="text-xl font-bold text-node-core mb-4">🧠 Ethics Insight</h3>
              <div 
                className="text-sacred-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: showExplanation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-node-core">$1</strong>') }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-axis-x to-axis-y text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg"
          >
            🏠 Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EthicsFramework;