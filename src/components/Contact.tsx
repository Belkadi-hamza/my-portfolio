import { Mail, Phone, Github, Linkedin } from 'lucide-react';
import data from '../data.json';
import { ContactData } from '../types';

const iconMap = {
  Github,
  Linkedin,
  Mail,
  Phone
};

export default function Contact() {
  const { email, phone, socialLinks }: ContactData = data.contact;

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Contact
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">Coordonnées</h3>
              <div className="space-y-4">
                <a href={`mailto:${email}`} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  <Mail className="w-5 h-5 mr-3" />
                  {email}
                </a>
                <a href={`tel:${phone}`} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  <Phone className="w-5 h-5 mr-3" />
                  {phone}
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">Réseaux Sociaux</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => {
                  const Icon = iconMap[link.icon as keyof typeof iconMap];
                  return (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors">
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
                
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-105"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}