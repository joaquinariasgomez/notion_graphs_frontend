
export const BillingPlan = Object.freeze({
  FREE: 'FREE',
  PLUS: 'PLUS',
  PRO: 'PRO'
});

export const getBillingPlanDisplayName = (plan) => {
  const displayNames = {
    [BillingPlan.FREE]: 'Notion Wallet Free',
    [BillingPlan.PLUS]: 'Notion Wallet Plus',
    [BillingPlan.PRO]: 'Notion Wallet Pro'
  };

  return displayNames[plan] || 'UNKNOWN';
};

