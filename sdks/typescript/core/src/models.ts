export interface Skill {
  name: string;
  proficiency: number | null;
  years_of_experience: number | null;
}

export interface Experience {
  id: string;
  company: string;
  job_title: string;
  date_start: string | null;
  date_end: string | null;
  job_description: string | null;
}

export interface Project {
  name: string;
  date_start: string;
  date_end: string;
  languages_used: string[] | null;
  frameworks_used: string[] | null;
  technologies_used: string[] | null;
  description: string;
  github_url: string | null;
  demo_url: string | null;
  thumbnail_url: string | null;
}

export interface Course {
  name: string;
  grade: string | null;
  description: string | null;
}

export interface Education {
  degree: string;
  majors: string[];
  minors: string[];
  gpa: number | null;
  institution: string;
  awards: string[];
  year_start: number | null;
  year_end: number | null;
  courses: Course[];
}

export interface Subscription {
  status: string | null;
  price_id: string | null;
}

export interface UserData {
  email: string;
  name: string | null;
  bio: string | null;
  current_position: string | null;
  current_company: string | null;
  phone_number: string | null;
  current_address: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portrait_url: string | null;
  resume_url: string | null;
  transcript_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  subscription: Subscription | null;
}

export interface UserDataResponse {
  userInfo: UserData;
}
