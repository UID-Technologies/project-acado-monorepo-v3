import { Portfolio } from '../types/portfolio'

export const portfolioData: Portfolio = {
    personalInfo: {
        fullName: "Jane Smith",
        title: "Computer Science Student",
        email: "jane.smith@university.edu",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        bio: "Final year Computer Science student passionate about web development and artificial intelligence. Looking for opportunities to apply my skills in a dynamic environment.",
        avatar: "/placeholder.svg?height=400&width=400"
    },
    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            school: "University of Technology",
            year: "2020 - Present",
            description: "Major in Software Engineering. Current GPA: 3.8/4.0"
        },
        {
            degree: "High School Diploma",
            school: "Central High School",
            year: "2016 - 2020",
            description: "Graduated with honors. Computer Science Club President"
        }
    ],
    experience: [
        {
            title: "Software Development Intern",
            company: "Tech Solutions Inc.",
            duration: "Summer 2023",
            description: "Developed and maintained web applications using React and Node.js. Collaborated with senior developers on client projects."
        },
        {
            title: "Student Research Assistant",
            company: "University AI Lab",
            duration: "2022 - Present",
            description: "Assisting in machine learning research projects. Implementing and testing neural network architectures."
        }
    ],
    skills: [
        { name: "JavaScript", level: 4, category: "Programming" },
        { name: "React", level: 4, category: "Frontend" },
        { name: "Python", level: 3, category: "Programming" },
        { name: "Node.js", level: 3, category: "Backend" },
        { name: "SQL", level: 3, category: "Database" },
        { name: "Git", level: 4, category: "Tools" }
    ],
    socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com/in/janesmith", icon: "linkedin" },
        { platform: "GitHub", url: "https://github.com/janesmith", icon: "github" },
        { platform: "Twitter", url: "https://twitter.com/janesmith", icon: "twitter" }
    ],
    hobbies: [
        "Photography",
        "Rock Climbing",
        "Playing Guitar",
        "Open Source Contributing",
        "Hiking"
    ]
}