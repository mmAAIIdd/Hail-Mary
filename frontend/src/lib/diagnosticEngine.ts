import {
  UserProfile,
  DiagnosticProfileResult,
  DiagnosticStrength,
  DiagnosticGap,
  DiagnosticConstraint
} from '../types/profile';

export function runProfileDiagnosis(profile: UserProfile): DiagnosticProfileResult {
  const strengths: DiagnosticStrength[] = [];
  const gaps: DiagnosticGap[] = [];
  const constraints: DiagnosticConstraint[] = [];

  // --- 1. EVALUATE STRENGTHS (Evidence-based only) ---

  // Academic standing
  const gpa = profile.academics.gpa;
  const scale = profile.academics.grading_scale;
  const performance = profile.academics.performance_level;
  const performanceLabels = {
    excellent: 'отличная',
    good: 'хорошая',
    average: 'средняя',
    needs_support: 'требует улучшения',
  } as const;
  const isHighGpa = performance
    ? performance === 'excellent'
    : (scale === '5.0' && gpa >= 4.5) ||
      (scale === '4.0' && gpa >= 3.6) ||
      (scale === '100' && gpa >= 88);

  if (isHighGpa) {
    strengths.push({
      id: 'str-gpa',
      title: 'Высокая академическая успеваемость',
      grounding: performance
        ? `Самооценка успеваемости: ${performanceLabels[performance]}. Главный предмет: ${profile.academics.strong_subjects[0] || 'не указан'}.`
        : `Текущий балл: ${gpa} по шкале ${scale}. Сильные предметы: ${profile.academics.strong_subjects.slice(0, 3).join(', ') || 'не указаны'}.`,
      admission_impact: 'Открывает доступ к селективным университетам Европы, США и Азии с высокими входными порогами.',
      why_it_matters: 'Приемные комиссии в первую очередь отсекают кандидатов по академической надежности. Высокий средний балл доказывает способность справляться с университетской нагрузкой.'
    });
  }

  // English Proficiency
  const ielts = profile.exams.ielts;
  const toefl = profile.exams.toefl;
  if (ielts.status === 'taken' && ielts.score && parseFloat(ielts.score.toString()) >= 6.5) {
    strengths.push({
      id: 'str-english',
      title: 'Подтвержденный высокий уровень английского языка',
      grounding: `Сдан официальный экзамен IELTS с результатом ${ielts.score} (уровень ${profile.exams.english_level}).`,
      admission_impact: 'Полностью покрывает стандартный входной барьер большинства международных англоязычных бакалавриатов (обычно 6.0–6.5).',
      why_it_matters: 'Освобождает время перед дедлайнами: языковой порог уже закрыт, можно полностью сфокусироваться на портфолио и академических документах.'
    });
  } else if (toefl.status === 'taken' && toefl.score && parseFloat(toefl.score.toString()) >= 90) {
    strengths.push({
      id: 'str-toefl',
      title: 'Подтвержденный языковой сертификат TOEFL',
      grounding: `Сдан TOEFL iBT с баллом ${toefl.score}.`,
      admission_impact: 'Превышает минимальные требования большинства вузов Северной Америки и Европы.',
      why_it_matters: 'Соответствует стандартам прямого зачисления без подготовительных языковых курсов (foundation).'
    });
  }

  // Extracurricular Profile
  const activities = profile.extracurriculars;
  const majorKey = profile.academics.intended_major.toLowerCase();
  const majorRelatedActs = activities.filter(a => 
    (majorKey.includes('comput') || majorKey.includes('it') || majorKey.includes('data'))
      ? (a.category === 'programming' || a.category === 'robotics' || a.category === 'olympiad' || a.category === 'startup')
      : true
  );

  if (activities.length >= 2) {
    const highTier = activities.some(a => a.level === 'national' || a.level === 'international');
    const groundingList = majorRelatedActs.length > 0 ? majorRelatedActs : activities;
    strengths.push({
      id: 'str-activities',
      title: highTier ? 'Релевантный внеучебный профиль национального/международного уровня' : 'Активная внеучебная деятельность (Holistic Profile)',
      grounding: `${activities.length} подтвержденные активности (${groundingList.map(a => a.name).slice(0, 2).join('; ')}).`,
      admission_impact: 'Критично для американских и ведущих азиатских вузов с холистической системой отбора (Holistic Review).',
      why_it_matters: 'Университеты ищут студентов, которые не просто получают оценки, но и применяют знания на практике, проявляя лидерство и инициативу.'
    });
  }

  // Major-specific achievements / Olympiads
  const achievements = profile.achievements;
  if (achievements.length > 0) {
    strengths.push({
      id: 'str-achievements',
      title: 'Наличие документально подтвержденных достижений и наград',
      grounding: `${achievements.length} достижение: ${achievements.map(a => a.title).slice(0, 2).join('; ')}.`,
      admission_impact: 'Существенно усиливает заявку при отборе на конкурсные merit-based гранты и scholarships.',
      why_it_matters: 'Победы в олимпиадах и хакатонах выделяют кандидата среди сотен других с аналогичным средним баллом.'
    });
  }

  // Early preparation (Grade 8, 9 or 10)
  if (['8', '9', '10'].includes(profile.basic_info.grade)) {
    strengths.push({
      id: 'str-timeline',
      title: 'Заблаговременный старт подготовки (стратегическое преимущество)',
      grounding: `Текущий класс: ${profile.basic_info.grade}-й, целевой год зачисления: ${profile.basic_info.target_intake_year}.`,
      admission_impact: 'Запас времени от 1.5 до 2.5 лет для закрытия академических тестов и прокачки лидерских проектов.',
      why_it_matters: 'Позволяет сдать тесты без стресса в несколько попыток и собрать сильные рекомендательные письма.'
    });
  }

  // --- 2. EVALUATE GAPS (Contextual & constructive, not punitive) ---

  // SAT requirement (depends on target countries and status)
  const isUsTarget = profile.preferences.preferred_countries.some(c => 
    c.toLowerCase().includes('сша') || c.toLowerCase().includes('usa') || c.toLowerCase().includes('united states')
  );
  const sat = profile.exams.sat;

  if (isUsTarget) {
    if (sat.status === 'not_taken') {
      gaps.push({
        id: 'gap-sat-not-taken',
        title: 'Тест SAT еще не сдавался (целевая страна включает США)',
        status: 'potential_gap',
        context: 'Многие американские топовые вузы вернули обязательный SAT (Test-Required), а при подаче на merit-стипендии высокий балл является решающим фактором.',
        why_it_matters: 'Хотя часть университетов сохраняет политику Test-Optional, отсутствие стандартизированного балла переносит весь фокус на оценки и эссе.',
        recommended_action: 'Пройти бесплатный диагностический тест SAT (Bluebook) и запланировать официальную сдачу за 6-9 месяцев до дедлайна.'
      });
    } else if (sat.status === 'planned') {
      gaps.push({
        id: 'gap-sat-planned',
        title: 'SAT запланирован к сдаче (требуется фиксация целевого балла)',
        status: 'unknown',
        context: `Сдача SAT запланирована на ${sat.planned_date || 'ближайшие сессии'}. Точный балл пока не определен.`,
        why_it_matters: 'Итоговый список университетов (Reach, Target, Safety) будет зависеть от попадания в 50-й/75-й процентиль выбранного вуза.',
        recommended_action: 'Ориентироваться на минимальный таргет 1400+ для selective вузов и 1500+ для top-tier программ по CS/Engineering.'
      });
    }
  }

  // English test status
  if (ielts.status === 'not_taken' && toefl.status === 'not_taken') {
    gaps.push({
      id: 'gap-english-proof',
      title: 'Отсутствует официальный языковой сертификат (IELTS / TOEFL)',
      status: 'missing_requirement',
      context: `Заявлен уровень ${profile.exams.english_level}, однако официальный сертификат еще не получен.`,
      why_it_matters: 'Без подтвержденного сертификата международный отдел университета не сможет выдать безусловный оффер (Unconditional Offer).',
      recommended_action: 'Зарегистрироваться на тест IELTS Academic или TOEFL iBT минимум за 3-4 месяца до первых дедлайнов подачи.'
    });
  } else if (ielts.status === 'planned') {
    gaps.push({
      id: 'gap-ielts-planned',
      title: 'Экзамен IELTS находится в статусе подготовки',
      status: 'unknown',
      context: `Планируемая дата сдачи: ${ielts.planned_date || 'в ближайший год'}.`,
      why_it_matters: 'Требуется подтвердить уровень не ниже 6.5 Overall (минимум 6.0 по каждой секции) для отсутствия языковых ограничений.',
      recommended_action: 'Сдать пробный диагностический mock-test для определения слабых секций (чаще всего Writing или Speaking).'
    });
  }

  // Extracurricular depth if sparse
  if (profile.extracurriculars.length === 0) {
    gaps.push({
      id: 'gap-activities-empty',
      title: 'Не указаны внеучебные активности и проекты',
      status: 'needs_improvement',
      context: 'Приемные комиссии англоязычных программ оценивают вклад студента в сообщество и инициативность.',
      why_it_matters: 'Для поступления только оценок (GPA) недостаточно, особенно при претензии на гранты.',
      recommended_action: 'Добавить школьные клубы, волонтерство, собственные мини-проекты или онлайн-курсы с подтвержденными сертификатами.'
    });
  }

  // --- 3. EVALUATE EXTERNAL CONSTRAINTS (Separated from personal weaknesses) ---

  // Budget
  const totalBudget = profile.budget.max_total_usd_year;
  const tuitionBudget = profile.budget.max_tuition_usd_year;

  constraints.push({
    id: 'con-budget',
    title: `Бюджетный лимит: до $${totalBudget.toLocaleString()}/год (обучение до $${tuitionBudget.toLocaleString()}/год)`,
    category: 'budget',
    description: totalBudget < 30000 
      ? 'Ограничивает прямое платное зачисление в США/Великобританию без существенного финансового покрытия. Вектор поиска: государственные вузы Европы (Германия, Италия, Нидерланды) или вузы США со 100% need-based/merit aid.'
      : 'Комфортный бюджет для европейских и азиатских программ, но требует контроля дополнительных расходов на проживание и страховку.',
    is_hard: true
  });

  // Scholarship
  if (profile.budget.scholarship_criticality === 'critical' || profile.budget.scholarship_criticality === 'important') {
    constraints.push({
      id: 'con-scholarship',
      title: profile.budget.scholarship_criticality === 'critical'
        ? 'Критическая необходимость стипендии / гранта (Scholarship Required)'
        : 'Высокая важность получения финансовой помощи (Scholarship Dependent)',
      category: 'scholarship',
      description: 'Подача заявок должна синхронизироваться со стипендиальными дедлайнами (которые часто на 1-2 месяца раньше основных).',
      is_hard: profile.budget.scholarship_criticality === 'critical'
    });
  }

  // Housing / Dormitory
  if (profile.budget.dormitory_needed) {
    constraints.push({
      id: 'con-dorm',
      title: 'Обязательное наличие университетского общежития (Dormitory Required)',
      category: 'housing',
      description: 'Исключает программы, где первокурсники обязаны арендовать жилье в частном секторе (что повышает риски и стоимость жизни).',
      is_hard: false
    });
  }

  // Country exclusions or preferences
  if (profile.preferences.preferred_countries.length > 0) {
    constraints.push({
      id: 'con-countries',
      title: `Географический фокус: ${profile.preferences.preferred_countries.join(', ')}`,
      category: 'country',
      description: 'Алгоритм подбора фильтрует каталог исключительно по целевым юрисдикциям с учетом специфики визовых процедур.',
      is_hard: true
    });
  }

  // --- 4. ASSEMBLE RESULT ---
  return {
    summary: {
      grade_label: `${profile.basic_info.grade}-й класс`,
      target_major: profile.academics.intended_major,
      preferred_countries: profile.preferences.preferred_countries,
      annual_budget_usd: profile.budget.max_total_usd_year,
      english_summary: ielts.status === 'taken' 
        ? `IELTS ${ielts.score} (${profile.exams.english_level})`
        : toefl.status === 'taken'
        ? `TOEFL ${toefl.score}`
        : `${profile.exams.english_level} (сертификат ${ielts.status === 'planned' ? 'планируется' : 'не сдавался'})`,
      sat_summary: sat.status === 'taken' ? `SAT ${sat.score}` : sat.status === 'planned' ? 'SAT планируется' : 'SAT не сдавался',
      extracurricular_count: profile.extracurriculars.length,
      achievement_count: profile.achievements.length,
    },
    strengths,
    gaps,
    constraints,
    goal: {
      degree: profile.basic_info.degree_type,
      major: profile.academics.intended_major,
      alternative_majors: profile.academics.alternative_majors,
      target_intake: profile.basic_info.target_intake_year,
      preferred_countries: profile.preferences.preferred_countries,
      max_budget_usd: profile.budget.max_total_usd_year,
    }
  };
}
