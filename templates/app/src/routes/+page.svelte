<script lang="ts">
  import { Badge, Button, Card, PageHeader, Table, toast } from '@wright/ui';
  import { Plus, Search } from '@lucide/svelte';

  function showWelcomeToast() {
    toast.success('Welcome to the template', 'This is a Wright UI smoke test.');
  }

  const activity = [
    ['Incidents', '1', '29', '117'],
    ['Chats', '2', '5', '40'],
    ['Jobs', '2', '18', '73'],
  ];
</script>

<PageHeader title="Overview" crumbs={[{ label: 'Template' }, { label: 'Overview' }]}>
  {#snippet actions()}
    <Button tone="ghost"><Search size={14} /> Search</Button>
    <Button tone="primary" onclick={showWelcomeToast}><Plus size={14} /> Toast</Button>
  {/snippet}
</PageHeader>

<div class="wf-content">
  <!-- Status bar -->
  <Card class="status-bar">
    <div class="status-line">
      <span class="status-dot" aria-hidden="true"></span>
      <span style="font-weight: 600; font-size: 15px;">All systems healthy</span>
    </div>
    <div class="mono" style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
      $3.83 spent today · 4 services online · briefing 10h ago
    </div>
    <div class="status-stats">
      <div class="status-stat">
        <div class="mono tnum" style="font-size: 22px; font-weight: 500; color: var(--success);">0/1</div>
        <div class="upper mono" style="color: var(--text-subtle); font-size: 10px;">INCIDENTS</div>
      </div>
      <div class="status-stat">
        <div class="mono tnum" style="font-size: 22px; font-weight: 500;">2</div>
        <div class="upper mono" style="color: var(--text-subtle); font-size: 10px;">CHATS</div>
      </div>
      <div class="status-stat">
        <div class="mono tnum" style="font-size: 22px; font-weight: 500;">2</div>
        <div class="upper mono" style="color: var(--text-subtle); font-size: 10px;">JOBS</div>
      </div>
      <div class="status-stat">
        <div class="mono tnum" style="font-size: 22px; font-weight: 500; color: var(--accent);">15%</div>
        <div class="upper mono" style="color: var(--text-subtle); font-size: 10px;">BUDGET</div>
      </div>
    </div>
  </Card>

  <!-- 3-up cards -->
  <div class="three-up">
    <Card title="Activity" meta="7d">
      <Table style="font-size: 12px;">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th style="text-align: right;">Today</th>
            <th style="text-align: right;">7d</th>
            <th style="text-align: right;">30d</th>
          </tr>
        </thead>
        <tbody>
          {#each activity as row}
            <tr>
              <td>{row[0]}</td>
              <td class="mono tnum" style="text-align: right;">{row[1]}</td>
              <td class="mono tnum" style="text-align: right; color: var(--text-muted);">{row[2]}</td>
              <td class="mono tnum" style="text-align: right; color: var(--text-muted);">{row[3]}</td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Card>

    <Card title="Budget" meta="May">
      <div class="budget-head">
        <div>
          <span class="mono" style="font-size: 24px; font-weight: 500;">$3.83</span>
          <span class="mono" style="color: var(--text-muted); font-size: 13px;"> / $25.00</span>
        </div>
        <Badge tone="accent" dot>15%</Badge>
      </div>
      <div class="wf-progress"><span style="width: 15%;"></span></div>
      <div class="budget-foot">
        <span class="wf-muted mono" style="font-size: 12px;">$21.17 left</span>
        <Button>Boost</Button>
      </div>
    </Card>

    <Card title="Cost" meta="trending">
      <svg viewBox="0 0 300 48" preserveAspectRatio="none" style="width: 100%; height: 48px;">
        <polyline
          fill="none"
          stroke="var(--accent)"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          points="0,38 30,30 60,32 90,22 120,28 150,18 180,24 210,12 240,16 270,10 300,8"
        />
      </svg>
      <div class="cost-stats">
        <div>
          <div class="mono" style="font-size: 16px; font-weight: 500;">$3.83</div>
          <div class="upper mono" style="color: var(--text-subtle);">today</div>
        </div>
        <div>
          <div class="mono" style="font-size: 16px; font-weight: 500; color: var(--text-muted);">$25.55</div>
          <div class="upper mono" style="color: var(--text-subtle);">7d</div>
        </div>
        <div>
          <div class="mono" style="font-size: 16px; font-weight: 500; color: var(--text-muted);">$3.65/d</div>
          <div class="upper mono" style="color: var(--text-subtle);">7d avg</div>
        </div>
      </div>
    </Card>
  </div>

  <!-- Briefing -->
  <Card title="Latest briefing" meta="5/14 · 7:00 AM (10h ago)">
    <div style="border-left: 2px solid var(--accent); padding-left: 14px; margin-left: 2px;">
      <p style="font-size: 14px; margin-bottom: 10px; color: var(--text); font-weight: 500;">
        Mist 67° this morning, high of 98. Summer skipped spring.
      </p>
      <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
        Two new incidents flagged overnight, both resolved by the auto-triage rules. Budget pace is
        on track for the month — no action required. Paperless ingested 144 new documents from the
        scanner; 12 went to manual review.
      </p>
    </div>
  </Card>
</div>

<style>
  /* `.status-bar` is passed via class prop to <Card>, so Svelte's
     scoped CSS doesn't see it as a local selector — :global escapes
     scoping while keeping the styles in this file. */
  :global(.status-bar) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    align-items: center;
    gap: 12px 32px;
    padding: 18px 22px;
  }
  .status-line { display: flex; align-items: center; gap: 8px; }
  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--success) 18%, transparent);
  }
  .status-stats {
    grid-row: 1 / 3;
    grid-column: 2;
    display: flex;
    gap: 32px;
    align-items: center;
  }
  .status-stat { text-align: right; }

  .three-up {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 900px) {
    .three-up { grid-template-columns: 1fr; }
    :global(.status-bar) { grid-template-columns: 1fr; }
    .status-stats { grid-row: 2; grid-column: 1; flex-wrap: wrap; gap: 16px; }
    .status-stat { text-align: left; }
  }

  .budget-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .budget-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
  }
  .cost-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-top: 14px;
  }
</style>
