import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; // make sure this path is correct

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/app', icon: '🏠', label: 'Dashboard', exact: true },
    { to: '/app/learn', icon: '📚', label: 'Learn' },
    { to: '/app/visualizer', icon: '📊', label: 'Visualizer' },
    { to: '/app/projects', icon: '🧪', label: 'Project Labs' },
    { to: '/app/duel', icon: '⚔️', label: 'Code Duel' },
    { to: '/app/sandbox', icon: '🧩', label: 'ML Sandbox' },
    { to: '/app/portfolio', icon: '📁', label: 'Portfolio' }
  ];

  return (
    <nav className="bg-dark-lighter w-64 min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <motion.h1
          className="text-2xl font-bold text-primary flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-3xl mr-2">C</span> Pyscape
        </motion.h1>
      </div>

      {/* Navigation links */}
      <div className="flex-1">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <NavLink
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center p-3 mb-2 rounded-md transition-all ${
                  isActive
                    ? 'bg-primary text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-dark-lightest'
                }`
              }
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* User Profile at bottom */}
      <div className="mt-auto pt-4 border-t border-dark-lightest">
        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-md transition-all ${
              isActive
                ? 'bg-primary text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-dark-lightest'
            }`
          }
        >
          <span className="w-10 h-10 rounded-full overflow-hidden mr-2 border-2 border-gray-500 bg-gray-600 flex items-center justify-center">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-full h-full flex items-center justify-center text-gray-300 text-sm font-medium ${user?.avatar_url ? 'hidden' : 'flex'}`}
              style={{ display: user?.avatar_url ? 'none' : 'flex' }}
            >
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </span>
          <div className="flex flex-col">
            <span>{user?.full_name || 'User Profile'}</span>
            <span className="text-xs text-gray-300">{user?.email}</span>
          </div>
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
