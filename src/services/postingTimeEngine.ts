export type PostingTimeRecommendation = {
  bestTime: string;
  secondaryTime: string;
  reasoning: string;
  confidence: 'High' | 'Medium' | 'Default Recommendation';
  windowLabel: string;
};

export const getRecommendedPostingTime = (
  category: string,
  targetAudience: string,
  dayOfWeek: string // 'Monday', 'Tuesday', etc.
): PostingTimeRecommendation => {
  const normCategory = (category || '').toLowerCase();
  const normAudience = (targetAudience || '').toLowerCase();
  const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';

  if (normCategory.includes('restaurant') || normCategory.includes('cafe') || normCategory.includes('food')) {
    if (isWeekend) {
      return {
        bestTime: '11:30 AM',
        secondaryTime: '05:30 PM',
        reasoning: 'Weekend dining peaks occur right before lunch (11:30 AM) and early evening dinner planning.',
        confidence: 'High',
        windowLabel: 'Recommendation (Based on hospitality trends)'
      };
    }
    return {
      bestTime: '12:00 PM',
      secondaryTime: '06:15 PM',
      reasoning: 'Weekday lunch breaks (12:00 PM) and post-work dinner cravings (6:15 PM) trigger peak engagement.',
      confidence: 'High',
      windowLabel: 'Recommendation (Based on hospitality trends)'
    };
  }

  if (normCategory.includes('fitness') || normCategory.includes('wellness') || normCategory.includes('gym')) {
    return {
      bestTime: '06:45 AM',
      secondaryTime: '05:30 PM',
      reasoning: 'Fitness audiences check social media early before morning workouts and right after work.',
      confidence: 'High',
      windowLabel: 'Recommendation (Based on fitness activity windows)'
    };
  }

  if (normCategory.includes('saas') || normCategory.includes('b2b') || normCategory.includes('consulting') || normCategory.includes('agency')) {
    if (isWeekend) {
      return {
        bestTime: '10:00 AM',
        secondaryTime: '02:00 PM',
        reasoning: 'B2B audiences have lower weekend engagement; morning hours perform best for light reading.',
        confidence: 'Medium',
        windowLabel: 'Recommendation (Based on professional audience behavior)'
      };
    }
    return {
      bestTime: '09:15 AM',
      secondaryTime: '01:30 PM',
      reasoning: 'Professional B2B engagement peaks at work day start (9:15 AM) and early afternoon break (1:30 PM).',
      confidence: 'High',
      windowLabel: 'Recommendation (Based on professional audience behavior)'
    };
  }

  if (normCategory.includes('beauty') || normCategory.includes('salon') || normCategory.includes('fashion') || normCategory.includes('ecommerce')) {
    return {
      bestTime: '01:00 PM',
      secondaryTime: '07:30 PM',
      reasoning: 'Lifestyle & retail shoppers engage most during afternoon browsing and evening relaxation.',
      confidence: 'High',
      windowLabel: 'Recommendation (Based on retail engagement patterns)'
    };
  }

  // Default fallback windows
  if (normAudience.includes('student') || normAudience.includes('gen z') || normAudience.includes('young')) {
    return {
      bestTime: '03:30 PM',
      secondaryTime: '08:45 PM',
      reasoning: 'Younger audiences peak post-school and late evening.',
      confidence: 'Medium',
      windowLabel: 'Recommendation (Based on demographic habits)'
    };
  }

  return {
    bestTime: isWeekend ? '10:30 AM' : '09:30 AM',
    secondaryTime: isWeekend ? '04:00 PM' : '06:00 PM',
    reasoning: 'Standard audience activity window based on platform average activity benchmarks.',
    confidence: 'Default Recommendation',
    windowLabel: 'Recommendation (Default industry benchmark)'
  };
};
