
export const BillingPlan = Object.freeze({
  FREE: 'FREE',
  PLUS: 'PLUS',
  PRO: 'PRO'
});

export const getBillingPlanDisplayName = (plan) => {
  const displayNames = {
    [BillingPlan.FREE]: 'FREE',
    [BillingPlan.PLUS]: 'PLUS',
    [BillingPlan.PRO]: 'PRO'
  };

  return displayNames[plan] || 'UNKNOWN';
};

