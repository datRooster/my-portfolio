import { NextRequest, NextResponse } from 'next/server';
import { syncScheduler } from '@/lib/cron/bug-bounty-scheduler';

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET_KEY;
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    console.log('[CRON] Platform sync job triggered');
    
    // Execute the platform sync job
    await syncScheduler.executeJob('platform-sync-daily');
    
    return NextResponse.json({
      success: true,
      message: 'Platform sync job completed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[CRON] Platform sync job failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Platform sync job failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}