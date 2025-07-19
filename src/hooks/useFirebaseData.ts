import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database, userId } from '../firebase/config';
import { PortfolioData, Education, Experience, Project, SkillCategory, SocialLink } from '../types';

export function useFirebaseData() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          
          // Transform Firebase data to match our types
          const transformedData: PortfolioData = {
            hero: {
              name: userData.full_name || '',
              title: userData.bio || '',
              image: userData.image_url || '',
              socialLinks: userData.social_links ? Object.values(userData.social_links).map((link: any) => ({
                name: link.platform_name,
                url: link.url,
                icon: link.icon
              })) : []
            },
            education: userData.education ? Object.values(userData.education).map((edu: any) => ({
              degree: edu.degree,
              school: edu.school,
              period: `${new Date(edu.start_date).getFullYear()} – ${edu.current ? 'en cours' : new Date(edu.end_date).getFullYear()}`,
              description: edu.description,
              current: edu.current
            })) : [],
            skills: {
              categories: userData.skill_categories ? Object.values(userData.skill_categories).map((category: any) => ({
                title: category.title,
                icon: category.icon,
                skills: category.skills || []
              })) : []
            },
            experience: userData.experiences ? Object.values(userData.experiences).map((exp: any) => ({
              title: exp.title,
              company: exp.company,
              period: `${new Date(exp.start_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} – ${new Date(exp.end_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
              description: exp.tasks || []
            })) : [],
            projects: userData.projects ? Object.values(userData.projects).map((project: any) => ({
              name: project.name,
              description: project.description,
              stack: project.stack || [],
              category: project.category,
              icon: project.icon,
              link: project.link || undefined
            })) : [],
            contact: {
              email: userData.email || '',
              phone: '+212 679-084-271', // You might want to add this to Firebase
              socialLinks: userData.social_links ? Object.values(userData.social_links).map((link: any) => ({
                name: link.platform_name,
                url: link.url,
                icon: link.icon
              })) : []
            }
          };
          
          setData(transformedData);
        } else {
          setError('No data found for this user');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from Firebase');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}