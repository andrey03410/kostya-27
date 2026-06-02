/**
 * Вопросы аниме-квиза по Clannad и A Certain Scientific Railgun.
 * correct — индекс правильного варианта в options.
 * Тексты можно свободно править/дополнять.
 */
export const QUIZ_QUESTIONS = [
  {
    id: 'rg-power',
    universe: 'railgun',
    question: 'Какая способность дала Мисаке Микото прозвище «Рельсотрон»?',
    options: ['Телепортация', 'Управление электричеством', 'Пирокинез', 'Левитация'],
    correct: 1,
  },
  {
    id: 'rg-coin',
    universe: 'railgun',
    question: 'Что Мисака подбрасывает и использует как снаряд для своей коронной атаки?',
    options: ['Игральную карту', 'Монетку', 'Камень', 'Заколку'],
    correct: 1,
  },
  {
    id: 'rg-level',
    universe: 'railgun',
    question: 'Какой у Мисаки уровень эспера в Academy City?',
    options: ['Уровень 1', 'Уровень 3', 'Уровень 5', 'Уровень 0'],
    correct: 2,
  },
  {
    id: 'rg-city',
    universe: 'railgun',
    question: 'Как называется город, где учатся эсперы?',
    options: ['Academy City', 'Neo Tokyo', 'Esper Town', 'Sky City'],
    correct: 0,
  },
  {
    id: 'cl-dango',
    universe: 'clannad',
    question: 'Как называется милая семейка круглых существ из Clannad?',
    options: ['Моти-моти', 'Данго Дайкадзоку', 'Пуни-пуни', 'Тама-тама'],
    correct: 1,
  },
  {
    id: 'cl-nagisa',
    universe: 'clannad',
    question: 'Как зовут главную героиню Clannad, мечтающую о театральном кружке?',
    options: ['Нагиса', 'Котоми', 'Кё', 'Томоё'],
    correct: 0,
  },
  {
    id: 'cl-fuko',
    universe: 'clannad',
    question: 'Какие фигурки вырезает Фуко в подарок?',
    options: ['Сердечки', 'Морские звёзды', 'Цветы', 'Звёздочки'],
    correct: 1,
  },
  {
    id: 'cl-theme',
    universe: 'clannad',
    question: 'Какая тема — центральная для Clannad?',
    options: ['Космические битвы', 'Семья и течение времени', 'Спорт', 'Детектив'],
    correct: 1,
  },
]
