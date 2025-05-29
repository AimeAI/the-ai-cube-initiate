import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle'; // Assuming this component exists
import { MythButton } from '@/components/myth/MythButton';
import { MythCard } from '@/components/myth/MythCard';

interface ParentDashboardData {
  studentName: string;
  overallProgress: number;
  recentActivity: Array<{
    date: string;
    activity: string;
    game: string;
  }>;
  cognitiveSkills: Array<{
    skill: string;
    level: number;
  }>;
}

const ParentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null);

  useEffect(() => {
    // Simulate fetching data from localStorage
    const storedData = localStorage.getItem('parentDashboardData');
    if (storedData) {
      setDashboardData(JSON.parse(storedData));
    } else {
      // Mock data if nothing in localStorage
      const mockData: ParentDashboardData = {
        studentName: 'Alex Doe',
        overallProgress: 75, // Percentage
        recentActivity: [
          { date: '2025-05-28', activity: 'Completed Level 5', game: 'Logic Puzzles' },
          { date: '2025-05-27', activity: 'Earned Spatial Reasoning Badge', game: 'Pattern Master' },
          { date: '2025-05-26', activity: 'Played for 30 minutes', game: 'Snake3' },
        ],
        cognitiveSkills: [
          { skill: 'Logic', level: 4 },
          { skill: 'Pattern Recognition', level: 5 },
          { skill: 'Spatial Reasoning', level: 3 },
        ],
      };
      localStorage.setItem('parentDashboardData', JSON.stringify(mockData));
      setDashboardData(mockData);
    }
  }, []);

  if (!dashboardData) {
    return <div className="text-myth-textPrimary">{t('loading')}...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-myth-background text-myth-textPrimary min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-orbitron font-bold text-myth-accent">{t('parentDashboard.title')}</h1>
        <MythButton
          label={t('parentDashboard.returnToMainPage')}
          onClick={() => navigate('/')}
          className="text-myth-accent border border-myth-accent hover:bg-myth-accent/10"
        />
      </div>

      <div className="mb-6">
        <LanguageToggle />
      </div>

      <MythCard title={t('parentDashboard.progressSummaryFor', { name: dashboardData.studentName })} className="mb-6">
        <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-myth-accent"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <span className="text-myth-textPrimary">{t('parentDashboard.overallProgress')}: {dashboardData.overallProgress}%</span>
        </div>
        {dashboardData.overallProgress > 0 ? (
          <div className="w-full bg-myth-warning/30 rounded-full h-4 dark:bg-myth-warning/50 mt-2">
            <div
              className="bg-myth-accent h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${dashboardData.overallProgress}%` }}
            ></div>
          </div>
        ) : (
          <p className="text-myth-textSecondary">{t('parentDashboard.progressNotStarted')}</p>
        )}
      </MythCard>

      <MythCard title={t('parentDashboard.recentActivity')} className="mb-6">
        {dashboardData.recentActivity.length > 0 ? (
          <ul className="space-y-3">
            {dashboardData.recentActivity.map((item, index) => (
              <li key={index} className="p-3 border-b border-myth-border last:border-b-0">
                <strong className="text-myth-textPrimary">{item.date}:</strong>
                <span className="text-myth-textSecondary ml-2">{item.activity} ({t('parentDashboard.game')}: {item.game})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-myth-textSecondary">{t('parentDashboard.noRecentActivity')}</p>
        )}
      </MythCard>

      <MythCard title={t('parentDashboard.cognitiveSkillsSummary')} className="mb-6">
        {dashboardData.cognitiveSkills.length > 0 ? (
          <ul className="space-y-2">
            {dashboardData.cognitiveSkills.map((skillItem, index) => (
              <li key={index}>
                <span className="font-medium text-myth-textPrimary">{t(`cognitiveSkills.${skillItem.skill.toLowerCase().replace(' ', '')}`, skillItem.skill)}:</span>
                <span className="text-myth-textSecondary ml-2">
                  {skillItem.level > 0 ? `${t('parentDashboard.level')} ${skillItem.level}` : t('parentDashboard.skillNotStarted')}
                </span>
              </li>
            ))}
          </ul>
        ) : (
           <p className="text-myth-textSecondary">{t('parentDashboard.noCognitiveSkillsTracked')}</p>
        )}
      </MythCard>
    </div>
  );
};

export default ParentDashboard;