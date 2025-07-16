import { useState, useEffect } from 'react';
import { getUserData } from '../firebase/database';
import { PortfolioData } from '../types';

const USER_ID = 'OgyHE2316metkHnjAsjmiiUx4Ck1';

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUserData(USER_ID);
        
        if (userData) {
          // Transform Firebase data to match PortfolioData interface
          const portfolioData: PortfolioData = {
            hero: {
              name: userData.full_name || 'Belkadi Hamza',
              title: userData.bio || 'Full Stack Developer & AI Enthusiast',
              socialLinks: transformSocialLinks(userData.social_links),
              image: userData.image_url || 'https://i.ibb.co/xqfTHp3X/hero.jpg'
            },
            education: transformEducation(userData.education),
            skills: {
              categories: transformSkills(userData.skill_categories)
            },
            experience: transformExperience(userData.experiences),
            projects: transformProjects(userData.projects),
            contact: {
              email: userData.email || 'hamzabelkadi25@gmail.com',
              phone: getPhoneFromContactInfo(userData.contact_info),
              socialLinks: transformSocialLinks(userData.social_links)
            }
          };
          
          setData(portfolioData);
        } else {
          setError('User data not found');
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// Helper functions to transform Firebase data
function transformSocialLinks(socialLinks: any): any[] {
  if (!socialLinks) return [];
  
  return Object.values(socialLinks).map((link: any) => ({
    name: link.platform_name,
    url: link.url,
    icon: link.icon
  }));
}

function transformEducation(education: any): any[] {
  if (!education) return [];
  
  return Object.values(education).map((edu: any) => {
    const startYear = edu.start_date ? new Date(edu.start_date).getFullYear() : '';
    const endYear = edu.end_date && !edu.current ? new Date(edu.end_date).getFullYear() : '';
    
    return {
      degree: edu.degree,
      school: edu.school,
      period: `${startYear} – ${edu.current ? 'Present' : endYear}`,
      description: edu.description,
      current: edu.current || false
    };
  });
}

function transformSkills(skillCategories: any): any[] {
  if (!skillCategories) return [];
  
  return Object.values(skillCategories).map((category: any) => ({
    title: category.title,
    icon: category.icon,
    skills: Object.values(category.skills || {}).map((skill: any) => ({
      name: skill.name,
      level: skill.level
    }))
  }));
}

function transformExperience(experiences: any): any[] {
  if (!experiences) return [];
  
  return Object.values(experiences).map((exp: any) => ({
    title: exp.title,
    company: exp.company,
    period: `${exp.start_date} – ${exp.end_date}`,
    description: exp.tasks || []
  }));
}

function transformProjects(projects: any): any[] {
  if (!projects) return [];
  
  return Object.values(projects).map((project: any) => ({
    name: project.name,
    description: project.description,
    stack: project.stack || [],
    category: project.category,
    icon: project.icon,
    link: project.link
  }));
}

function getPhoneFromContactInfo(contactInfo: any): string {
  if (!contactInfo) return '+212 679-084-271';
  
  const firstContact = Object.values(contactInfo)[0] as any;
  return firstContact?.phone || '+212 679-084-271';
}