import { render, screen, userEvent, waitFor } from '@test-utils';
import { AssessmentForm } from './AssessmentForm';
import { samplePatient } from './fixtures';

describe('AssessmentForm', () => {
  it('saves the parsed sample patient', async () => {
    const onSave = vi.fn(() => Promise.resolve());
    render(<AssessmentForm onSave={onSave} />);

    await userEvent.click(screen.getByRole('button', { name: 'Load sample patient' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save assessment' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(samplePatient));
    expect(await screen.findByText('Assessment saved')).toBeInTheDocument();
  });
});
