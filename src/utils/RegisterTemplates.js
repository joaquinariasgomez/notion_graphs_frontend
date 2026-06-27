// Quick-entry templates for the RegisterValueBox form.
// Values for `category`, `bankAccount`, and `incomeSource` must match
// the strings returned by the backend endpoints exactly (they are sent verbatim).
// Set `amount: null` to leave the amount field untouched when the template is selected.

export const EXPENSE_TEMPLATES = [
  { id: 'mercadona', label: 'Mercadona', title: 'Mercadona', category: 'Supermarket', amount: null },
  { id: 'continente', label: 'Continente', title: 'Continente', category: 'Supermarket', amount: null },
  { id: 'auchan', label: 'Auchan', title: 'Auchan', category: 'Supermarket', amount: null },
  { id: 'piso', label: 'Piso', title: 'Piso mensual', category: 'Bills & Subscriptions', amount: 800 },
  { id: 'digi', label: 'Digi internet', title: 'Digi internet', category: 'Bills & Subscriptions', amount: 15 },
  { id: 'spotify', label: 'Spotify', title: 'Spotify subscription', category: 'Bills & Subscriptions', amount: 16.99 },
];

export const INCOME_TEMPLATES = [
  { id: 'squarespace', label: 'Squarespace', title: 'Squarespace’s payroll', bankAccount: 'ActivoBank', incomeSource: 'Squrespace', amount: null },
  { id: 'meal', label: 'Meal', title: 'Meal top up', bankAccount: 'Coverflex Meal', incomeSource: 'Squarespace', amount: null },
  { id: 'benefits', label: 'Benefits', title: 'Benefits top up', bankAccount: 'Coverflex Benefits', incomeSource: 'Squarespace', amount: 250 },
];

export const getTemplatesForValueType = (valueType) =>
  valueType === 'expense' ? EXPENSE_TEMPLATES : INCOME_TEMPLATES;
