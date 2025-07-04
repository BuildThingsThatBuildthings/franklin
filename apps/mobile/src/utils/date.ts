export function format(date: Date, formatStr: string): string {
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  const replacements: Record<string, string> = {
    'yyyy': date.getFullYear().toString(),
    'MM': pad(date.getMonth() + 1),
    'dd': pad(date.getDate()),
    'HH': pad(date.getHours()),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds()),
    'EEEE': date.toLocaleDateString('en-US', { weekday: 'long' }),
    'EEE': date.toLocaleDateString('en-US', { weekday: 'short' }),
    'MMMM': date.toLocaleDateString('en-US', { month: 'long' }),
    'MMM': date.toLocaleDateString('en-US', { month: 'short' }),
    'd': date.getDate().toString(),
  };

  let result = formatStr;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });
  
  return result;
}

export function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}