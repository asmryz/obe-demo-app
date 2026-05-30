import React from 'react';
import { BookOpen, Cpu, Heart, Target, Award, RefreshCw } from 'lucide-react';

const categories = [
  {
    title: 'Cognitive Domain',
    icon: <BookOpen size={24} className="text-amber-500" />,
    color: 'bg-amber-100',
    description: 'Focuses on intellectual skills, knowledge acquisition, and mental processes.'
  },
  {
    title: 'Psychomotor Domain',
    icon: <Cpu size={24} className="text-blue-500" />,
    color: 'bg-blue-100',
    description: 'Focuses on manual or physical skills, technical expertise, and practical execution.'
  },
  {
    title: 'Affective Domain',
    icon: <Heart size={24} className="text-purple-500" />,
    color: 'bg-purple-100',
    description: 'Focuses on feelings, values, appreciation, enthusiasm, and attitude towards learning.'
  },
  {
    title: 'Course Learning Outcomes (CLOs)',
    icon: <Target size={24} className="text-pink-500" />,
    color: 'bg-pink-100',
    description: 'Specific statements of what students should know and be able to do in each course.'
  },
  {
    title: 'Program Learning Outcomes (PLOs)',
    icon: <Award size={24} className="text-green-500" />,
    color: 'bg-green-100',
    description: 'Graduate attributes aligned with Washington Accord representing key competencies.'
  },
  {
    title: 'Continuous Quality Improvement (CQI)',
    icon: <RefreshCw size={24} className="text-teal-500" />,
    color: 'bg-teal-100',
    description: 'Closing the loop with iterative reviews and actions for curriculum improvement.'
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
