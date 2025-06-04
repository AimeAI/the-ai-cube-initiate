export const getSlotCountFromPlan = (planId: string): number => {
  switch (planId) {
    case 'plan_beta_solo': return 1;
    case 'plan_beta_family': return 3;
    default: return 0;
  }
}