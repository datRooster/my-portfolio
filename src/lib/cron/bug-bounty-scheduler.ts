/**
 * Bug Bounty Auto-Sync Scheduler
 * 
 * Questo servizio gestisce la sincronizzazione automatica periodica
 * dei dati delle piattaforme bug bounty.
 * 
 * Deployment options:
 * 1. Vercel Cron Jobs (vercel.json)
 * 2. GitHub Actions (workflow schedulato)
 * 3. External cron service (cron-job.org)
 * 4. Server-side cron job
 */

interface SyncJob {
  id: string;
  name: string;
  schedule: string; // cron format
  endpoint: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  status: 'idle' | 'running' | 'error';
}

export class BugBountySyncScheduler {
  private jobs: SyncJob[] = [
    {
      id: 'platform-sync-daily',
      name: 'Daily Platform Sync',
      schedule: '0 8 * * *', // Every day at 8 AM
      endpoint: '/api/bug-bounty/sync-platforms',
      enabled: true,
      status: 'idle'
    },
    {
      id: 'stats-update-hourly',
      name: 'Hourly Stats Update',
      schedule: '0 * * * *', // Every hour
      endpoint: '/api/bug-bounty/stats',
      enabled: true,
      status: 'idle'
    }
  ];

  /**
   * Execute a sync job
   */
  async executeJob(jobId: string): Promise<void> {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job || !job.enabled) {
      console.log(`Job ${jobId} not found or disabled`);
      return;
    }

    console.log(`[CRON] Starting job: ${job.name}`);
    job.status = 'running';
    job.lastRun = new Date().toISOString();

    try {
      // Execute the job
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${job.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET_KEY}` // For security
        }
      });

      if (response.ok) {
        console.log(`[CRON] ✅ Job ${job.name} completed successfully`);
        job.status = 'idle';
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error(`[CRON] ❌ Job ${job.name} failed:`, error);
      job.status = 'error';
      
      // TODO: Send notification/alert about job failure
      await this.notifyJobFailure(job, error);
    }

    // Calculate next run time based on cron schedule
    job.nextRun = this.getNextRunTime(job.schedule);
  }

  /**
   * Get all scheduled jobs
   */
  getJobs(): SyncJob[] {
    return this.jobs;
  }

  /**
   * Enable/disable a job
   */
  toggleJob(jobId: string, enabled: boolean): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.enabled = enabled;
      console.log(`[CRON] Job ${job.name} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Calculate next run time for a cron schedule
   * This is a simplified version - in production use a proper cron parser
   */
  private getNextRunTime(cronSchedule: string): string {
    // For demo purposes, calculate next run as +1 hour for hourly, +1 day for daily
    const now = new Date();
    
    if (cronSchedule === '0 * * * *') {
      // Hourly job
      now.setHours(now.getHours() + 1, 0, 0, 0);
    } else if (cronSchedule === '0 8 * * *') {
      // Daily job at 8 AM
      now.setDate(now.getDate() + 1);
      now.setHours(8, 0, 0, 0);
    }
    
    return now.toISOString();
  }

  /**
   * Send notification about job failure
   */
  private async notifyJobFailure(job: SyncJob, error: any): Promise<void> {
    console.error(`[NOTIFICATION] Job failure: ${job.name}`, error);
    
    // TODO: Implement notification system
    // Options:
    // 1. Email notification
    // 2. Slack/Discord webhook
    // 3. Database log entry
    // 4. Admin dashboard alert
  }
}

/**
 * Vercel Cron Configuration
 * Add this to vercel.json:
 */
export const vercelCronConfig = {
  "crons": [
    {
      "path": "/api/cron/sync-platforms",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/update-stats", 
      "schedule": "0 * * * *"
    }
  ]
};

/**
 * GitHub Actions Workflow
 * Create .github/workflows/bug-bounty-sync.yml:
 */
export const githubActionWorkflow = `
name: Bug Bounty Sync
on:
  schedule:
    - cron: '0 8 * * *'  # Daily at 8 AM UTC
  workflow_dispatch:      # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Bug Bounty Sync
        run: |
          curl -X POST \${{ secrets.WEBSITE_URL }}/api/bug-bounty/sync-platforms \\
            -H "Authorization: Bearer \${{ secrets.CRON_SECRET_KEY }}" \\
            -H "Content-Type: application/json"
`;

// Export singleton instance
export const syncScheduler = new BugBountySyncScheduler();