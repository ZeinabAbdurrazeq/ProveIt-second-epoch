// Subscription plan definitions. aiInterviewsPerMonth = -1 means unlimited.
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    aiInterviewsPerMonth: 3,
    features: [
      "3 AI interviews per month",
      "Access to live sessions",
      "Basic progress tracking",
      "Community problems",
    ],
    recommended: false,
  },
  pro: {
    name: "Pro",
    price: 9.99,
    aiInterviewsPerMonth: -1,
    features: [
      "Unlimited AI interviews",
      "Full progress tracking and candidate profile",
      "Detailed scorecards",
      "Priority problem matching",
      "Invite and scheduling system",
      "Everything in Free",
    ],
    recommended: true,
  },
  premium: {
    name: "Premium",
    price: 19.99,
    aiInterviewsPerMonth: -1,
    features: [
      "Everything in Pro",
      "Unlimited CV re-uploads",
      "Advanced analytics",
      "Early access to new features",
      "Priority support",
    ],
    recommended: false,
  },
};
