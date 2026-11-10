import dayjs from 'dayjs';
import {
  Button,
  Checkbox,
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
import { assessmentSchema, MOBILITY } from './schema';
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

export function AssessmentForm() {
  const form = useForm<AssessmentFormValues>({
    mode: 'uncontrolled',
    initialValues: emptyValues,
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
  });

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <Container size="sm" py="xl">
      <Stack gap={4} mb="lg">
        <Title order={2}>Geriatric care assessment</Title>
        <Text c="dimmed">Record a home visit for an elderly patient.</Text>
      </Stack>

      <Paper withBorder radius="lg" p="xl">
        {/* save gets wired up in the next step */}
        <form onSubmit={form.onSubmit(() => {})}>
          <Stack gap="lg">
            <Stack gap="sm">
              <Text size="sm" c="dimmed">
                Patient
              </Text>
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

            <Group justify="flex-end">
              <Button type="submit">Save assessment</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
