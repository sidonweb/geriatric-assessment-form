import type { Assessment } from './schema';

// no backend, so just pretend to save
export function saveAssessment(_values: Assessment) {
  return new Promise<void>((resolve) => setTimeout(resolve, 800));
}
