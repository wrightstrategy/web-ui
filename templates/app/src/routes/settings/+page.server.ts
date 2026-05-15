import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { advancedSchema, notificationsSchema, profileSchema } from '$lib/schemas';
import {
  getAdvanced,
  getNotifications,
  getProfile,
  setAdvanced,
  setNotifications,
  setProfile,
} from '$lib/server/mock-settings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const [profileForm, notificationsForm, advancedForm] = await Promise.all([
    superValidate(getProfile(), zod4(profileSchema), { id: 'profile' }),
    superValidate(getNotifications(), zod4(notificationsSchema), { id: 'notifications' }),
    superValidate(getAdvanced(), zod4(advancedSchema), { id: 'advanced' }),
  ]);

  return {
    profileForm,
    notificationsForm,
    advancedForm,
    saved: url.searchParams.get('saved'),
  };
};

// For multiple forms on a page, Superforms matches an action's return
// payload to the client's superForm() via the property name. The action
// returns { profileForm } and the client initialized with
// superForm(data.profileForm) picks it up.
export const actions: Actions = {
  profile: async ({ request }) => {
    const profileForm = await superValidate(request, zod4(profileSchema), { id: 'profile' });
    if (!profileForm.valid) return fail(400, { profileForm });
    setProfile(profileForm.data);
    redirect(303, '/settings?saved=profile');
  },

  notifications: async ({ request }) => {
    const notificationsForm = await superValidate(request, zod4(notificationsSchema), { id: 'notifications' });
    if (!notificationsForm.valid) return fail(400, { notificationsForm });
    setNotifications(notificationsForm.data);
    redirect(303, '/settings?saved=notifications');
  },

  advanced: async ({ request }) => {
    const advancedForm = await superValidate(request, zod4(advancedSchema), { id: 'advanced' });
    if (!advancedForm.valid) return fail(400, { advancedForm });
    setAdvanced(advancedForm.data);
    redirect(303, '/settings?saved=advanced');
  },
};
