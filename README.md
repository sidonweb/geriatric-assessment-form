# Geriatric care assessment

A one-page form a visiting nurse fills in when checking on an elderly patient at home. React 19, TypeScript, Mantine 9 and Zod 4, validated with `@mantine/form`'s `schemaResolver` against the schema from the brief.

Live URL: __

## Running it

The template uses Yarn 4, so enable it through corepack first:

```
corepack enable
yarn install
yarn dev
```

`yarn test` runs format check, lint, typecheck, stylelint, the two Vitest tests and the production build.

## Decisions

**Form values vs `Assessment`.** `Assessment` comes from `z.infer` in `schema.ts` and is what the app works with after a save. The form itself can't hold an `Assessment` while it's empty, so `types.ts` derives `AssessmentFormValues` from `z.input<typeof assessmentSchema>` and only overrides the fields that need an empty state: dates and mobility can be `null`, the two numbers can be `''` (what `NumberInput` gives when empty), and `consentObtained` is `boolean` because the schema's input type is literally `true`.

**Getting parsed values to `onSave`.** In `@mantine/form` 9.8.0 `schemaResolver` only returns errors, it doesn't hand the parsed output to `onSubmit`. So the form uses `transformValues: (values) => assessmentSchema.parse(values)`. Mantine only calls it after validation passes, so the parse can't throw, and `onSubmit` receives a real `Assessment` (trimmed strings and all). That's what goes to `onSave` and what the success alert prints. I used `schemaResolver(..., { sync: true })` since nothing in the schema is async.

**Numbers are never changed.** Both `NumberInput`s have `clampBehavior="none"` and decimals allowed, so 105 stays 105 and 82.5 stays 82.5, and Zod rejects them with its own message instead of the input quietly fixing them.

**Mobility options.** The `Select` options are built from `MOBILITY` with a small `toLabel` helper (`home_visit` -> "Home visit"), so adding a value to the array is the only edit needed.

**`maxDate` only on assessment date.** The brief asks for `maxDate = today` there. I didn't add min/max dates to date of birth or next review date, because those rules (age 60+, review after assessment) belong to the schema and I didn't want a second copy of them in the UI.

## Ambiguities and the call I made

- **Styling.** The brief says no custom styling, so there's no CSS at all. The look comes from a few theme settings (system font, radius, heading weight) and component props.
- **Responsive.** "No responsive work beyond what Mantine gives you for free": the only responsive bit is `SimpleGrid cols={{ base: 1, sm: 2 }}`, which is Mantine's own breakpoint prop.
- **`mobility: 'crutches'`.** The `Select` can't produce a value outside `MOBILITY`, so this case can't happen through the UI. The schema still rejects it.
- **Cross-field errors can show up late.** Zod 4 skips the object-level `.refine()`s while any field has a missing or wrong-type value (blank number, no mobility, consent unchecked). They do still run when a field only fails a check like the MRN regex. So if you leave Barthel blank and enter a date of birth that's too recent, you only see "required" first, and the age error appears once Barthel is filled. I left this as is since it's how the given schema behaves, and it's what keeps a blank form at exactly 9 errors.
- **Template leftovers.** I removed the demo components and the router (the brief says no routing). I left the template's Storybook config alone but there are no stories. I pinned all `@mantine/*` packages to 9.8.0 because `@mantine/dates` wanted a newer core than the template had.
- **Stylelint script.** The template's `stylelint '**/*.css'` didn't work on Windows (cmd keeps the single quotes), and once the demo CSS was gone there were no CSS files, which stylelint treats as an error. I switched to double quotes and added `--allow-empty-input`. No lint rules changed.

## What I'd do next

- Show an error state if `onSave` rejects. Right now a failed save just stops the loading spinner.
- Remove the Storybook config and dependencies, since nothing uses them.
- Code-split `@mantine/dates`; the build warns that the main chunk is over 500 kB.
- Let nurses type dates in a local format like DD/MM/YYYY (needs dayjs `customParseFormat`).

Time spent: __ hours
