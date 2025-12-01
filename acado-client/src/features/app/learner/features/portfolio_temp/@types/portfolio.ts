export interface Education {
    degree: string
    school: string
    year: string
    description: string
}

export interface Experience {
    title: string
    company: string
    duration: string
    description: string
}

export interface Skill {
    name: string
    level: number // 1-5
    category: string
}

export interface SocialLink {
    platform: string
    url: string
    icon: string
}

export interface PersonalInfo {
    fullName: string
    title: string
    email: string
    phone: string
    location: string
    bio: string
    avatar: string
}

export interface Portfolio {
    personalInfo: PersonalInfo
    education: Education[]
    experience: Experience[]
    skills: Skill[]
    socialLinks: SocialLink[]
    hobbies: string[]
}