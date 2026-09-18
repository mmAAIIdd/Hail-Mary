import {
  DiagnosticConstraint,
  DiagnosticGap,
  DiagnosticProfileResult,
  DiagnosticStrength,
  UserProfile,
} from '../types/profile';

const performanceLabels = {
  excellent: 'отличная',
  good: 'хорошая',
  average: 'средняя',
  needs_support: 'требует улучшения',
} as const;

export function runProfileDiagnosis(profile: UserProfile): DiagnosticProfileResult {
  const strengths: DiagnosticStrength[] = [];
  const gaps: DiagnosticGap[] = [];
  const constraints: DiagnosticConstraint[] = [];
  const performance = profile.academics.performance_level;
  const mainSubject = profile.academics.main_subject;
  const preferences = profile.application_preferences;

  if (performance === 'excellent' || performance === 'good') {
    strengths.push({
      id: 'str-academics',
      title: performance === 'excellent' ? 'Сильная успеваемость' : 'Стабильная успеваемость',
      grounding: `Вы оценили свою успеваемость как «${performanceLabels[performance]}». Главный предмет — ${mainSubject}.`,
      admission_impact: 'Это хорошая основа для выбора программ с подходящими академическими требованиями.',
      why_it_matters: 'Университеты сравнивают оценки кандидата с требованиями конкретной программы и школьной системой.',
    });
  }

  if (profile.academics.interests.length >= 2) {
    strengths.push({
      id: 'str-interests',
      title: 'Понятный круг интересов',
      grounding: `Вы указали направления: ${profile.academics.interests.slice(0, 4).join(', ')}.`,
      admission_impact: 'Эти интересы помогут составить первый список специальностей и университетов.',
      why_it_matters: 'Чёткий учебный фокус упрощает выбор программы и подготовку мотивационного письма.',
    });
  }

  if (['8', '9', '10'].includes(profile.basic_info.grade)) {
    strengths.push({
      id: 'str-time',
      title: 'Есть время на подготовку',
      grounding: `Сейчас вы учитесь в ${profile.basic_info.grade}-м классе.`,
      admission_impact: 'Можно заранее проверить требования, подготовить язык и собрать необходимые документы.',
      why_it_matters: 'Ранний старт оставляет время скорректировать план без спешки перед дедлайнами.',
    });
  }

  if (performance === 'average' || performance === 'needs_support') {
    gaps.push({
      id: 'gap-academics',
      title: `Усилить предмет «${mainSubject}»`,
      status: 'needs_improvement',
      context: `Текущая самооценка успеваемости: «${performanceLabels[performance]}».`,
      why_it_matters: 'Для части программ профильные школьные предметы имеют отдельные минимальные требования.',
      recommended_action: 'Проверить текущие оценки по предмету и составить короткий план улучшения на ближайшую четверть.',
    });
  }

  if (preferences.timeline === 'six_months') {
    gaps.push({
      id: 'gap-deadline',
      title: 'Сжатые сроки подготовки',
      status: 'potential_gap',
      context: 'Вы планируете подавать документы в ближайшие шесть месяцев.',
      why_it_matters: 'За это время нужно успеть проверить требования, дедлайны, документы и варианты финансирования.',
      recommended_action: 'На этой неделе выбрать 5–7 программ и выписать их требования и сроки в один список.',
    });
  } else if (preferences.timeline === 'exploring') {
    gaps.push({
      id: 'gap-timeline',
      title: 'Определить ориентировочный срок',
      status: 'unknown',
      context: 'Срок подачи пока не выбран.',
      why_it_matters: 'От него зависит порядок подготовки языка, документов и финансирования.',
      recommended_action: 'Выбрать примерный год поступления и пересмотреть его после составления списка стран.',
    });
  }

  constraints.push({
    id: 'con-budget',
    title: `Бюджет до $${profile.budget.max_total_usd_year.toLocaleString()} в год`,
    category: 'budget',
    description: 'При подборе нужно считать обучение и проживание вместе и отдельно проверять дополнительные сборы.',
    is_hard: true,
  });

  if (profile.budget.scholarship_criticality !== 'not_needed') {
    const required = profile.budget.scholarship_criticality === 'critical';
    constraints.push({
      id: 'con-scholarship',
      title: required ? 'Стипендия обязательна' : 'Стипендия важна',
      category: 'scholarship',
      description: 'Сроки и условия стипендий нужно проверять отдельно от основной заявки.',
      is_hard: required,
    });
  }

  if (preferences.financial_aid !== 'no') {
    constraints.push({
      id: 'con-financial-aid',
      title: 'Нужна финансовая помощь',
      category: 'scholarship',
      description: 'В список стоит включать программы с понятными условиями financial aid для иностранных студентов.',
      is_hard: preferences.financial_aid === 'yes',
    });
  }

  if (preferences.work_during_studies !== 'no') {
    constraints.push({
      id: 'con-work',
      title: 'Важна возможность работать во время учёбы',
      category: 'visa',
      description: 'Правила подработки зависят от страны и типа студенческой визы, поэтому их нужно проверять до подачи.',
      is_hard: preferences.work_during_studies === 'yes',
    });
  }

  constraints.push({
    id: 'con-countries',
    title: `Страны: ${profile.preferences.countries.join(', ')}`,
    category: 'country',
    description: 'Первый список программ будет ограничен выбранными странами.',
    is_hard: true,
  });

  const mainInterest = profile.academics.interests[0] || mainSubject;
  return {
    summary: {
      grade_label: `${profile.basic_info.grade}-й класс`,
      main_interest: mainInterest,
      preferred_countries: profile.preferences.countries,
      annual_budget_usd: profile.budget.max_total_usd_year,
    },
    strengths,
    gaps,
    constraints,
    goal: {
      main_interest: mainInterest,
      target_intake: profile.basic_info.target_intake_year,
      preferred_countries: profile.preferences.countries,
      max_budget_usd: profile.budget.max_total_usd_year,
    },
  };
}
