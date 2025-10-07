import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import AlgorithmVisualizer from './pages/AlgorithmVisualizer';
import ProjectLabs from './pages/ProjectLabs';
import CodeDuel from './pages/CodeDuel';
import MLSandbox from './pages/MLSandbox';
import Portfolio from './pages/Portfolio';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LevelPage from './pages/LevelPage';


import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:moduleId" element={<ModulePage />} />
          <Route path="learn/:moduleId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/learn/:moduleId/lesson/:lessonId/level/:levelId" element={<LevelPage />} />
          <Route path="visualizer" element={<AlgorithmVisualizer />} />
          <Route path="projects" element={<ProjectLabs />} />
          <Route path="duel" element={<CodeDuel />} />
          <Route path="sandbox" element={<MLSandbox />} />
          <Route path="portfolio" element={<Portfolio />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
