
export const BillingPlan = Object.freeze({
  FREE: 'FREE',
  BASIC: 'BASIC',
  PRO: 'PRO'
});

export const getBillingPlanDisplayName = (plan) => {
  const displayNames = {
    [BillingPlan.FREE]: 'FREE',
    [BillingPlan.BASIC]: 'PAID',
    [BillingPlan.PRO]: 'PRO'
  };

  return displayNames[plan] || 'UNKNOWN';
};

