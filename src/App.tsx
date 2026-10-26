import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PrefsProvider } from '@/components/PrefsProvider';
import { ProgressProvider } from '@/lib/useProgress';
import { hasOnboarded } from '@/lib/prefs';
import AppLayout from '@/components/AppLayout';
import Landing from '@/pages/Landing';
import Onboarding from '@/pages/Onboarding';
import Home from '@/pages/Home';
import Lesson from '@/pages/Lesson';
import Roleplay from '@/pages/Roleplay';
import Speaking from '@/pages/Speaking';
import Revision from '@/pages/Revision';
import Progress from '@/pages/Progress';
import Appendix from '@/pages/Appendix';

function GateOnboarding({ children }: { children: React.ReactNode }) {
  // If they haven't onboarded, route to onboarding first.
  return hasOnboarded() ? <>{children}</> : <Navigate to="/onboarding" replace />;
}

export default function App() {
  return (
    <PrefsProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/appendix" element={<Appendix />} />
            <Route
              path="/app"
              element={
                <GateOnboarding>
                  <AppLayout />
                </GateOnboarding>
              }
            >
              <Route index element={<Home />} />
              <Route path="lesson/:slug" element={<Lesson />} />
              <Route path="roleplay/:slug" element={<Roleplay />} />
              <Route path="speaking/:slug" element={<Speaking />} />
              <Route path="revision" element={<Revision />} />
              <Route path="progress" element={<Progress />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </PrefsProvider>
  );
}
