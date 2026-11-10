// home_visit -> "Home visit"
export function toLabel(value: string) {
  const words = value.replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
