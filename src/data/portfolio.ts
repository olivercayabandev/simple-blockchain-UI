export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  outcome?: string;
  link?: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface ContactMethod {
  type: 'email' | 'linkedin' | 'github' | 'website';
  url: string;
  label: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  about: string;
  experience: Experience[];
  skills: SkillCategory[];
  projects: Project[];
  services: Service[];
  contact: ContactMethod[];
}

export const portfolioData: PortfolioData = {
  name: "Oliver Cayaban",
  title: "Engineer",
  tagline: "Building innovative solutions with code and creativity",
  about: "I am a passionate software engineer with experience in building scalable applications and solving complex technical challenges. I thrive on creating elegant solutions to difficult problems and continuously learning new technologies.",
  experience: [
    {
      company: "Tech Company",
      role: "Senior Software Engineer",
      startDate: "2022",
      endDate: "Present",
      description: "Led development of microservices architecture, improving system reliability by 40%"
    },
    {
      company: "Startup Inc",
      role: "Software Engineer",
      startDate: "2020",
      endDate: "2022",
      description: "Built and maintained full-stack web applications serving 100k+ users"
    },
    {
      company: "Digital Agency",
      role: "Junior Developer",
      startDate: "2018",
      endDate: "2020",
      description: "Developed responsive websites and web applications for various clients"
    }
  ],
  skills: [
    {
      name: "Programming Languages",
      skills: [
        { name: "TypeScript", level: 90 },
        { name: "JavaScript", level: 90 },
        { name: "Python", level: 75 },
        { name: "Go", level: 60 }
      ]
    },
    {
      name: "Frontend",
      skills: [
        { name: "React", level: 90 },
        { name: "Tailwind CSS", level: 85 },
        { name: "Next.js", level: 80 }
      ]
    },
    {
      name: "Backend",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "PostgreSQL", level: 75 },
        { name: "GraphQL", level: 70 }
      ]
    },
    {
      name: "Tools & Practices",
      skills: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 75 },
        { name: "CI/CD", level: 70 }
      ]
    }
  ],
  projects: [
    {
      title: "Ashley - Secure Multi-Step Form",
      description: "A secure student registration system demonstrating HTTP requests, form processing, input validation, and state management without database.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      outcome: "Implements server-side validation patterns in React",
      link: "/ashley"
    },
    {
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with real-time inventory management",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      outcome: "Processing $50k monthly transactions"
    },
    {
      title: "Task Management App",
      description: "Collaborative task management tool with real-time updates",
      technologies: ["React", "Firebase", "Tailwind CSS"],
      outcome: "Used by 500+ teams"
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time data visualization dashboard for business metrics",
      technologies: ["TypeScript", "D3.js", "GraphQL"],
      outcome: "Reduced reporting time by 80%"
    }
  ],
  services: [
    {
      title: "Web Development",
      description: "Custom web applications built with modern technologies",
      icon: "Code"
    },
    {
      title: "Technical Consulting",
      description: "Architecture reviews and technical strategy guidance",
      icon: "Lightbulb"
    },
    {
      title: "Code Review",
      description: "Comprehensive code reviews to improve quality and maintainability",
      icon: "Search"
    }
  ],
  contact: [
    {
      type: "email",
      url: "mailto:olivercayaban.dev@gmail.com",
      label: "olivercayaban3@gmail.com"
    },
    {
      type: "linkedin",
      url: "https://linkedin.com/in/olivercayaban",
      label: "LinkedIn"
    },
    {
      type: "github",
      url: "https://github.com/olivercayaban",
      label: "GitHub"
    }
  ]
};
