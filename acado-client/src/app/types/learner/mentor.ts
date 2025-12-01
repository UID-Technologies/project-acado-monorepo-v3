export interface SocialLinks {
  mob_num: string;
  email: string;
  linkedin: string;
  bee: string;
  dribble: string;
  insta: string;
  facebook: string;
  twitter: string;
  pinterest: string;
  other: string;
  site_url: string;
  mob_num_hidden: number;
  email_hidden: number;
}

export interface Mentor {
  id: number;
  name: string;
  email: string;
  social_links: SocialLinks | [];
}

export interface MentorApiResponse {
  status: number;
  data: Mentor[];
  error: string;
}
