import { Github, Linkedin, Mail } from 'lucide-react';
import data from '../data.json';
import { HeroData } from '../types';
import ComputerScene from './ComputerScene';

const iconComponents = {
  Github,
  Linkedin,
  Mail
};

export default function Hero() {
  const heroData: HeroData = data.hero;

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="block text-gray-900 dark:text-white">Hello, I'm</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                {heroData.name}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              {heroData.title}
            </p>
            <div className="flex space-x-4">
              {heroData.socialLinks.map((link, index) => {
                const IconComponent = iconComponents[link.icon as keyof typeof iconComponents];
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <IconComponent className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="hidden md:block">
            <ComputerScene />
          </div>
        </div>
      </div>
    </section>
  );
}