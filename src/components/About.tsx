import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">About Me</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            As a Full Stack Developer with a deep interest in Artificial Intelligence, I bridge the gap between traditional web development and cutting-edge AI technologies. My journey in technology is driven by a passion for creating innovative solutions that make a meaningful impact.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Currently focused on developing AI-enhanced web applications, I combine my expertise in modern web technologies with machine learning to build intelligent, user-centric solutions. I'm particularly interested in natural language processing and computer vision applications.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;