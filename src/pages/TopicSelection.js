import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabaseClient';

const TopicSelection = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Define topic categories with Reddit-style structure
  const categories = [
    {
      name: "Programming Languages & Frameworks",
      icon: "💻",
      color: "bg-blue-500",
      topics: [
        { id: "python", name: "Python", icon: "🐍", subscribers: "2.1M" },
        { id: "javascript", name: "JavaScript", icon: "⚡", subscribers: "1.8M" },
        { id: "typescript", name: "TypeScript", icon: "📘", subscribers: "420K" },
        { id: "react", name: "React", icon: "⚛️", subscribers: "890K" },
        { id: "nodejs", name: "Node.js", icon: "💚", subscribers: "780K" },
        { id: "vue", name: "Vue.js", icon: "💚", subscribers: "340K" },
        { id: "angular", name: "Angular", icon: "🅰️", subscribers: "290K" },
        { id: "java", name: "Java", icon: "☕", subscribers: "1.2M" },
        { id: "csharp", name: "C#", icon: "🔷", subscribers: "560K" },
        { id: "cpp", name: "C++", icon: "⚙️", subscribers: "680K" },
        { id: "go", name: "Go", icon: "🔵", subscribers: "310K" },
        { id: "rust", name: "Rust", icon: "🦀", subscribers: "280K" }
      ]
    },
    {
      name: "Web Development & Design",
      icon: "🌐",
      color: "bg-cyan-500",
      topics: [
        { id: "webdev", name: "Web Development", icon: "🌐", subscribers: "1.2M" },
        { id: "frontend", name: "Frontend Development", icon: "🎨", subscribers: "850K" },
        { id: "backend", name: "Backend Development", icon: "🔧", subscribers: "720K" },
        { id: "fullstack", name: "Full Stack Development", icon: "🔗", subscribers: "640K" },
        { id: "html-css", name: "HTML & CSS", icon: "🎯", subscribers: "580K" },
        { id: "tailwindcss", name: "Tailwind CSS", icon: "💨", subscribers: "190K" },
        { id: "bootstrap", name: "Bootstrap", icon: "🅱️", subscribers: "220K" },
        { id: "webdesign", name: "Web Design", icon: "🎨", subscribers: "410K" },
        { id: "ux-ui", name: "UX/UI Design", icon: "✨", subscribers: "680K" },
        { id: "responsive", name: "Responsive Design", icon: "📱", subscribers: "320K" }
      ]
    },
    {
      name: "Machine Learning - Supervised Learning",
      icon: "🎯",
      color: "bg-purple-500",
      topics: [
        { id: "supervised-ml", name: "Supervised Learning", icon: "🎯", subscribers: "890K" },
        { id: "linear-regression", name: "Linear Regression", icon: "📈", subscribers: "420K" },
        { id: "logistic-regression", name: "Logistic Regression", icon: "📊", subscribers: "380K" },
        { id: "decision-trees", name: "Decision Trees", icon: "🌳", subscribers: "340K" },
        { id: "random-forest", name: "Random Forest", icon: "🌲", subscribers: "310K" },
        { id: "svm", name: "Support Vector Machines", icon: "⚖️", subscribers: "290K" },
        { id: "naive-bayes", name: "Naive Bayes", icon: "📋", subscribers: "220K" },
        { id: "knn", name: "K-Nearest Neighbors", icon: "🎪", subscribers: "180K" },
        { id: "ensemble-methods", name: "Ensemble Methods", icon: "🎭", subscribers: "250K" },
        { id: "xgboost", name: "XGBoost & Gradient Boosting", icon: "🚀", subscribers: "320K" }
      ]
    },
    {
      name: "Machine Learning - Unsupervised Learning",
      icon: "🔍",
      color: "bg-indigo-500",
      topics: [
        { id: "unsupervised-ml", name: "Unsupervised Learning", icon: "🔍", subscribers: "720K" },
        { id: "clustering", name: "Clustering", icon: "🎯", subscribers: "410K" },
        { id: "kmeans", name: "K-Means Clustering", icon: "🔴", subscribers: "280K" },
        { id: "hierarchical-clustering", name: "Hierarchical Clustering", icon: "📊", subscribers: "190K" },
        { id: "dbscan", name: "DBSCAN", icon: "🎪", subscribers: "150K" },
        { id: "pca", name: "Principal Component Analysis", icon: "📉", subscribers: "340K" },
        { id: "dimensionality-reduction", name: "Dimensionality Reduction", icon: "📐", subscribers: "220K" },
        { id: "anomaly-detection", name: "Anomaly Detection", icon: "🚨", subscribers: "290K" },
        { id: "association-rules", name: "Association Rules", icon: "🔗", subscribers: "140K" },
        { id: "market-basket", name: "Market Basket Analysis", icon: "🛒", subscribers: "110K" }
      ]
    },
    {
      name: "Reinforcement Learning & AI",
      icon: "🤖",
      color: "bg-pink-500",
      topics: [
        { id: "reinforcement-learning", name: "Reinforcement Learning", icon: "🎮", subscribers: "580K" },
        { id: "q-learning", name: "Q-Learning", icon: "🧠", subscribers: "220K" },
        { id: "deep-q-networks", name: "Deep Q-Networks (DQN)", icon: "🔥", subscribers: "180K" },
        { id: "policy-gradient", name: "Policy Gradient Methods", icon: "📈", subscribers: "160K" },
        { id: "actor-critic", name: "Actor-Critic Methods", icon: "🎭", subscribers: "140K" },
        { id: "multi-agent", name: "Multi-Agent RL", icon: "👥", subscribers: "120K" },
        { id: "game-ai", name: "Game AI", icon: "🕹️", subscribers: "340K" },
        { id: "robotics-ai", name: "Robotics & AI", icon: "🤖", subscribers: "290K" },
        { id: "autonomous-systems", name: "Autonomous Systems", icon: "🚗", subscribers: "250K" },
        { id: "ai-ethics", name: "AI Ethics", icon: "⚖️", subscribers: "180K" }
      ]
    },
    {
      name: "Deep Learning & Neural Networks",
      icon: "🧠",
      color: "bg-red-500",
      topics: [
        { id: "deep-learning", name: "Deep Learning", icon: "🔥", subscribers: "720K" },
        { id: "neural-networks", name: "Neural Networks", icon: "🧠", subscribers: "680K" },
        { id: "cnn", name: "Convolutional Neural Networks", icon: "🖼️", subscribers: "450K" },
        { id: "rnn", name: "Recurrent Neural Networks", icon: "🔄", subscribers: "380K" },
        { id: "lstm", name: "LSTM & GRU", icon: "🧮", subscribers: "290K" },
        { id: "transformers", name: "Transformers", icon: "🔄", subscribers: "420K" },
        { id: "attention", name: "Attention Mechanisms", icon: "👁️", subscribers: "320K" },
        { id: "gan", name: "Generative Adversarial Networks", icon: "🎨", subscribers: "340K" },
        { id: "autoencoders", name: "Autoencoders", icon: "🔄", subscribers: "220K" },
        { id: "transfer-learning", name: "Transfer Learning", icon: "🔄", subscribers: "280K" }
      ]
    },
    {
      name: "Natural Language Processing",
      icon: "💬",
      color: "bg-emerald-500",
      topics: [
        { id: "nlp", name: "Natural Language Processing", icon: "💬", subscribers: "410K" },
        { id: "text-preprocessing", name: "Text Preprocessing", icon: "📝", subscribers: "180K" },
        { id: "tokenization", name: "Tokenization", icon: "🔤", subscribers: "140K" },
        { id: "named-entity", name: "Named Entity Recognition", icon: "🏷️", subscribers: "160K" },
        { id: "sentiment-analysis", name: "Sentiment Analysis", icon: "😊", subscribers: "220K" },
        { id: "text-classification", name: "Text Classification", icon: "📊", subscribers: "190K" },
        { id: "machine-translation", name: "Machine Translation", icon: "🌍", subscribers: "170K" },
        { id: "question-answering", name: "Question Answering", icon: "❓", subscribers: "150K" },
        { id: "chatbots", name: "Chatbots", icon: "🤖", subscribers: "280K" },
        { id: "llm", name: "Large Language Models", icon: "💭", subscribers: "650K" }
      ]
    },
    {
      name: "Computer Vision",
      icon: "👁️",
      color: "bg-violet-500",
      topics: [
        { id: "computer-vision", name: "Computer Vision", icon: "👁️", subscribers: "380K" },
        { id: "image-processing", name: "Image Processing", icon: "🖼️", subscribers: "290K" },
        { id: "object-detection", name: "Object Detection", icon: "📦", subscribers: "250K" },
        { id: "face-recognition", name: "Face Recognition", icon: "👤", subscribers: "220K" },
        { id: "image-segmentation", name: "Image Segmentation", icon: "✂️", subscribers: "180K" },
        { id: "optical-character", name: "Optical Character Recognition", icon: "📄", subscribers: "160K" },
        { id: "medical-imaging", name: "Medical Image Analysis", icon: "🏥", subscribers: "140K" },
        { id: "autonomous-vision", name: "Autonomous Vehicle Vision", icon: "🚗", subscribers: "170K" },
        { id: "augmented-reality", name: "Augmented Reality", icon: "🥽", subscribers: "190K" },
        { id: "opencv", name: "OpenCV", icon: "📷", subscribers: "320K" }
      ]
    },
    {
      name: "Data Science & Analytics",
      icon: "📊",
      color: "bg-green-500",
      topics: [
        { id: "data-science", name: "Data Science", icon: "📈", subscribers: "1.1M" },
        { id: "data-analytics", name: "Data Analytics", icon: "📊", subscribers: "670K" },
        { id: "statistics", name: "Statistics", icon: "📋", subscribers: "480K" },
        { id: "probability", name: "Probability Theory", icon: "🎲", subscribers: "290K" },
        { id: "hypothesis-testing", name: "Hypothesis Testing", icon: "🧪", subscribers: "220K" },
        { id: "ab-testing", name: "A/B Testing", icon: "⚖️", subscribers: "180K" },
        { id: "time-series", name: "Time Series Analysis", icon: "📈", subscribers: "340K" },
        { id: "forecasting", name: "Forecasting", icon: "🔮", subscribers: "250K" },
        { id: "pandas", name: "Pandas & NumPy", icon: "🐼", subscribers: "590K" },
        { id: "scipy", name: "SciPy", icon: "🔬", subscribers: "200K" }
      ]
    },
    {
      name: "Data Visualization & Tools",
      icon: "📈",
      color: "bg-amber-500",
      topics: [
        { id: "data-visualization", name: "Data Visualization", icon: "📉", subscribers: "420K" },
        { id: "matplotlib", name: "Matplotlib", icon: "📊", subscribers: "280K" },
        { id: "seaborn", name: "Seaborn", icon: "🌊", subscribers: "220K" },
        { id: "plotly", name: "Plotly", icon: "📈", subscribers: "190K" },
        { id: "tableau", name: "Tableau", icon: "📋", subscribers: "340K" },
        { id: "power-bi", name: "Power BI", icon: "⚡", subscribers: "290K" },
        { id: "d3js", name: "D3.js", icon: "🌐", subscribers: "180K" },
        { id: "excel", name: "Excel Analytics", icon: "📊", subscribers: "560K" },
        { id: "sql", name: "SQL", icon: "🗃️", subscribers: "890K" },
        { id: "bigdata", name: "Big Data", icon: "🗃️", subscribers: "450K" }
      ]
    },
    {
      name: "MLOps & Production",
      icon: "🚀",
      color: "bg-teal-500",
      topics: [
        { id: "mlops", name: "MLOps", icon: "🚀", subscribers: "320K" },
        { id: "model-deployment", name: "Model Deployment", icon: "📦", subscribers: "250K" },
        { id: "model-monitoring", name: "Model Monitoring", icon: "📊", subscribers: "180K" },
        { id: "feature-engineering", name: "Feature Engineering", icon: "🔧", subscribers: "290K" },
        { id: "data-pipelines", name: "Data Pipelines", icon: "🔄", subscribers: "220K" },
        { id: "model-versioning", name: "Model Versioning", icon: "📝", subscribers: "140K" },
        { id: "kubeflow", name: "Kubeflow", icon: "☸️", subscribers: "90K" },
        { id: "mlflow", name: "MLflow", icon: "🌊", subscribers: "120K" },
        { id: "airflow", name: "Apache Airflow", icon: "🌪️", subscribers: "160K" },
        { id: "docker-ml", name: "Docker for ML", icon: "🐳", subscribers: "200K" }
      ]
    },
    {
      name: "Career & Professional Development",
      icon: "🎯",
      color: "bg-orange-500",
      topics: [
        { id: "cs-career", name: "CS Career Questions", icon: "💼", subscribers: "1.8M" },
        { id: "learn-programming", name: "Learn Programming", icon: "📚", subscribers: "2.5M" },
        { id: "coding-interviews", name: "Coding Interviews", icon: "🎯", subscribers: "560K" },
        { id: "leetcode", name: "LeetCode", icon: "💻", subscribers: "780K" },
        { id: "system-design", name: "System Design", icon: "🏗️", subscribers: "420K" },
        { id: "algorithms-ds", name: "Algorithms & Data Structures", icon: "🧮", subscribers: "650K" },
        { id: "freelancing", name: "Freelancing", icon: "💰", subscribers: "420K" },
        { id: "startups", name: "Startups", icon: "🚀", subscribers: "890K" },
        { id: "tech-leadership", name: "Tech Leadership", icon: "👑", subscribers: "280K" },
        { id: "productivity", name: "Productivity", icon: "⚡", subscribers: "1.2M" }
      ]
    },
    {
      name: "Cloud & Infrastructure",
      icon: "☁️",
      color: "bg-blue-600",
      topics: [
        { id: "cloud-computing", name: "Cloud Computing", icon: "☁️", subscribers: "680K" },
        { id: "aws", name: "Amazon Web Services", icon: "🟠", subscribers: "510K" },
        { id: "azure", name: "Microsoft Azure", icon: "🔷", subscribers: "420K" },
        { id: "gcp", name: "Google Cloud Platform", icon: "🟡", subscribers: "380K" },
        { id: "kubernetes", name: "Kubernetes", icon: "☸️", subscribers: "340K" },
        { id: "docker", name: "Docker", icon: "🐳", subscribers: "450K" },
        { id: "devops", name: "DevOps", icon: "🔧", subscribers: "520K" },
        { id: "ci-cd", name: "CI/CD", icon: "🔄", subscribers: "290K" },
        { id: "terraform", name: "Terraform", icon: "🏗️", subscribers: "180K" },
        { id: "serverless", name: "Serverless", icon: "⚡", subscribers: "220K" }
      ]
    },
    {
      name: "Emerging Technologies",
      icon: "🚀",
      color: "bg-rose-500",
      topics: [
        { id: "blockchain", name: "Blockchain", icon: "⛓️", subscribers: "580K" },
        { id: "cryptocurrency", name: "Cryptocurrency", icon: "₿", subscribers: "890K" },
        { id: "nft", name: "NFTs", icon: "🖼️", subscribers: "340K" },
        { id: "web3", name: "Web3", icon: "🌐", subscribers: "420K" },
        { id: "iot", name: "Internet of Things", icon: "🌍", subscribers: "290K" },
        { id: "edge-computing", name: "Edge Computing", icon: "🔗", subscribers: "150K" },
        { id: "quantum-computing", name: "Quantum Computing", icon: "⚛️", subscribers: "180K" },
        { id: "metaverse", name: "Metaverse", icon: "🥽", subscribers: "220K" },
        { id: "virtual-reality", name: "Virtual Reality", icon: "🥽", subscribers: "310K" },
        { id: "cybersecurity", name: "Cybersecurity", icon: "🔒", subscribers: "890K" }
      ]
    },
    {
      name: "Mobile & Game Development",
      icon: "📱",
      color: "bg-fuchsia-500",
      topics: [
        { id: "mobile-development", name: "Mobile Development", icon: "📱", subscribers: "640K" },
        { id: "android", name: "Android Development", icon: "🤖", subscribers: "520K" },
        { id: "ios", name: "iOS Development", icon: "🍎", subscribers: "480K" },
        { id: "flutter", name: "Flutter", icon: "🐦", subscribers: "290K" },
        { id: "react-native", name: "React Native", icon: "⚛️", subscribers: "340K" },
        { id: "kotlin", name: "Kotlin", icon: "🎯", subscribers: "220K" },
        { id: "swift", name: "Swift", icon: "🏃", subscribers: "280K" },
        { id: "game-development", name: "Game Development", icon: "🎮", subscribers: "580K" },
        { id: "unity", name: "Unity", icon: "🎲", subscribers: "380K" },
        { id: "unreal-engine", name: "Unreal Engine", icon: "🎮", subscribers: "290K" }
      ]
    }
  ];

  const handleTopicToggle = (topicId) => {
    const newSelected = new Set(selectedTopics);
    if (newSelected.has(topicId)) {
      newSelected.delete(topicId);
    } else {
      newSelected.add(topicId);
    }
    setSelectedTopics(newSelected);
  };

  const handleContinue = async () => {
    if (selectedTopics.size < 3) {
      alert('Please select at least 3 topics to continue');
      return;
    }

    setLoading(true);
    try {
      const topicsArray = Array.from(selectedTopics);
      const { error } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          selected_topics: topicsArray,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({ 
        ...prev, 
        onboarding_completed: true,
        selected_topics: topicsArray
      }));

      navigate('/app');
    } catch (err) {
      console.error('Error saving topics:', err);
      alert('Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({ ...prev, onboarding_completed: true }));
      navigate('/app');
    } catch (err) {
      console.error('Error skipping onboarding:', err);
      navigate('/app'); // Navigate anyway
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Interests</h1>
          <p className="text-gray-400 text-lg">
            Select topics you'd like to explore and learn about. We'll personalize your experience!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Selected: {selectedTopics.size} • Minimum: 3 topics
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center mr-3`}>
                  <span className="text-white text-lg">{category.icon}</span>
                </div>
                <h2 className="text-xl font-semibold text-white">{category.name}</h2>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.topics.map((topic) => {
                  const isSelected = selectedTopics.has(topic.id);
                  return (
                    <motion.button
                      key={topic.id}
                      onClick={() => handleTopicToggle(topic.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-primary bg-primary/20 shadow-lg'
                          : 'border-gray-600 bg-dark-lighter hover:border-gray-500 hover:bg-dark-lightest'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{topic.icon}</span>
                          <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                            r/{topic.name}
                          </span>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{topic.subscribers} members</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-between items-center mt-12 pt-8 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button
            onClick={handleSkip}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Skip for now
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              {selectedTopics.size >= 3 ? "Great! You're ready to continue" : `Select ${3 - selectedTopics.size} more topics`}
            </p>
            <button
              onClick={handleContinue}
              disabled={selectedTopics.size < 3 || loading}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                selectedTopics.size >= 3
                  ? 'bg-primary hover:bg-primary-dark text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Saving...' : 'Continue to Pyscape'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TopicSelection;