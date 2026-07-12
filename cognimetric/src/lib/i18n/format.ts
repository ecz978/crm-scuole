/** Replaces {token} placeholders in a translated string, e.g. format("Question {current} of {total}", { current: 1, total: 6 }) */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
