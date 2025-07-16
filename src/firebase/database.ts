import { database } from './config';
import { ref, get, set, push, remove, update } from 'firebase/database';

// User operations
export const getUserData = async (userId: string) => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateUserData = async (userId: string, data: any) => {
  const userRef = ref(database, `users/${userId}`);
  await update(userRef, data);
};

// Education operations
export const getEducation = async (userId: string) => {
  const educationRef = ref(database, `users/${userId}/education`);
  const snapshot = await get(educationRef);
  return snapshot.exists() ? snapshot.val() : {};
};

export const addEducation = async (userId: string, educationData: any) => {
  const educationRef = ref(database, `users/${userId}/education`);
  const newEducationRef = push(educationRef);
  await set(newEducationRef, educationData);
  return newEducationRef.key;
};

export const updateEducation = async (userId: string, educationId: string, educationData: any) => {
  const educationRef = ref(database, `users/${userId}/education/${educationId}`);
  await update(educationRef, educationData);
};

export const deleteEducation = async (userId: string, educationId: string) => {
  const educationRef = ref(database, `users/${userId}/education/${educationId}`);
  await remove(educationRef);
};

// Experience operations
export const getExperiences = async (userId: string) => {
  const experiencesRef = ref(database, `users/${userId}/experiences`);
  const snapshot = await get(experiencesRef);
  return snapshot.exists() ? snapshot.val() : {};
};

export const addExperience = async (userId: string, experienceData: any) => {
  const experiencesRef = ref(database, `users/${userId}/experiences`);
  const newExperienceRef = push(experiencesRef);
  await set(newExperienceRef, experienceData);
  return newExperienceRef.key;
};

export const updateExperience = async (userId: string, experienceId: string, experienceData: any) => {
  const experienceRef = ref(database, `users/${userId}/experiences/${experienceId}`);
  await update(experienceRef, experienceData);
};

export const deleteExperience = async (userId: string, experienceId: string) => {
  const experienceRef = ref(database, `users/${userId}/experiences/${experienceId}`);
  await remove(experienceRef);
};

// Projects operations
export const getProjects = async (userId: string) => {
  const projectsRef = ref(database, `users/${userId}/projects`);
  const snapshot = await get(projectsRef);
  return snapshot.exists() ? snapshot.val() : {};
};

export const addProject = async (userId: string, projectData: any) => {
  const projectsRef = ref(database, `users/${userId}/projects`);
  const newProjectRef = push(projectsRef);
  await set(newProjectRef, projectData);
  return newProjectRef.key;
};

export const updateProject = async (userId: string, projectId: string, projectData: any) => {
  const projectRef = ref(database, `users/${userId}/projects/${projectId}`);
  await update(projectRef, projectData);
};

export const deleteProject = async (userId: string, projectId: string) => {
  const projectRef = ref(database, `users/${userId}/projects/${projectId}`);
  await remove(projectRef);
};

// Skills operations
export const getSkills = async (userId: string) => {
  const skillsRef = ref(database, `users/${userId}/skill_categories`);
  const snapshot = await get(skillsRef);
  return snapshot.exists() ? snapshot.val() : {};
};

export const updateSkills = async (userId: string, skillsData: any) => {
  const skillsRef = ref(database, `users/${userId}/skill_categories`);
  await set(skillsRef, skillsData);
};

// Social Links operations
export const getSocialLinks = async (userId: string) => {
  const socialLinksRef = ref(database, `users/${userId}/social_links`);
  const snapshot = await get(socialLinksRef);
  return snapshot.exists() ? snapshot.val() : {};
};

export const addSocialLink = async (userId: string, socialLinkData: any) => {
  const socialLinksRef = ref(database, `users/${userId}/social_links`);
  const newSocialLinkRef = push(socialLinksRef);
  await set(newSocialLinkRef, socialLinkData);
  return newSocialLinkRef.key;
};

export const updateSocialLink = async (userId: string, socialLinkId: string, socialLinkData: any) => {
  const socialLinkRef = ref(database, `users/${userId}/social_links/${socialLinkId}`);
  await update(socialLinkRef, socialLinkData);
};

export const deleteSocialLink = async (userId: string, socialLinkId: string) => {
  const socialLinkRef = ref(database, `users/${userId}/social_links/${socialLinkId}`);
  await remove(socialLinkRef);
};