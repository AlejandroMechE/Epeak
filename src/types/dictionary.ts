export interface Dictionary {
  navigation: {
    home: string;
    showcase: string;
    expertise: string;
    about: string;
    contact: string;
    portal: string;
    logout: string;
    sign_in: string;
    get_started: string;
  };
  hero: {
    greeting: string;
    title_part1: string;
    title_part2: string;
    title_part3: string;
    subtitle: string;
    cta: string;
  };
  experience: {
    title: string;
    roles: Array<{
      id: string;
      title: string;
      company: string;
      description: string;
      tags: string[];
    }>;
  };
  common: {
    view_case_study: string;
  };
  expertise: {
    title: string;
    categories: Array<{
      id: string;
      title: string;
      skills: Array<{
        name: string;
        symbol: string;
      }>;
      icon: string;
    }>;
  };
  about: {
    title: string;
    company: {
      name: string;
      tagline: string;
      description: string;
    };
    founderTitle: string;
    name: string;
    role: string;
    description: string;
    location: string;
    location_label: string;
    citizenship: string;
    citizenship_label: string;
    pillars: Array<{
      id: string;
      title: string;
      subtitle: string;
      content: string;
    }>;
  };
  footer: {
    contact_title: string;
    email_label: string;
    linkedin_label: string;
    branding_title: string;
    company_name: string;
    copyright: string;
    back_to_top: string;
  };
  manifesto: {
    title: string;
    statement: string;
    subtext: string;
  };
  solutions: {
    items: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  services: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  auth: any;
  sales: any;
  portal: any;
  engine: any;
}
