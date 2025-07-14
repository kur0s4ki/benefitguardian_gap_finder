// Database type definitions for GapGuardian Gold Standard™️ Analysis
export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user'
}

export const UserProfileSchema = {
  id: 'string', // UUID from auth.users
  full_name: 'string',
  email: 'string',
  role: 'string', // 'admin' | 'user'
  is_approved: 'boolean',
  created_at: 'string',
  updated_at: 'string'
}

// Assessment data schema (for future database storage)
export const AssessmentSchema = {
  id: 'string',
  user_id: 'string',
  profession: 'string',
  years_of_service: 'number',
  current_age: 'number',
  retirement_age: 'number',
  current_pension: 'number',
  other_savings: 'number',
  assessment_data: 'object', // JSON field
  calculated_results: 'object', // JSON field
  created_at: 'string',
  updated_at: 'string'
}
