import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { EventDetailPage } from './pages/EventDetailPage.jsx';
import { EventFormPage } from './pages/EventFormPage.jsx';
import { EventsPage } from './pages/EventsPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export const App = () => <Routes>
  <Route element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="events" element={<EventsPage />} />
    <Route path="events/:id" element={<EventDetailPage />} />
    <Route path="events/new" element={<ProtectedRoute><EventFormPage /></ProtectedRoute>} />
    <Route path="auth" element={<AuthPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>;
