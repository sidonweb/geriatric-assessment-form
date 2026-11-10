import { createTheme } from '@mantine/core';

const fontFamily =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif';

export const theme = createTheme({
  fontFamily,
  primaryColor: 'blue',
  defaultRadius: 'md',
  headings: {
    fontFamily,
    fontWeight: '600',
  },
});
