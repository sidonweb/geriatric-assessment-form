import { z } from 'zod';
import { assessmentSchema } from './schema';

type AssessmentInput = z.input<typeof assessmentSchema>;

// empty inputs hold '', null or false, which the schema's input type doesn't allow
export type AssessmentFormValues = Omit<
  AssessmentInput,
  | 'dateOfBirth'
  | 'assessmentDate'
  | 'followUpDate'
  | 'mobility'
  | 'barthelIndex'
  | 'medicationCount'
  | 'consentObtained'
> & {
  dateOfBirth: AssessmentInput['dateOfBirth'] | null;
  assessmentDate: AssessmentInput['assessmentDate'] | null;
  followUpDate: AssessmentInput['followUpDate'] | null;
  mobility: AssessmentInput['mobility'] | null;
  barthelIndex: AssessmentInput['barthelIndex'] | '';
  medicationCount: AssessmentInput['medicationCount'] | '';
  consentObtained: boolean;
};
