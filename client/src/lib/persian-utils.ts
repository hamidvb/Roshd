// Persian/Farsi utility functions for the student profile system

export const persianMonths = [
  '', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const growthDimensionLabels: Record<string, string> = {
  spiritual_religious: 'رشد دینی و معنوی',
  emotional_moral: 'رشد عاطفی و اخلاقی',
  scientific_research: 'رشد علمی، پژوهشی و فناورانه',
  economic_professional: 'رشد اقتصادی و حرفه‌ای',
  social_political: 'رشد اجتماعی و سیاسی',
  patriotic: 'رشد میهن‌دوستی',
  artistic_aesthetic: 'رشد هنری و زیباشناختی',
  biological_physical: 'رشد زیستی و جسمانی',
};

export const roleLabels: Record<string, string> = {
  student: 'دانش‌آموز',
  parent: 'والدین',
  teacher: 'معلم',
  counselor: 'مشاور',
  admin: 'مدیر سیستم',
};

export const priorityLabels: Record<string, string> = {
  high: 'اولویت بالا',
  medium: 'اولویت متوسط',
  low: 'اولویت پایین',
};

export const statusLabels: Record<string, string> = {
  active: 'فعال',
  completed: 'تکمیل شده',
  dismissed: 'رد شده',
  pending: 'در انتظار',
};

export const activityTypeLabels: Record<string, string> = {
  academic: 'آموزشی',
  social: 'اجتماعی',
  artistic: 'هنری',
  physical: 'بدنی',
  spiritual: 'معنوی',
  research: 'پژوهشی',
};

// Convert Gregorian date to Persian date display
export function formatPersianDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Time ago in Persian
export function getTimeAgoPersian(date: Date | string): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diffInHours = Math.floor((now.getTime() - target.getTime()) / (1000 * 3600));
  
  if (diffInHours < 1) return 'اکنون';
  if (diffInHours === 1) return '۱ ساعت پیش';
  if (diffInHours < 24) return `${toPersianNumbers(diffInHours)} ساعت پیش`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'دیروز';
  if (diffInDays < 7) return `${toPersianNumbers(diffInDays)} روز پیش`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${toPersianNumbers(weeks)} هفته پیش`;
  }
  
  const months = Math.floor(diffInDays / 30);
  return `${toPersianNumbers(months)} ماه پیش`;
}

// Convert English numbers to Persian numbers
export function toPersianNumbers(num: number | string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianNumbers[parseInt(digit)]);
}

// Convert Persian numbers to English numbers
export function toEnglishNumbers(str: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let result = str;
  persianNumbers.forEach((persian, index) => {
    result = result.replace(new RegExp(persian, 'g'), index.toString());
  });
  return result;
}

// Validate Persian text (contains Persian characters)
export function isPersianText(text: string): boolean {
  const persianRegex = /[\u0600-\u06FF]/;
  return persianRegex.test(text);
}

// Format score with Persian percentage
export function formatScore(score: number): string {
  return `${toPersianNumbers(Math.round(score))}٪`;
}

// Get appropriate greeting based on time of day
export function getPersianGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'صبح بخیر';
  if (hour < 17) return 'ظهر بخیر';
  if (hour < 20) return 'عصر بخیر';
  return 'شب بخیر';
}

// Truncate Persian text properly (considering RTL)
export function truncatePersianText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1) + '…';
}
