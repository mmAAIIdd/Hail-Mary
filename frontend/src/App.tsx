import { useState, useEffect } from 'react';
import { UserProfile } from './types/profile';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingView } from './components/landing/LandingView';
import { Questionnaire } from './components/profile/Questionnaire';
import { DiagnosisView } from './components/diagnosis/DiagnosisView';
import { MyUniversitiesView } from './components/planner/MyUniversitiesView';
import { InfoView } from './components/info/InfoView';
import {
  loadStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
} from './lib/storage';
import { clearAdmissionsPlan } from './lib/admissionsStorage';
import { clearAdmissionsHistory } from './lib/admissionsHistory';
import { clearPlannerState, getNextPlannerReminder, PLANNER_UPDATED_EVENT } from './lib/plannerStorage';
import { PlannerReminder } from './types/planner';

type ActiveTab = 'landing' | 'profile' | 'diagnosis' | 'planner' | 'about' | 'resources';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(() => loadStoredProfile());
  const [reminder, setReminder] = useState<PlannerReminder | null>(() => profile ? getNextPlannerReminder(profile.id) : null);

  useEffect(() => {
    if (profile) {
      saveStoredProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    const refreshReminder = () => setReminder(profile ? getNextPlannerReminder(profile.id) : null);
    refreshReminder();
    window.addEventListener(PLANNER_UPDATED_EVENT, refreshReminder);
    return () => window.removeEventListener(PLANNER_UPDATED_EVENT, refreshReminder);
  }, [profile]);

  useEffect(() => {
    const pageNames: Record<ActiveTab, string> = {
      landing: 'Главная',
      profile: 'Анкета',
      diagnosis: 'Рекомендации',
      planner: 'Мои университеты',
      about: 'О нас',
      resources: 'Ресурсы',
    };
    document.title = `${pageNames[activeTab]} — Hail Mary`;
  }, [activeTab]);

  const handleProfileComplete = (completedProfile: UserProfile) => {
    clearAdmissionsPlan();
    setProfile(completedProfile);
    saveStoredProfile(completedProfile);
    setActiveTab('diagnosis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddContext = (context: string) => {
    if (!profile) return;
    const updatedProfile = { ...profile, additional_context: context, updated_at: new Date().toISOString() };
    clearAdmissionsPlan();
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (window.confirm('Сбросить текущий профиль и начать заново?')) {
      clearStoredProfile();
      clearAdmissionsPlan();
      clearAdmissionsHistory();
      if (profile) clearPlannerState(profile.id);
      setProfile(null);
      setActiveTab('landing');
    }
  };

  return (
    <div className="app-shell min-h-screen flex flex-col bg-paper text-ink">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onReset={handleReset}
      />

      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingView
            onStartQuestionnaire={() => {
              setActiveTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            reminder={reminder}
            onOpenPlanner={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'profile' && (
          <Questionnaire
            initialProfile={profile}
            onComplete={handleProfileComplete}
          />
        )}

        {activeTab === 'diagnosis' && (
          profile ? (
            <DiagnosisView
              profile={profile}
              onAddContext={handleAddContext}
              onEditProfile={() => {
                setActiveTab('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Анкета еще не заполнена
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Для персональной стратегии поступления сначала заполните короткую анкету.
              </p>
              <button
                onClick={() => setActiveTab('profile')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
              >
                Перейти к заполнению анкеты
              </button>
            </div>
          )
        )}

        {activeTab === 'planner' && profile && (
          <MyUniversitiesView profile={profile} onGoToRecommendations={() => {
            setActiveTab('diagnosis');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}

        {activeTab === 'about' && <InfoView section="about" onStartQuestionnaire={() => setActiveTab('profile')} />}
        {activeTab === 'resources' && <InfoView section="resources" onStartQuestionnaire={() => setActiveTab('profile')} />}
      </main>

      {activeTab !== 'landing' && <Footer />}
    </div>
  );
}

export default App;
