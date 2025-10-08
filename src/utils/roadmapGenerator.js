import moduleData from './modules.json';
import supabase from './supabaseClient';

/**
 * Roadmap Generator
 * 
 * This utility generates personalized roadmaps for users based on:
 * 1. Selected topics (from onboarding)
 * 2. User experience level
 * 3. Module prerequisites
 * 4. Simple IRT-lite scoring
 */
export class RoadmapGenerator {
  /**
   * Generate a personalized roadmap for a user
   * @param {string} userId - The user ID
   * @param {string[]} selectedTopics - Array of topic IDs selected by the user
   * @param {string} [experienceLevel='beginner'] - User's self-reported experience level
   * @returns {Object} Roadmap object with recommended modules
   */
  static async generateRoadmap(userId, selectedTopics = [], experienceLevel = 'beginner') {
    try {
      // 1. Score each module based on topic match and prerequisites
      const scoredModules = moduleData.modules.map(module => {
        // Count how many selected topics match this module's topics
        const topicMatchCount = module.topics.filter(topic => 
          selectedTopics.includes(topic)
        ).length;
        
        // Base score is the number of matched topics
        let score = topicMatchCount * 10;
        
        // Adjust score based on module difficulty and user experience
        if (module.difficulty === 'beginner') {
          score += experienceLevel === 'beginner' ? 5 : -5;
        } else if (module.difficulty === 'advanced') {
          score += experienceLevel === 'advanced' ? 5 : -10;
        }
        
        // Ensure foundational modules are included
        if (module.prerequisites.length === 0) {
          score += 15; // Boost score for modules with no prerequisites
        }
        
        return {
          ...module,
          score,
          topicMatchCount
        };
      });
      
      // 2. Sort modules by score (highest first)
      const rankedModules = [...scoredModules].sort((a, b) => b.score - a.score);
      
      // 3. Build a properly ordered module list respecting prerequisites
      const orderedModules = [];
      const includedModuleIds = new Set();
      
      // Function to check if all prerequisites for a module are included
      const prerequisitesMet = (module) => {
        if (!module.prerequisites || module.prerequisites.length === 0) return true;
        return module.prerequisites.every(prereqId => includedModuleIds.has(prereqId));
      };
      
      // First pass: add modules with no prerequisites or met prerequisites
      for (const module of rankedModules) {
        if (prerequisitesMet(module)) {
          orderedModules.push(module);
          includedModuleIds.add(module.id);
        }
      }
      
      // Second pass: try to add remaining modules if prerequisites are now met
      // Do this until no more modules can be added or all are included
      let addedModules = true;
      while (addedModules && orderedModules.length < rankedModules.length) {
        addedModules = false;
        for (const module of rankedModules) {
          if (!includedModuleIds.has(module.id) && prerequisitesMet(module)) {
            orderedModules.push(module);
            includedModuleIds.add(module.id);
            addedModules = true;
          }
        }
      }
      
      // 4. Format the roadmap output
      const roadmap = {
        userId,
        modules: orderedModules.slice(0, 6).map((module, index) => ({
          module_id: module.id,
          title: module.title,
          description: module.description,
          rank: index + 1,
          difficulty: module.difficulty,
          estimated_hours: module.estimated_hours,
          reason: module.topicMatchCount > 0 
            ? `Matches ${module.topicMatchCount} of your selected interests`
            : "Foundational knowledge for your learning path",
          prerequisites: module.prerequisites
        })),
        generated_at: new Date().toISOString(),
        selected_topics: selectedTopics,
        algorithm_version: "1.0.0"
      };
      
      // 5. Save the roadmap to the database
      await RoadmapGenerator.saveRoadmap(userId, roadmap);
      
      // Return the roadmap
      return roadmap;
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      throw error;
    }
  }
  
  /**
   * Save the generated roadmap to the database
   * @param {string} userId - The user ID
   * @param {Object} roadmap - The generated roadmap
   */
  static async saveRoadmap(userId, roadmap) {
    try {
      // Try to save to recommendations table first
      const { error } = await supabase
        .from('recommendations')
        .upsert({
          user_id: userId,
          roadmap: roadmap,
          updated_at: new Date().toISOString()
        });
        
      // If recommendations table doesn't exist or other error, save to profile as fallback
      if (error) {
        console.warn('Failed to save to recommendations table, using profile fallback:', error);
        await supabase
          .from('profiles')
          .update({
            recommendations: roadmap
          })
          .eq('id', userId);
      }
      
      // Log the roadmap generation event
      await supabase.from('events').insert({
        user_id: userId,
        type: 'roadmap.generated',
        meta: { 
          module_count: roadmap.modules.length,
          algorithm_version: roadmap.algorithm_version
        },
        ts: new Date().toISOString()
      });
      
      return { success: true };
    } catch (err) {
      console.error('Failed to save roadmap:', err);
      return { success: false, error: err };
    }
  }
}

/**
 * Generate a personalized roadmap for a user - Standalone function version
 * @param {string} userId - The user ID
 * @param {string[]} selectedTopics - Array of topic IDs selected by the user
 * @returns {Object} Roadmap object with recommended modules
 */
export const generateRoadmapForUser = async (userId, selectedTopics = []) => {
  return RoadmapGenerator.generateRoadmap(userId, selectedTopics);
};

export default RoadmapGenerator;