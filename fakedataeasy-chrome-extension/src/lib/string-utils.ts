export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, '');
}

export function isNullOrEmpty(val: string | null | undefined): boolean {
  if (val === undefined || val === null) return true;
  return val.trim() === '';
}
