import { useState, useEffect } from 'react';
import { UserProfile } from './types/profile';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingView } from './components/landing/LandingView';
import { Questionnaire } from './components/profile/Questionnaire';
import { DiagnosisView } from './components/diagnosis/DiagnosisView';
import { InfoView } from './components/info/InfoView';
import {
  loadStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
} from './lib/storage';
import { clearAdmissionsPlan } from './lib/admissionsStorage';
import { clearAdmissionsHistory } from './lib/admissionsHistory';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'profile' | 'diagnosis' | 'about' | 'resources'>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(() => loadStoredProfile());

  useEffect(() => {
    if (profile) {
      saveStoredProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    const pageNames = { landing: 'Главная', profile: 'Анкета', diagnosis: 'Рекомендации', about: 'О нас', resources: 'Ресурсы' };
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

        {activeTab === 'about' && <InfoView section="about" onStartQuestionnaire={() => setActiveTab('profile')} />}
        {activeTab === 'resources' && <InfoView section="resources" onStartQuestionnaire={() => setActiveTab('profile')} />}
      </main>

      {activeTab !== 'landing' && <Footer />}
    </div>
  );
}

export default App;
