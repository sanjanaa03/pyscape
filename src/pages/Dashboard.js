import React from 'react';
import { motion } from 'framer-motion';

// Import components if they exist, otherwise use fallbacks
let TrendingNews, ProjectLabPreview, MLSandboxPreview, CodeDuelPreview;

try {
  TrendingNews = require('../components/dashboard/TrendingNews').default;
  ProjectLabPreview = require('../components/dashboard/ProjectLabPreview').default;
  MLSandboxPreview = require('../components/dashboard/MLSandboxPreview').default;
  CodeDuelPreview = require('../components/dashboard/CodeDuelPreview').default;
} catch (error) {
  console.warn('Some dashboard components could not be loaded:', error);
}

// Fallback components
const FallbackComponent = ({ title, description }) => (
  <div className="bg-dark-lighter rounded-lg p-6 h-full">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {TrendingNews ? <TrendingNews /> : (
            <FallbackComponent 
              title="Explore AI Trends" 
              description="Latest news and updates in the world of AI and machine learning." 
            />
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {ProjectLabPreview ? <ProjectLabPreview /> : (
            <FallbackComponent 
              title="Project Labs" 
              description="Build guided projects to apply your skills." 
            />
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {MLSandboxPreview ? <MLSandboxPreview /> : (
            <FallbackComponent 
              title="ML Sandbox" 
              description="Experiment with Python & ML code instantly." 
            />
          )}
        </motion.div>
        
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {CodeDuelPreview ? <CodeDuelPreview /> : (
            <FallbackComponent 
              title="Code Duel" 
              description="Challenge others and climb the leaderboard in real-time coding battles." 
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;