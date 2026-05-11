import React from 'react';
import { Sparkles, Code, Image as ImageIcon, Video, Music, Clock } from 'lucide-react';

const categories = [
  {
    title: 'Featured',
    icon: <Sparkles size={24} className="text-amber-500" />,
    color: 'bg-amber-100',
    description: 'Our most capable models for general tasks.'
  },
  {
    title: 'Code and Chat',
    icon: <Code size={24} className="text-blue-500" />,
    color: 'bg-blue-100',
    description: 'Specialized for writing code and logical reasoning.'
  },
  {
    title: 'Image Generation',
    icon: <ImageIcon size={24} className="text-purple-500" />,
    color: 'bg-purple-100',
    description: 'Create high-quality images from text descriptions.'
  },
  {
    title: 'Video Generation',
    icon: <Video size={24} className="text-pink-500" />,
    color: 'bg-pink-100',
    description: 'Generate dynamic videos from prompts.'
  },
  {
    title: 'Speech and Music',
    icon: <Music size={24} className="text-green-500" />,
    color: 'bg-green-100',
    description: 'Create audio, music, and voice generation.'
  },
  {
    title: 'Real-time',
    icon: <Clock size={24} className="text-teal-500" />,
    color: 'bg-teal-100',
    description: 'Low-latency models for real-time interactions.'
  }
];

const ModelCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, idx) => (
        <div 
          key={idx} 
          className="group border border-gray-200 rounded-xl p-5 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center mb-4`}>
            {cat.icon}
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">{cat.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ModelCards;
