
export interface ProfileData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
}
