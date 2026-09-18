import { useState, useEffect } from 'react';
import { UserProfile } from './types/profile';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingView } from './components/landing/LandingView';
import { Questionnaire } from './components/profile/Questionnaire';
import { DiagnosisView } from './components/diagnosis/DiagnosisView';
import {
  loadStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
} from './lib/storage';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'profile' | 'diagnosis'>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(() => loadStoredProfile());

  useEffect(() => {
    // If profile exists on load and user refreshed on diagnosis, stay there
    if (profile) {
      saveStoredProfile(profile);
    }
  }, [profile]);

  const handleProfileComplete = (completedProfile: UserProfile) => {
    setProfile(completedProfile);
    saveStoredProfile(completedProfile);
    setActiveTab('diagnosis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (window.confirm('Сбросить текущий профиль и начать заново?')) {
      clearStoredProfile();
      setProfile(null);
      setActiveTab('landing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
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
                Для построения индивидуальной диагностики сначала расскажите о ваших оценках, экзаменах и целях.
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
      </main>

      {activeTab !== 'landing' && <Footer />}
    </div>
  );
}

export default App;
