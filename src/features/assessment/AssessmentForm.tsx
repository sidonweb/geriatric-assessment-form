import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Divider,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { toLabel } from './labels';
import { samplePatient } from './samplePatient';
import { saveAssessment } from './saveAssessment';
import { assessmentSchema, MOBILITY, type Assessment } from './schema';
import type { AssessmentFormValues } from './types';

const mobilityOptions = MOBILITY.map((value) => ({ value, label: toLabel(value) }));

const emptyValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: null,
  assessmentDate: null,
  mobility: null,
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: null,
  consentObtained: false,
};

interface AssessmentFormProps {
  onSave?: (values: Assessment) => Promise<void>;
}

export function AssessmentForm({ onSave = saveAssessment }: AssessmentFormProps) {
  const [saved, setSaved] = useState<Assessment | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const form = useForm<AssessmentFormValues, Assessment>({
    mode: 'uncontrolled',
    initialValues: emptyValues,
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
    // only runs after validation passed, so parse won't throw. gives us zod's output (trimmed etc)
    transformValues: (values) => assessmentSchema.parse(values),
  });

  const today = dayjs().format('YYYY-MM-DD');

  const handleSubmit = async (values: Assessment) => {
    setSaved(null);
    await onSave(values);
    setSaved(values);
  };

  const loadSample = () => {
    form.setValues(samplePatient);
    form.clearErrors();
  };

  useEffect(() => {
    if (saved) {
      alertRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [saved]);

  return (
    <Container size="sm" py="xl">
      <Stack gap={4} mb="lg">
        <Title order={2}>Geriatric care assessment</Title>
        <Text c="dimmed">Record a home visit for an elderly patient.</Text>
      </Stack>

      <Paper withBorder radius="lg" p="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Patient
                </Text>
                <Button variant="subtle" size="xs" onClick={loadSample}>
                  Load sample patient
                </Button>
              </Group>
              <TextInput
                label="Medical record number"
                placeholder="MRN-004821"
                key={form.key('mrn')}
                {...form.getInputProps('mrn')}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="Patient name"
                  key={form.key('patientName')}
                  {...form.getInputProps('patientName')}
                />
                <DateInput
                  label="Date of birth"
                  key={form.key('dateOfBirth')}
                  {...form.getInputProps('dateOfBirth')}
                />
              </SimpleGrid>
            </Stack>

            <Divider />

            <Stack gap="sm">
              <Text size="sm" c="dimmed">
                Visit
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <DateInput
                  label="Assessment date"
                  maxDate={today}
                  key={form.key('assessmentDate')}
                  {...form.getInputProps('assessmentDate')}
                />
                <DateInput
                  label="Next review date"
                  key={form.key('followUpDate')}
                  {...form.getInputProps('followUpDate')}
                />
              </SimpleGrid>
            </Stack>

            <Divider />

            <Stack gap="sm">
              <Text size="sm" c="dimmed">
                Clinical
              </Text>
              <Select
                label="Mobility"
                data={mobilityOptions}
                key={form.key('mobility')}
                {...form.getInputProps('mobility')}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <NumberInput
                  label="Barthel Index"
                  description="Daily living score, higher is more independent"
                  step={5}
                  min={0}
                  max={100}
                  clampBehavior="none"
                  key={form.key('barthelIndex')}
                  {...form.getInputProps('barthelIndex')}
                />
                <NumberInput
                  label="Regular medications"
                  description="Medicines the patient takes on a regular basis"
                  min={0}
                  max={30}
                  clampBehavior="none"
                  key={form.key('medicationCount')}
                  {...form.getInputProps('medicationCount')}
                />
              </SimpleGrid>
              <Checkbox
                label="Pharmacist review requested"
                key={form.key('pharmacistReviewRequested')}
                {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
              />
            </Stack>

            <Divider />

            <Stack gap="sm">
              <Text size="sm" c="dimmed">
                Sign-off
              </Text>
              <Checkbox
                label="Patient or representative has given consent"
                key={form.key('consentObtained')}
                {...form.getInputProps('consentObtained', { type: 'checkbox' })}
              />
            </Stack>

            <Button type="submit" size="md" fullWidth loading={form.submitting}>
              Save assessment
            </Button>
          </Stack>
        </form>
      </Paper>

      {saved && (
        <Alert ref={alertRef} color="green" title="Assessment saved" mt="lg" radius="lg">
          <Code block>{JSON.stringify(saved, null, 2)}</Code>
        </Alert>
      )}
    </Container>
  );
}
