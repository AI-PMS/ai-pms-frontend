// types/index.ts
export interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'officer' | 'supervisor';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  institution_name: string;
  institution_code: string;
  created_at: string;
  last_login?: string;
}

export interface Prisoner {
  id: string;
  prisoner_id: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  gender: 'male' | 'female';
  date_of_birth: string;
  nationality: string;
  id_number: string;
  crime: string;
  sentence_duration: string;
  date_admitted: string;
  expected_release_date?: string;
  status: 'remand' | 'convicted' | 'released' | 'transferred';
  cell_id: string;
  medical_conditions?: string[];
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: string;
  prisoner_id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  id_number: string;
  phone: string;
  visit_date: string;
  purpose: string;
  items_brought?: string[];
  approved: boolean;
  approved_by?: string;
  created_by: string;
  created_at: string;
  prisoner_name?: string;
  prisoner_number?: string;
}

export interface Cell {
  id: string;
  cell_number: string;
  block: string;
  capacity: number;
  current_occupancy: number;
  status: 'available' | 'full' | 'maintenance';
  created_by: string;
  created_at: string;
  occupancy_percentage?: number;
}

export interface Officer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}

export interface OfficerDuty {
  id: string;
  officer_id: string;
  date: string;
  shift: string;
  block_assigned: string;
  notes?: string;
  created_at: string;
  officer_name: string;
  officer_phone?: string;
  officer_email?: string;
}

export interface SystemStatus {
  user_count: number;
  registration_allowed: boolean;
  first_user_registration: boolean;
}

export interface DashboardSummary {
  total_prisoners: number;
  prisoners_this_week: number;
  visitors_today: number;
  visitors_this_week: number;
  total_cells: number;
  officers_on_duty_today: number;
}