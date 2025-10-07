import React from 'react';
import { useParams, Link } from 'react-router-dom';

const LessonPage = () => {
  const { moduleId, lessonId } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Module {moduleId} - Lesson {lessonId}</h1>
      <p>This is where the lesson content will go.</p>

      <Link to={`/learn/${moduleId}`} className="text-blue-500">
        ← Back to Module
      </Link>
    </div>
  );
};

export default LessonPage;
