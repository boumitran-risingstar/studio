
import type { Option } from '@/components/ui/multi-select';

export const PROFESSIONS: Option[] = [
  // Healthcare
  { value: 'physician', label: 'Physician / Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'therapist', label: 'Therapist' },
  { value: 'medical-technologist', label: 'Medical Technologist' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'veterinarian', label: 'Veterinarian' },
  { value: 'optometrist', label: 'Optometrist' },

  // Technology
  { value: 'software-developer', label: 'Software Developer / Engineer' },
  { value: 'data-scientist', label: 'Data Scientist' },
  { value: 'it-specialist', label: 'IT Specialist' },
  { value: 'ux-ui-designer', label: 'UX/UI Designer' },
  { value: 'systems-analyst', label: 'Systems Analyst' },
  { value: 'network-administrator', label: 'Network Administrator' },
  { value: 'cybersecurity-analyst', label: 'Cybersecurity Analyst' },

  // Business & Finance
  { value: 'accountant', label: 'Accountant' },
  { value: 'financial-analyst', label: 'Financial Analyst' },
  { value: 'management-consultant', label: 'Management Consultant' },
  { value: 'human-resources-manager', label: 'Human Resources Manager' },
  { value: 'marketing-manager', label: 'Marketing Manager' },
  { value: 'sales-manager', label: 'Sales Manager' },
  { value: 'project-manager', label: 'Project Manager' },

  // Education
  { value: 'teacher', label: 'Teacher / Educator' },
  { value: 'professor', label: 'Professor / Lecturer' },
  { value: 'school-administrator', label: 'School Administrator' },
  { value: 'librarian', label: 'Librarian' },
  { value: 'instructional-designer', label: 'Instructional Designer' },

  // Legal
  { value: 'lawyer', label: 'Lawyer / Attorney' },
  { value: 'paralegal', label: 'Paralegal' },
  { value: 'judge', label: 'Judge' },
  
  // Arts, Design & Media
  { value: 'graphic-designer', label: 'Graphic Designer' },
  { value: 'writer', label: 'Writer / Author' },
  { value: 'editor', label: 'Editor' },
  { value: 'journalist', label: 'Journalist' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'musician', label: 'Musician' },
  { value: 'architect', label: 'Architect' },

  // Skilled Trades & Engineering
  { value: 'civil-engineer', label: 'Civil Engineer' },
  { value: 'mechanical-engineer', label: 'Mechanical Engineer' },
  { value: 'electrical-engineer', label: 'Electrical Engineer' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'carpenter', label: 'Carpenter' },
  
  // Other
  { value: 'scientist', label: 'Scientist' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];
