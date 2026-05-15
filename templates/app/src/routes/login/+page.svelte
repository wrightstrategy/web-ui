<script lang="ts">
  import type { ActionData } from './$types';
  import { Button, Card, FormField, Input, PageHeader } from '@wright/ui';

  // No Superforms here — login is the canonical "tiny form" escape hatch:
  // a plain server action, inline error on failure, redirect on success.
  // No Toast on success either; the redirect itself is the success affordance.
  let { form }: { form: ActionData } = $props();
</script>

<PageHeader title="Sign in" crumbs={[{ label: 'Login' }]} />

<div class="wf-content login-content">
  <Card>
    <form method="post" action="?/signin" novalidate class="login-form">
      <FormField label="Username" for="login-username">
        <Input
          id="login-username"
          name="username"
          autocomplete="username"
          value={form?.username ?? ''}
          required
        />
      </FormField>
      <FormField label="Password" for="login-password">
        <Input
          id="login-password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </FormField>

      {#if form?.error}
        <div class="login-error" role="alert">{form.error}</div>
      {/if}

      <Button type="submit" tone="primary">Sign in</Button>
    </form>

    <p class="login-note">
      <strong>Stub auth.</strong> Any non-empty username + password works. Real
      auth — password hashing, signed sessions, OAuth/SSO — comes from the
      homepage/SSO project. The cookie shape and helpers in
      <code class="mono">$lib/server/auth.ts</code> stay stable so callers
      (load functions using <code class="mono">requireSession()</code>) don't
      need to change.
    </p>
  </Card>
</div>

<style>
  .login-content {
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .login-error {
    padding: 10px 12px;
    background: color-mix(in srgb, var(--danger) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--danger) 30%, transparent);
    border-radius: var(--radius-sm);
    color: var(--danger);
    font-size: 13px;
  }
  .login-note {
    margin-top: 16px;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.5;
  }
  .login-note code {
    background: var(--surface);
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 11px;
  }
</style>
