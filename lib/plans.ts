import { PlanKey } from '@prisma/client';

export interface PlanFeatures {
  chatbots: number;
  tokensPerMonth: number;
  scheduling: boolean;
  intakeForms: boolean;
  caseStudyMode: boolean;
  analytics: boolean;
  sso: boolean;
  prioritySupport: boolean;
}

export interface PlanLimits {
  maxChatbots: number;
  maxTokensPerMonth: number;
  maxTeamMembers: number;
  maxApiCallsPerMinute: number;
}

export const PLANS = {
  [PlanKey.FREE]: {
    label: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    features: {
      chatbots: 1,
      tokensPerMonth: 1000,
      scheduling: false,
      intakeForms: false,
      caseStudyMode: false,
      analytics: false,
      sso: false,
      prioritySupport: false,
    } as PlanFeatures,
    limits: {
      maxChatbots: 1,
      maxTokensPerMonth: 1000,
      maxTeamMembers: 1,
      maxApiCallsPerMinute: 10,
    } as PlanLimits,
  },
  [PlanKey.BASIC]: {
    label: 'Basic',
    priceMonthly: 29,
    priceYearly: 290,
    features: {
      chatbots: 1,
      tokensPerMonth: 5000,
      scheduling: true,
      intakeForms: false,
      caseStudyMode: false,
      analytics: false,
      sso: false,
      prioritySupport: false,
    } as PlanFeatures,
    limits: {
      maxChatbots: 1,
      maxTokensPerMonth: 5000,
      maxTeamMembers: 3,
      maxApiCallsPerMinute: 50,
    } as PlanLimits,
  },
  [PlanKey.PRO]: {
    label: 'Pro',
    priceMonthly: 99,
    priceYearly: 990,
    features: {
      chatbots: 3,
      tokensPerMonth: 100000,
      scheduling: true,
      intakeForms: true,
      caseStudyMode: true,
      analytics: true,
      sso: false,
      prioritySupport: false,
    } as PlanFeatures,
    limits: {
      maxChatbots: 3,
      maxTokensPerMonth: 100000,
      maxTeamMembers: 10,
      maxApiCallsPerMinute: 200,
    } as PlanLimits,
  },
  [PlanKey.ENTERPRISE]: {
    label: 'Enterprise',
    priceMonthly: 299,
    priceYearly: 2990,
    features: {
      chatbots: 10,
      tokensPerMonth: 1000000,
      scheduling: true,
      intakeForms: true,
      caseStudyMode: true,
      analytics: true,
      sso: true,
      prioritySupport: true,
    } as PlanFeatures,
    limits: {
      maxChatbots: 10,
      maxTokensPerMonth: 1000000,
      maxTeamMembers: 50,
      maxApiCallsPerMinute: 1000,
    } as PlanLimits,
  },
};

export function getPlanFeatures(planKey: PlanKey): PlanFeatures {
  return PLANS[planKey].features;
}

export function getPlanLimits(planKey: PlanKey): PlanLimits {
  return PLANS[planKey].limits;
}

export function isFeatureEnabled(planKey: PlanKey, feature: keyof PlanFeatures): boolean {
  const value = PLANS[planKey].features[feature];
  return typeof value === 'boolean' ? value : Boolean(value);
}

export function checkUsageLimit(
  planKey: PlanKey,
  currentUsage: number,
  limitType: keyof PlanLimits
): boolean {
  const limit = PLANS[planKey].limits[limitType];
  return currentUsage < limit;
}
