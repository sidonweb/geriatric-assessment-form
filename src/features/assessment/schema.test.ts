import { samplePatient } from './samplePatient';
import { assessmentSchema } from './schema';

describe('assessmentSchema', () => {
  it('accepts a patient who turns 60 on the assessment date and rejects one day short', () => {
    // assessmentDate in the fixture is 2026-08-07
    const exactly60 = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-07' });
    expect(exactly60.success).toBe(true);

    const oneDayShort = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-08' });
    expect(oneDayShort.success).toBe(false);
    expect(oneDayShort.error?.issues).toEqual([
      expect.objectContaining({
        path: ['dateOfBirth'],
        message: 'This pathway is for patients aged 60 and over',
      }),
    ]);
  });
});
