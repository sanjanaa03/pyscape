import supabase from './supabaseClient';

/**
 * Check if a user has a profile
 * @param {string} userId
 * @returns {object|null} profile data or null
 */
export const checkUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
};

/**
 * Upsert (insert or update) user profile
 * Automatically sets profile_complete to true
 * @param {string} userId
 * @param {object} profileData
 * @returns {object} updated profile
 */
export const upsertProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        profile_complete: true,
        updated_at: new Date(),
        ...profileData,
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Complete onboarding quiz and store answers
 * Automatically sets onboarding_completed to true
 * @param {string} userId
 * @param {object} answers
 * @returns {object} updated profile
 */
export const completeOnboarding = async (userId, answers) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      onboarding_completed: true,
      onboarding_answers: answers,
      updated_at: new Date(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
