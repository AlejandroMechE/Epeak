export type ProjectStatus = 'Discovery' | 'Architecture' | 'Development' | 'Integration' | 'Optimization' | 'Deployment' | 'Maintenance' | 'Review' | 'Beta' | 'Launch';

export type MilestoneStatus = 'pending' | 'active' | 'completed';

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  order: number;
}

export interface Ticket {
  id: string;
  project_id: string;
  client_id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  is_active: boolean;
  total_price: number;
  currency: string;
  payload: Record<string, any>;
  package_details?: any;
  created_at: string;
  updated_at?: string;
  milestones?: Milestone[];
}

export interface ProjectDocument {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}
