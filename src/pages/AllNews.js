import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AllNews = () => {
  const location = useLocation();
  const [articles, setArticles] = useState(location.state?.articles || []);
  const [loading, setLoading] = useState(!location.state?.articles?.length);

  useEffect(() => {
    // If user visits directly (no state passed), fetch fresh
    const fetchAllNews = async () => {
      const queries = [
        "Artificial Intelligence AND (education OR research OR learning OR teaching)",
        "Python AND (tutorial OR course OR learning OR beginner OR projects OR careers)",
        "Deep Learning AND (research OR papers OR study OR tutorial OR student)",
        "ChatGPT OR OpenAI OR Claude OR Gemini AND (education OR learning OR study OR exam)",
        "LLM OR Large Language Model OR Generative AI AND (education OR learning OR research OR classroom OR teaching)",
        "EdTech OR Educational Technology OR Online Learning OR MOOCs OR Coursera OR Udemy"
      ];

      let allArticles = [];
      try {
        for (const q of queries) {
          const res = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=10&apikey=${process.env.REACT_APP_GNEWS_API_KEY}`);
          const data = await res.json();
          if (data.articles) allArticles = [...allArticles, ...data.articles];
        }

        const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.url, a])).values());
        setArticles(uniqueArticles);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!articles.length) fetchAllNews();
  }, [articles.length]);

  if (loading) return <p className="text-white text-center mt-8">Loading news...</p>;
  if (!articles.length) return <p className="text-white text-center mt-8">No news found.</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex justify-center">
      <div className="max-w-5xl w-full flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🌍 Explore More News</h2>

        {articles.map((a) => (
          <div key={a.url} className="flex flex-col md:flex-row bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
            {a.image && <img src={a.image} alt={a.title} className="w-full md:w-1/4 h-32 object-cover" />}
            <div className="p-3 flex flex-col justify-between md:w-3/4">
              <h3 className="text-md font-semibold text-white mb-1 line-clamp-2">{a.title}</h3>
              <p className="text-gray-300 text-sm mb-1 line-clamp-2">{a.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                <span>{a.source?.name}</span>
                <span>{new Date(a.publishedAt).toLocaleDateString()}</span>
              </div>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm text-center inline-block transition"
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllNews;
