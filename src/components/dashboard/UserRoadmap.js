import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../utils/supabaseClient';
import { Link } from 'react-router-dom';

const UserRoadmap = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the user's roadmap
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        
        // First check if roadmap is already in user profile data
        if (user.recommendations) {
          console.log('Found roadmap in user profile:', user.recommendations);
          setRoadmap(user.recommendations);
          setError(null);
          return;
        }
        
        // Otherwise try to get it from recommendations table (if it exists)
        try {
          const { data, error } = await supabase
            .from('recommendations')
            .select('roadmap')
            .eq('user_id', user.id)
            .single();
            
          if (!error && data && data.roadmap) {
            console.log('Found roadmap in recommendations table:', data.roadmap);
            setRoadmap(data.roadmap);
            setError(null);
            return;
          }
        } catch (tableError) {
          console.warn('Could not query recommendations table:', tableError);
          // Non-critical error, continue execution with mock data
        }
        
        // If we get here, we have no roadmap data - show mock data or placeholder
        console.log('No roadmap found, creating placeholder');
        
        // Create a simple mock roadmap
        const mockRoadmap = {
          userId: user.id,
          modules: [
            {
              module_id: 1,
              title: "Python Fundamentals",
              description: "Learn the basics of Python programming language.",
              rank: 1,
              difficulty: "beginner",
              estimated_hours: 8,
              reason: "Recommended starting point for your learning journey"
            }
          ],
          generated_at: new Date().toISOString(),
          selected_topics: user.selected_topics || [],
          algorithm_version: "placeholder-1.0"
        };
        
        // Show the placeholder data
        setRoadmap(mockRoadmap);
        setError(null);
        
      } catch (err) {
        console.error('Error in roadmap component:', err);
        setError('Failed to load your learning roadmap. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRoadmap();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-lighter rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Learning Roadmap</h2>
        <div className="bg-red-900/30 border border-red-700 rounded-md p-4 text-center">
          <p className="text-red-300 mb-2">{error}</p>
          <button 
            className="px-4 py-2 bg-primary rounded-md text-white text-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap || !roadmap.modules || roadmap.modules.length === 0) {
    return (
      <div className="bg-dark-lighter rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Learning Roadmap</h2>
        <div className="text-center p-8">
          <p className="text-gray-400 mb-4">You don't have a personalized roadmap yet.</p>
          <Link
            to="/topic-selection"
            className="px-4 py-2 bg-primary rounded-md text-white inline-block"
          >
            Select Topics to Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-lighter rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Learning Roadmap</h2>
        <span className="text-xs text-gray-500">
          Generated {new Date(roadmap.generated_at).toLocaleDateString()}
        </span>
      </div>
      
      <div className="space-y-6">
        {roadmap.modules.map((module, index) => (
          <motion.div
            key={module.module_id}
            className={`p-4 border rounded-lg ${
              index === 0
                ? 'border-primary bg-primary/10'
                : 'border-gray-700 bg-dark'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm mr-3">
                    {module.rank}
                  </span>
                  <h3 className="font-semibold text-lg">{module.title}</h3>
                </div>
                
                <p className="text-gray-400 mt-2">{module.description || 'No description available'}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    module.difficulty === 'beginner'
                      ? 'bg-green-900/30 text-green-300'
                      : module.difficulty === 'intermediate'
                      ? 'bg-yellow-900/30 text-yellow-300'
                      : 'bg-red-900/30 text-red-300'
                  }`}>
                    {module.difficulty?.charAt(0).toUpperCase() + module.difficulty?.slice(1) || 'Unspecified'}
                  </span>
                  
                  <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                    {module.estimated_hours || '?'} hours
                  </span>
                </div>
                
                {module.reason && (
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="font-medium text-primary">Why:</span> {module.reason}
                  </p>
                )}
              </div>
              
              <Link
                to={`/learn/${module.module_id}`}
                className={`px-4 py-2 rounded font-medium text-sm whitespace-nowrap ${
                  index === 0
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {index === 0 ? 'Start Now' : 'Preview'}
              </Link>
            </div>
            
            {module.prerequisites && module.prerequisites.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Prerequisites:</span>{' '}
                  {module.prerequisites.join(', ')}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Based on {roadmap.selected_topics?.length || 0} selected interests
        </p>
        
        <Link
          to="/topic-selection"
          className="text-primary text-sm hover:underline"
        >
          Update Topics
        </Link>
      </div>
    </div>
  );
};

export default UserRoadmap;