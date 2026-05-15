<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms';
  import { Badge, Button, Card, Checkbox, FormField, Input, PageHeader, Select, toast } from '@wright/ui';

  let { data }: { data: PageData } = $props();

  // Three independent forms, each with its own action and its own
  // superForm instance. The `id` option lets Superforms distinguish
  // which form a failed-validation response belongs to.
  const {
    form: profileForm,
    errors: profileErrors,
    enhance: enhanceProfile,
    submitting: profileSubmitting,
  } = superForm(data.profileForm, {
    id: 'profile',
    invalidateAll: false,
    onResult: ({ result }) => {
      if (result.type === 'redirect') toast.success('Profile saved');
    },
  });

  const {
    form: notificationsForm,
    enhance: enhanceNotifications,
    submitting: notificationsSubmitting,
  } = superForm(data.notificationsForm, {
    id: 'notifications',
    invalidateAll: false,
    onResult: ({ result }) => {
      if (result.type === 'redirect') toast.success('Notifications saved');
    },
  });

  const {
    form: advancedForm,
    errors: advancedErrors,
    enhance: enhanceAdvanced,
    submitting: advancedSubmitting,
  } = superForm(data.advancedForm, {
    id: 'advanced',
    invalidateAll: false,
    onResult: ({ result }) => {
      if (result.type === 'redirect') toast.success('Advanced settings saved');
    },
  });

  function savedBadge(section: 'profile' | 'notifications' | 'advanced') {
    return data.saved === section;
  }
</script>

<PageHeader title="Settings" crumbs={[{ label: 'Settings' }]} />

<div class="wf-content">
  <!-- Profile ─────────────────────────────────────────────────────── -->
  <Card>
    {#snippet head()}
      <h3>Profile</h3>
      {#if savedBadge('profile')}
        <Badge tone="ok" dot>SAVED</Badge>
      {:else}
        <span class="wf-meta mono">who you are</span>
      {/if}
    {/snippet}

    <form method="post" action="?/profile" use:enhanceProfile novalidate class="settings-form">
      <div class="grid-2">
        <FormField label="Name" for="profile-name" error={$profileErrors.name?.[0]}>
          <Input
            id="profile-name"
            name="name"
            bind:value={$profileForm.name}
            error={!!$profileErrors.name}
          />
        </FormField>

        <FormField label="Email" for="profile-email" hint="Used for notifications and password resets." error={$profileErrors.email?.[0]}>
          <Input
            id="profile-email"
            name="email"
            type="email"
            bind:value={$profileForm.email}
            error={!!$profileErrors.email}
          />
        </FormField>
      </div>

      <div class="form-actions">
        <Button type="submit" tone="primary" loading={$profileSubmitting}>Save profile</Button>
      </div>
    </form>
  </Card>

  <!-- Notifications ──────────────────────────────────────────────── -->
  <Card>
    {#snippet head()}
      <h3>Notifications</h3>
      {#if savedBadge('notifications')}
        <Badge tone="ok" dot>SAVED</Badge>
      {:else}
        <span class="wf-meta mono">when to ping you</span>
      {/if}
    {/snippet}

    <form method="post" action="?/notifications" use:enhanceNotifications novalidate class="settings-form">
      <div class="checkbox-stack">
        <Checkbox name="onError" bind:checked={$notificationsForm.onError} label="When auto-triage fails" />
        <Checkbox name="onReviewNeeded" bind:checked={$notificationsForm.onReviewNeeded} label="When a document needs manual review" />
        <Checkbox name="onDailyDigest" bind:checked={$notificationsForm.onDailyDigest} label="Daily digest at 7:00 AM" />
      </div>

      <FormField label="Channel" for="notif-channel" hint="Where notifications get delivered.">
        <Select id="notif-channel" name="channel" bind:value={$notificationsForm.channel}>
          <option value="Email">Email</option>
          <option value="Slack">Slack</option>
          <option value="Webhook">Webhook</option>
        </Select>
      </FormField>

      <div class="form-actions">
        <Button type="submit" tone="primary" loading={$notificationsSubmitting}>Save notifications</Button>
      </div>
    </form>
  </Card>

  <!-- Advanced ──────────────────────────────────────────────────── -->
  <Card>
    {#snippet head()}
      <h3>Advanced</h3>
      {#if savedBadge('advanced')}
        <Badge tone="ok" dot>SAVED</Badge>
      {:else}
        <span class="wf-meta mono">careful here</span>
      {/if}
    {/snippet}

    <form method="post" action="?/advanced" use:enhanceAdvanced novalidate class="settings-form">
      <FormField label="API key" for="adv-apikey" hint="Used by external integrations." error={$advancedErrors.apiKey?.[0]}>
        <Input
          id="adv-apikey"
          name="apiKey"
          bind:value={$advancedForm.apiKey}
          error={!!$advancedErrors.apiKey}
          mono
        />
      </FormField>

      <div class="grid-2">
        <FormField label="Retention" for="adv-retention" hint="Days to keep audit logs." error={$advancedErrors.retentionDays?.[0]}>
          <Input
            id="adv-retention"
            name="retentionDays"
            type="number"
            min="7"
            max="365"
            bind:value={$advancedForm.retentionDays}
            error={!!$advancedErrors.retentionDays}
            mono
          />
        </FormField>

        <FormField label="Auto-triage floor (%)" for="adv-floor" hint="Below this confidence, send to manual review." error={$advancedErrors.autoTriageFloor?.[0]}>
          <Input
            id="adv-floor"
            name="autoTriageFloor"
            type="number"
            min="50"
            max="100"
            bind:value={$advancedForm.autoTriageFloor}
            error={!!$advancedErrors.autoTriageFloor}
            mono
          />
        </FormField>
      </div>

      <div class="form-actions">
        <Button type="submit" tone="primary" loading={$advancedSubmitting}>Save advanced</Button>
      </div>
    </form>
  </Card>
</div>

<style>
  .settings-form { display: flex; flex-direction: column; gap: 18px; }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .checkbox-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
  @media (max-width: 767px) {
    .grid-2 { grid-template-columns: 1fr; }
  }
</style>
