import {
  Bot,
  LibraryBig,
  BookOpen,
  Video,
  Camera,
  Brain,
  ShieldCheck,
  Code,
  Printer,
  Palette
} from 'lucide-react';
import { useState } from 'react';
import data from '../data.json';
import { Project } from '../types';

const iconMap = {
  Bot,
  LibraryBig,
  BookOpen,
  Video,
  Camera,
  Brain,
  ShieldCheck,
  Code,
  Printer,
  Palette
};

export default function Projects() {
  const [filter, setFilter] = useState<'all' | 'web' | 'ai'>('all');
  const projects = data.projects as Project[];

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.category === filter
  );

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Projets
          </span>
        </h2>

        <div className="flex justify-center space-x-4 mb-12">
          {(['all', 'web', 'ai'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                filter === category
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'Tous' : category === 'web' ? 'Web' : 'IA'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const Icon = iconMap[project.icon];
            
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  >
                    Voir le projet
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}