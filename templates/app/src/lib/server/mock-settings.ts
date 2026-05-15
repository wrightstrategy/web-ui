// Server-only mock settings store. Persists in-process for the
// lifetime of the dev server. Three independent sections, each with
// its own shape and validation schema.

export type ProfileSettings = {
  name: string;
  email: string;
};

export type NotificationsSettings = {
  onError: boolean;
  onReviewNeeded: boolean;
  onDailyDigest: boolean;
  channel: 'Email' | 'Slack' | 'Webhook';
};

export type AdvancedSettings = {
  apiKey: string;
  retentionDays: number;
  autoTriageFloor: number;
};

const state: {
  profile: ProfileSettings;
  notifications: NotificationsSettings;
  advanced: AdvancedSettings;
} = {
  profile: {
    name: 'Scott Wright',
    email: 'scott@wrightfamily.org',
  },
  notifications: {
    onError: true,
    onReviewNeeded: true,
    onDailyDigest: false,
    channel: 'Email',
  },
  advanced: {
    apiKey: 'wf-DEMO-token-not-secret',
    retentionDays: 90,
    autoTriageFloor: 90,
  },
};

export function getProfile(): ProfileSettings {
  return { ...state.profile };
}
export function setProfile(p: ProfileSettings): void {
  state.profile = p;
}

export function getNotifications(): NotificationsSettings {
  return { ...state.notifications };
}
export function setNotifications(n: NotificationsSettings): void {
  state.notifications = n;
}

export function getAdvanced(): AdvancedSettings {
  return { ...state.advanced };
}
export function setAdvanced(a: AdvancedSettings): void {
  state.advanced = a;
}
