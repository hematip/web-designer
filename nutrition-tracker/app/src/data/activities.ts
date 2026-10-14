// Activities with approximate MET values, based on the 2024 Adult Compendium of
// Physical Activities (pacompendium.com). Rounded to typical values for each description.
// Calories are estimated as net energy: (MET − 1) × kg × hours.

export interface ActivityDef {
  id: string;
  n: string;
  a?: string; // search aliases
  met: number;
  icon: 'walk' | 'mountain' | 'run' | 'bike' | 'swim' | 'ball' | 'gym' | 'yoga' | 'dance' | 'home' | 'stairs';
}

export const ACTIVITIES: ActivityDef[] = [
  { id: 'walk-slow', n: 'پیاده‌روی آرام', a: 'قدم زدن', met: 2.8, icon: 'walk' },
  { id: 'walk', n: 'پیاده‌روی معمولی', a: 'قدم زدن', met: 3.5, icon: 'walk' },
  { id: 'walk-fast', n: 'پیاده‌روی تند', a: 'پیاده روی سریع', met: 4.8, icon: 'walk' },
  { id: 'hike', n: 'کوه‌پیمایی', a: 'کوه کوهنوردی طبیعت‌گردی', met: 6.0, icon: 'mountain' },
  { id: 'hike-hard', n: 'کوهنوردی سنگین (شیب تند یا کوله)', a: 'کوه', met: 7.8, icon: 'mountain' },
  { id: 'stairs', n: 'بالا رفتن از پله', a: 'پله', met: 8.0, icon: 'stairs' },
  { id: 'jog', n: 'دویدن آهسته', a: 'دو', met: 8.3, icon: 'run' },
  { id: 'run', n: 'دویدن', a: 'دو', met: 9.8, icon: 'run' },
  { id: 'treadmill', n: 'تردمیل (پیاده‌روی تند)', a: 'تردمیل', met: 5.0, icon: 'walk' },
  { id: 'elliptical', n: 'الپتیکال', a: 'اسکی فضایی', met: 5.0, icon: 'gym' },
  { id: 'bike-easy', n: 'دوچرخه‌سواری تفریحی', a: 'دوچرخه', met: 4.0, icon: 'bike' },
  { id: 'bike', n: 'دوچرخه‌سواری متوسط', a: 'دوچرخه', met: 6.8, icon: 'bike' },
  { id: 'bike-stationary', n: 'دوچرخهٔ ثابت', a: 'دوچرخه ثابت', met: 7.0, icon: 'bike' },
  { id: 'swim-easy', n: 'شنای آرام', a: 'شنا استخر', met: 5.8, icon: 'swim' },
  { id: 'swim', n: 'شنای تند', a: 'شنا استخر', met: 9.8, icon: 'swim' },
  { id: 'football', n: 'فوتبال', a: 'فوتبال گل‌کوچیک', met: 7.0, icon: 'ball' },
  { id: 'futsal', n: 'فوتسال', a: 'فوتبال سالنی', met: 7.0, icon: 'ball' },
  { id: 'volleyball', n: 'والیبال تفریحی', a: 'والیبال', met: 3.5, icon: 'ball' },
  { id: 'basketball', n: 'بسکتبال', met: 6.5, icon: 'ball' },
  { id: 'tennis', n: 'تنیس', met: 7.3, icon: 'ball' },
  { id: 'badminton', n: 'بدمینتون', met: 5.5, icon: 'ball' },
  { id: 'pingpong', n: 'پینگ‌پنگ', a: 'تنیس روی میز', met: 4.0, icon: 'ball' },
  { id: 'weights', n: 'بدنسازی (متوسط)', a: 'باشگاه وزنه بدنسازی', met: 3.5, icon: 'gym' },
  { id: 'weights-hard', n: 'بدنسازی (سنگین)', a: 'باشگاه وزنه', met: 6.0, icon: 'gym' },
  { id: 'aerobic', n: 'ایروبیک / زومبا', a: 'ایروبیک زومبا', met: 6.5, icon: 'dance' },
  { id: 'jumprope', n: 'طناب‌زنی', a: 'طناب', met: 10.0, icon: 'gym' },
  { id: 'yoga', n: 'یوگا', met: 2.5, icon: 'yoga' },
  { id: 'pilates', n: 'پیلاتس', met: 3.0, icon: 'yoga' },
  { id: 'dance', n: 'رقص', a: 'رقصیدن', met: 4.5, icon: 'dance' },
  { id: 'cleaning', n: 'نظافت خانه', a: 'جارو تمیزکاری کار خانه', met: 3.3, icon: 'home' },
  { id: 'cooking', n: 'آشپزی', a: 'غذا پختن', met: 2.0, icon: 'home' },
  { id: 'shopping', n: 'خرید پیاده', a: 'بازار خرید', met: 2.3, icon: 'walk' },
  { id: 'gardening', n: 'باغبانی', a: 'باغچه', met: 3.8, icon: 'home' },
  { id: 'kids', n: 'بازی با بچه‌ها', a: 'بچه کودک بازی', met: 3.5, icon: 'ball' },
];

export const ACTIVITY_BY_ID: Map<string, ActivityDef> = new Map(ACTIVITIES.map((a) => [a.id, a]));
