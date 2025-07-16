import { Briefcase } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';

export default function ExperienceComponent() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">Failed to load experience data</p>
        </div>
      </section>
    );
  }

  const experiences = data.experience;

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Expérience
          </span>
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-12 top-0 h-full w-1 bg-gradient-to-b from-purple-600 to-blue-500" />
          
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="relative pl-28">
                {/* Timeline dot */}
                <div className="absolute left-10 transform -translate-x-1/2">
                  <div className="ml-5 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-4 border-purple-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-purple-600"/>
                  </div>
                  
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">{exp.company}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{exp.period}</p>
                  <ul className="mt-4 space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 flex items-center">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}