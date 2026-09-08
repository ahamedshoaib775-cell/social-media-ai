import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CalendarView } from './components/calendar/CalendarView';
import { AiGeneratorView } from './components/generator/AiGeneratorView';
import { MediaLibraryView } from './components/media/MediaLibraryView';
import { ScheduledPostsView } from './components/scheduler/ScheduledPostsView';
import { SocialAccountsView } from './components/social/SocialAccountsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { BusinessProfileView } from './components/settings/BusinessProfileView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const { currentView } = useApp();

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'onboarding') {
    return <OnboardingWizard />;
  }

  return (
    <AppLayout>
      {currentView === 'dashboard' && <DashboardOverview />}
      {currentView === 'calendar' && <CalendarView />}
      {currentView === 'generator' && <AiGeneratorView />}
      {currentView === 'media' && <MediaLibraryView />}
      {currentView === 'scheduled' && <ScheduledPostsView />}
      {currentView === 'analytics' && <AnalyticsView />}
      {currentView === 'profile' && <BusinessProfileView />}
      {currentView === 'social' && <SocialAccountsView />}
      {currentView === 'settings' && <SettingsView />}
    </AppLayout>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
