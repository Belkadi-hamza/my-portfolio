import { ref, get } from 'firebase/database';
import { database, userId } from './config';
import { PortfolioData } from '../types';

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as PortfolioData;
    } else {
      throw new Error('No data available');
    }
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
}

export async function getHeroData() {
  try {
    const heroRef = ref(database, `users/${userId}/hero`);
    const snapshot = await get(heroRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching hero data:', error);
    throw error;
  }
}

export async function getEducationData() {
  try {
    const educationRef = ref(database, `users/${userId}/education`);
    const snapshot = await get(educationRef);
    return snapshot.exists() ? snapshot.val() : [];
  } catch (error) {
    console.error('Error fetching education data:', error);
    throw error;
  }
}

export async function getSkillsData() {
  try {
    const skillsRef = ref(database, `users/${userId}/skills`);
    const snapshot = await get(skillsRef);
    return snapshot.exists() ? snapshot.val() : { categories: [] };
  } catch (error) {
    console.error('Error fetching skills data:', error);
    throw error;
  }
}

export async function getExperienceData() {
  try {
    const experienceRef = ref(database, `users/${userId}/experience`);
    const snapshot = await get(experienceRef);
    return snapshot.exists() ? snapshot.val() : [];
  } catch (error) {
    console.error('Error fetching experience data:', error);
    throw error;
  }
}

export async function getProjectsData() {
  try {
    const projectsRef = ref(database, `users/${userId}/projects`);
    const snapshot = await get(projectsRef);
    return snapshot.exists() ? snapshot.val() : [];
  } catch (error) {
    console.error('Error fetching projects data:', error);
    throw error;
  }
}

export async function getContactData() {
  try {
    const contactRef = ref(database, `users/${userId}/contact`);
    const snapshot = await get(contactRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching contact data:', error);
    throw error;
  }
}