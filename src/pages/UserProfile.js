import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaUserTie, FaVenusMars, FaBuilding, FaAlignLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return <p className="text-center mt-10 text-gray-400">No user data found.</p>;

  const stats = [
    { label: 'Streak', value: '5 days', color: 'bg-yellow-900/20 text-yellow-400' },
    { label: 'XP', value: '1250', color: 'bg-pink-900/20 text-pink-400' },
    { label: 'Badges', value: '3', color: 'bg-blue-900/20 text-blue-400' },
    { label: 'Achievements', value: '2', color: 'bg-green-900/20 text-green-400' },
    { label: 'Courses', value: '4', color: 'bg-purple-900/20 text-purple-400' },
  ];

  const details = [
    { icon: <FaEnvelope />, label: 'Email', value: user.email },
    { icon: <FaUserTie />, label: 'Role', value: user.role || '-' },
    { icon: <FaVenusMars />, label: 'Gender', value: user.gender || '-' },
    { icon: <FaBuilding />, label: 'Organization', value: user.organization || '-' },
    { icon: <FaAlignLeft />, label: 'Bio', value: user.bio || '-' },
  ];

  return (
    <div className="min-h-screen bg-dark-lighter flex justify-center p-4">
      <div className="w-full max-w-md bg-dark p-5 rounded-xl shadow-lg flex flex-col items-center gap-5">

        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-md">
          <img
            src={user.avatar_url || '/default-avatar.png'}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name & Nickname */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{user.full_name}</h1>
          {user.nickname && <h2 className="text-gray-300 text-sm italic">@{user.nickname}</h2>}
        </div>

        {/* Stats */}
        <div className="w-full grid grid-cols-3 gap-2 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`rounded-lg py-2 flex flex-col items-center justify-center cursor-pointer transition-transform ${stat.color}`}
            >
              <span className="font-semibold text-sm">{stat.value}</span>
              <span className="text-xs">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Profile Details */}
        <div className="w-full flex flex-col gap-2 mt-3">
          {details.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-800"
            >
              <div className="text-lg mt-1 text-white">{item.icon}</div>
              <div className="flex-1 flex flex-col">
                <span className="text-gray-400 text-xs font-medium">{item.label}</span> {/* heading lighter */}
                <span className="text-white text-sm font-semibold break-words">{item.value}</span> {/* info prominent */}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
