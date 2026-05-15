import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get current bug bounty settings
    const platforms = await prisma.platform.findMany();
    
    // Return current configuration
    const settings = {
      autoSync: true, // This could be stored in a settings table
      syncInterval: 24,
      platforms: platforms.map(p => ({
        id: p.id,
        name: p.name,
        username: p.username,
        enabled: p.active,
        syncStrategy: 'scraping', // Default to scraping
        rateLimit: 10,
        lastSync: p.lastActive,
        status: p.active ? 'active' : 'pending'
      })),
      lastSync: new Date().toISOString(),
      nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to get bug bounty settings:', error);
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    
    // Update platform configurations
    for (const platformConfig of settings.platforms) {
      if (platformConfig.id && platformConfig.id.length > 10) {
        // Existing platform - update
        await prisma.platform.update({
          where: { id: platformConfig.id },
          data: {
            active: platformConfig.enabled,
            username: platformConfig.username,
          }
        });
      } else {
        // New platform - create
        await prisma.platform.create({
          data: {
            name: platformConfig.name,
            username: platformConfig.username,
            profileUrl: `https://${platformConfig.name.toLowerCase()}.com/${platformConfig.username}`,
            reputation: 0,
            rank: null,
            points: 0,
            level: null,
            bugsSubmitted: 0,
            bugsAccepted: 0,
            bugsDuplicate: 0,
            bugsInformational: 0,
            totalEarnings: 0,
            averageReward: 0,
            currency: 'USD',
            hallOfFame: 0,
            certificates: [],
            badges: [],
            joinedAt: new Date().toISOString(),
            lastActive: null,
            activeMonths: 0,
            active: platformConfig.enabled,
            featured: false,
            publicProfile: true,
          }
        });
      }
    }

    // TODO: Save other settings like autoSync, syncInterval in a dedicated settings table
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully' 
    });
    
  } catch (error) {
    console.error('Failed to save bug bounty settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}