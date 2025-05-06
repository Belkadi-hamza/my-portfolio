import { GraduationCap } from 'lucide-react';
import data from '../data.json';
import { Education } from '../types';

export default function EducationComponent() {
  const educationData: Education[] = data.education;

  return (
    <section id="education" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Éducation
          </span>
        </h2>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-500" />
          
          <div className="space-y-12">
            {educationData.map((edu, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-4 border-purple-600 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">{edu.school}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{edu.period}</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{edu.description}</p>
                    {edu.current && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-2">
                        En cours
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}