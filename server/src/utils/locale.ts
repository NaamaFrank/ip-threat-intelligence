
let displayNames: Intl.DisplayNames | null = null;
try {
  displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
} catch {
  displayNames = null;
}

export function codeToCountry(code?: string | null): string | null {
  if (!code) return null;
  const name = displayNames?.of?.(code);
  return (typeof name === 'string' && name.length) ? name : code;
}
