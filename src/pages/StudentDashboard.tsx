import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';
import { MythTechTheme } from '@/styles/theme'; // Import MythTechTheme
import { Badge } from '@/components/ui/badge';
import { Brain, Gamepad2 } from 'lucide-react'; // Adjusted icons
import { games as allGamesData, Game as GameConfig } from '@/games'; // Import new games data
import GameCard from '@/components/GameCard'; // Replaced MythGameCard with GameCard
import { MythProgressModal } from '@/components/myth/MythProgressModal'; // Import the new modal

// Interface for cognitive skills, to be potentially fetched from Supabase
interface CognitiveSkill {
  skillName: string;
  badgeEarned: boolean;
  level?: number;
  description: string;
}

// Interface for data displayed on the dashboard, prepared for Supabase integration
interface StudentDisplayData {
  studentName: string; // Will come from Supabase auth/profile
  cognitiveSkills: CognitiveSkill[]; // Will come from Supabase profile/progress
  motivationalMessage: string; // Could be dynamic or static
}

const StudentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Placeholder state, to be replaced with Supabase data fetching
  const [displayData, setDisplayData] = useState<StudentDisplayData | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false); // State for modal

  useEffect(() => {
    // Simulate fetching data - replace with actual Supabase calls
    // For now, using placeholder data to structure the page
    const mockDisplayData: StudentDisplayData = {
      studentName: 'Student User', // Placeholder for Supabase integration
      cognitiveSkills: [
        { skillName: 'Logic', badgeEarned: true, level: 3, description: 'Earned by solving complex puzzles.' },
        { skillName: 'Pattern Recognition', badgeEarned: true, level: 2, description: 'Mastered identifying and predicting sequences.' },
        { skillName: 'Spatial Reasoning', badgeEarned: false, level: 0, description: 'Develops understanding of objects in 2D and 3D space.' },
        { skillName: 'Problem Solving', badgeEarned: true, level: 1, description: 'Achieved through overcoming various game challenges.' },
      ],
      motivationalMessage: 'Embark on your learning journey and unlock new skills!', // Placeholder
    };
    setDisplayData(mockDisplayData);
    // NOTE: localStorage logic removed to prepare for Supabase
  }, []);

  if (!displayData) {
    return <div className="flex justify-center items-center h-screen text-xl text-myth-textPrimary">{t('loading')}...</div>; // Enhanced loading
  }

  return (
    <div className="container mx-auto p-4 bg-myth-background text-myth-textPrimary min-h-screen">
      <div className="flex justify-between items-center mb-8"> {/* Increased margin */}
        <h1 className="text-3xl uppercase font-orbitron font-bold text-myth-accent">{t('studentDashboard.title', { name: displayData.studentName })}</h1>
        <MythButton
          label={t('studentDashboard.returnToMainPage', 'RETURN TO MAIN PAGE')}
          onClick={() => navigate('/')}
          // Ensuring button style aligns with sacred visual system
          className="border-myth-accent text-myth-accent hover:bg-myth-accent/10 hover:shadow-glow"
        />
      </div>

      {/* Responsive Game Grid Section */}
      <section className="mb-12"> {/* Increased margin */}
        <h2 className="text-2xl uppercase font-orbitron font-semibold text-myth-accent mb-6 flex items-center">
          <Gamepad2 className="mr-3 h-7 w-7 text-myth-secondary" /> {t('studentDashboard.gamesHub', 'EXPLORE OUR GAMES')}
        </h2>
        {allGamesData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {/* Increased gap */}
            {allGamesData.map((game: GameConfig) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-myth-textSecondary">{t('studentDashboard.noGamesAvailable', 'No games available at the moment. Check back soon!')}</p>
        )}
      </section>

      {/* Achievements and Earned Skills Section (Cognitive Skills) */}
      <div className="mb-12"> {/* Wrapper for margin */}
        <MythCard title={t('studentDashboard.cognitiveSkillsEarned', 'ACHIEVEMENTS & EARNED SKILLS')}>
          <div className="flex items-center mb-4"> {/* Increased margin */}
            <Brain className="mr-3 h-7 w-7 text-myth-accent" /> {/* Increased size and margin */}
          </div>
          {displayData.cognitiveSkills.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {displayData.cognitiveSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant={'outline'} // Base variant, specific styling via className
                  className={`p-3 text-md transition-all duration-300 ease-in-out rounded-lg font-mono uppercase tracking-wider
                    border hover:shadow-glow
                    ${skill.badgeEarned
                      ? 'bg-myth-positive/10 text-myth-positive border-myth-positive hover:bg-myth-positive/20 hover:shadow-myth-positive/40' // Quantum Growth (positive) - adjusted opacity
                      : skill.level && skill.level > 0
                        ? 'bg-myth-accent/10 text-myth-accent border-myth-accent hover:bg-myth-accent/20 hover:shadow-myth-accent/40'    // Neon Cyan (accent) - adjusted opacity
                        : 'bg-myth-surface/50 text-myth-textSecondary border-myth-border hover:bg-myth-surface/70 hover:shadow-myth-border/30' // Faded Wisdom / Panel (default/not started)
                    }`}
                  title={t(skill.description)}
                >
                  {t(`cognitiveSkills.${skill.skillName.toLowerCase().replace(/\s+/g, '')}`, skill.skillName).toUpperCase()} {/* Ensured skill name is uppercase */}
                  {skill.badgeEarned && ` (${t('studentDashboard.earned', 'EARNED')})`}
                  {!skill.badgeEarned && skill.level && skill.level > 0 && ` (LVL ${skill.level})`}
                  {!skill.badgeEarned && (!skill.level || skill.level === 0) && ` (${t('studentDashboard.notStartedSkill', 'NOT STARTED')})`}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-myth-textSecondary">{t('studentDashboard.noSkillsTracked', 'No skills tracked yet. Play some games to earn them!')}</p>
          )}
        </MythCard>
      </div>

      {/* Motivational Message */}
      <div className="text-center mt-10 p-8 bg-gradient-to-br from-myth-surface via-myth-secondary/20 to-myth-accent/20 rounded-xl shadow-glow backdrop-blur-md border border-myth-accent/40"> {/* Enhanced border and gradient */}
        <p className="text-2xl italic font-orbitron text-myth-accent drop-shadow-md" style={{ textShadow: `0 0 20px ${MythTechTheme.colors.accent}` }}> {/* Adjusted glow radius to 20px */}
          {t(displayData.motivationalMessage, displayData.motivationalMessage)}
        </p>
      </div>

      {/* Button to test Progress Modal */}
      <div className="my-8 text-center">
        <MythButton
          label="Open Progress Modal"
          onClick={() => setIsProgressModalOpen(true)}
        />
      </div>

      <MythProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        title="System Update"
        message="Recalibrating quantum pathways... Please stand by."
        progress={67}
        layoutId="student-dashboard-progress"
      />
    </div>
  );
};

export default StudentDashboard;