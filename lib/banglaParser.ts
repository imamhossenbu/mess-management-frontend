export function parseBanglaNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return value;

  const banglaToEnglishMap: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };

  // Replace Bangla numerals with English numerals
  const englishString = value.replace(/[০-৯]/g, (match) => banglaToEnglishMap[match]);

  // Parse to float, return 0 if NaN
  const parsed = parseFloat(englishString);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatBanglaNumber(value: number): string {
  if (isNaN(value)) return "০";
  // The locale 'bn-BD' formats numbers with Bangla numerals
  return value.toLocaleString('bn-BD', {
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}
