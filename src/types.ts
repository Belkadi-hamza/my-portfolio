export interface SocialLink {
    name: string;
    url: string;
    icon: string;
}

export interface HeroData {
    name: string;
    title: string;
    socialLinks: SocialLink[];
    image: string;
}

export interface Education {
    degree: string;
    school: string;
    period: string;
    description: string;
    current: boolean;
}

export interface Skill {
    name: string;
    level: number;
}

export interface SkillCategory {
    title: string;
    icon: 'Code' | 'Brain' | 'Database' | 'GitBranch' | 'Users';
    skills: Skill[];
}

export interface Experience {
    title: string;
    company: string;
    period: string;
    description: string[];
}

export interface Project {
    name: string;
    description: string;
    stack: string[];
    category: 'web' | 'ai' | 'all';
    icon: 'Code' | 'Book' | 'Video' | 'Camera' | 'Brain' | 'ShieldCheck';
    link?: string;
}

export interface ContactData {
    email: string;
    phone: string;
    socialLinks: SocialLink[];
}

export interface PortfolioData {
    hero: HeroData;
    education: Education[];
    skills: {
        categories: SkillCategory[];
    };
    experience: Experience[];
    projects: Project[];
    contact: ContactData;
}