import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CheckIcon,
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

function SectionTitle({ children }: { children: string }) {
  return (
    <Text size="xs" fw={700} tt="uppercase" c="dimmed" lts={0.6}>
      {children}
    </Text>
  );
}

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
    <Box bg="gray.0" mih="100vh">
      <Container size="sm" py={48}>
        <Stack gap={6} mb="xl">
          <Title order={2}>Geriatric care assessment</Title>
          <Text c="dimmed">Record a home visit for an elderly patient.</Text>
        </Stack>

        <Paper withBorder shadow="sm" radius="lg" p={{ base: 'lg', sm: 32 }}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="xl">
              <Stack gap="md">
                <Group justify="space-between">
                  <SectionTitle>Patient</SectionTitle>
                  <Button variant="light" size="compact-sm" radius="xl" onClick={loadSample}>
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
                    placeholder="Full name"
                    key={form.key('patientName')}
                    {...form.getInputProps('patientName')}
                  />
                  <DateInput
                    label="Date of birth"
                    placeholder="Pick a date"
                    key={form.key('dateOfBirth')}
                    {...form.getInputProps('dateOfBirth')}
                  />
                </SimpleGrid>
              </Stack>

              <Divider />

              <Stack gap="md">
                <SectionTitle>Visit</SectionTitle>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <DateInput
                    label="Assessment date"
                    placeholder="Pick a date"
                    maxDate={today}
                    key={form.key('assessmentDate')}
                    {...form.getInputProps('assessmentDate')}
                  />
                  <DateInput
                    label="Next review date"
                    placeholder="Pick a date"
                    key={form.key('followUpDate')}
                    {...form.getInputProps('followUpDate')}
                  />
                </SimpleGrid>
              </Stack>

              <Divider />

              <Stack gap="md">
                <SectionTitle>Clinical</SectionTitle>
                <Select
                  label="Mobility"
                  placeholder="Select mobility status"
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

              <Stack gap="md">
                <SectionTitle>Sign-off</SectionTitle>
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
          <Alert
            ref={alertRef}
            variant="light"
            color="teal"
            radius="lg"
            mt="xl"
            title="Assessment saved"
            icon={<CheckIcon size={14} />}
          >
            <Code block bg="white">
              {JSON.stringify(saved, null, 2)}
            </Code>
          </Alert>
        )}
      </Container>
    </Box>
  );
}
