import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabaseClient';

// Import your 10 avatars
import avatar1 from '../images/image1.png';
import avatar2 from '../images/image2.png';
import avatar3 from '../images/image3.png';
import avatar4 from '../images/image4.png';
import avatar5 from '../images/image5.png';
import avatar6 from '../images/image6.png';
import avatar7 from '../images/image7.png';
import avatar8 from '../images/image8.png';
import avatar9 from '../images/image9.png';
import avatar10 from '../images/image10.png';

const avatars = [
  avatar1, avatar2, avatar3, avatar4, avatar5,
  avatar6, avatar7, avatar8, avatar9, avatar10
];

const ProfileBuild = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    nickname: '',
    gender: '',
    role: '',
    organization: '',
    bio: '',
    avatar_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to auth if no user
  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatarSelect = url =>
    setForm({ ...form, avatar_url: url });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure we have a signed-in user with an id before attempting to save
      if (!user || !user.id) {
        console.error('Attempted to save profile but no authenticated user found', user);
        setError('You are not signed in. Please sign in again and try saving your profile.');
        setLoading(false);
        return;
      }

      const { error: dbError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            ...form,
            profile_complete: true,   // ✅ mark profile as complete
            updated_at: new Date()
          },
          { onConflict: 'id' }
        );

      // Better surface Supabase errors for debugging
      if (dbError) {
        console.error('Supabase upsert error:', dbError);
        setError(dbError.message || 'Failed to save profile. Please try again.');
        setLoading(false);
        return;
      }

      // Update user context
      setUser(prev => ({
        ...prev,
        ...form,
        profile_complete: true
      }));

      navigate('/topic-selection'); // ✅ move to topic selection
    } catch (err) {
      console.error(err);
      // Show more helpful message when possible
      setError(err?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-dark-lighter p-6 rounded-lg shadow-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-primary mb-4 text-center">
          Build Your Profile
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="nickname"
          placeholder="Nickname"
          value={form.nickname}
          onChange={handleChange}
          className="input"
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Role</option>
          <option value="Student">Student</option>
          <option value="Professional">Professional</option>
          <option value="Self-learner">Self-learner</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="organization"
          placeholder="Organization"
          value={form.organization}
          onChange={handleChange}
          className="input"
        />
        <textarea
          name="bio"
          placeholder="Short Bio"
          value={form.bio}
          onChange={handleChange}
          className="input"
        />

        <h2 className="text-sm font-medium text-gray-400 mt-2">
          Choose an Avatar
        </h2>

        <div className="flex overflow-x-auto gap-3 py-2">
          {avatars.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`avatar-${i}`}
              className={`w-16 h-16 flex-shrink-0 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                form.avatar_url === url
                  ? 'border-primary scale-110'
                  : 'border-gray-400'
              }`}
              onClick={() => handleAvatarSelect(url)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="btn-primary mt-4"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default ProfileBuild;
