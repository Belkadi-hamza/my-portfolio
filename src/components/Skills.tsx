import { Brain, Code, Database, GitBranch, Users, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { SkillCategory } from '../types';

const iconMap = {
  Code,
  Brain,
  Database,
  GitBranch,
  Users,
  Settings
} as const;

interface SkillsProps {
  skillCategories: SkillCategory[] | null;
}

export default function Skills({ skillCategories }: SkillsProps) {
  if (!skillCategories) {
    return (
      <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading skills data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800 section-3d">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-3d">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Compétences
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const Icon = iconMap[category.icon];
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg card-3d"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg transform transition-all duration-300 hover:rotate-12">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="transform transition-all duration-300 hover:translate-x-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
  className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${skill.level}%` }}
  transition={{ duration: 1.2, ease: 'easeOut' }}
/>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}