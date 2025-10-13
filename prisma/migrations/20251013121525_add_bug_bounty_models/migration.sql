-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "LoginFailureReason" AS ENUM ('INVALID_CREDENTIALS', 'ACCOUNT_LOCKED', 'ACCOUNT_SUSPENDED', 'TWO_FACTOR_REQUIRED', 'TWO_FACTOR_INVALID', 'IP_BLOCKED', 'RATE_LIMITED');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SecurityEventType" AS ENUM ('BRUTE_FORCE_ATTEMPT', 'SUSPICIOUS_LOGIN', 'UNAUTHORIZED_ACCESS', 'SQL_INJECTION_ATTEMPT', 'XSS_ATTEMPT', 'CSRF_ATTACK', 'DDoS_ATTEMPT', 'PRIVILEGE_ESCALATION', 'DATA_EXFILTRATION');

-- CreateEnum
CREATE TYPE "SecuritySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "BugSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL');

-- CreateEnum
CREATE TYPE "VulnerabilityCategory" AS ENUM ('SQL_INJECTION', 'XSS_REFLECTED', 'XSS_STORED', 'XSS_DOM', 'CSRF', 'IDOR', 'AUTHENTICATION_BYPASS', 'AUTHORIZATION_FLAW', 'SESSION_MANAGEMENT', 'RCE', 'LFI', 'RFI', 'DIRECTORY_TRAVERSAL', 'COMMAND_INJECTION', 'BUSINESS_LOGIC', 'RACE_CONDITION', 'PRICE_MANIPULATION', 'PRIVILEGE_ESCALATION', 'SENSITIVE_DATA_EXPOSURE', 'PII_DISCLOSURE', 'DEBUGGING_INFO', 'API_MISCONFIGURATION', 'BROKEN_AUTHENTICATION', 'EXCESSIVE_DATA_EXPOSURE', 'RATE_LIMITING_BYPASS', 'MOBILE_APP_VULN', 'DEEP_LINK_ABUSE', 'SOCIAL_ENGINEERING', 'PHISHING', 'PHYSICAL_SECURITY', 'CRYPTOGRAPHIC_FAILURE', 'MISCONFIGURATION', 'OTHER');

-- CreateEnum
CREATE TYPE "BugReportStatus" AS ENUM ('SUBMITTED', 'TRIAGING', 'ACCEPTED', 'RESOLVED', 'FIXED', 'DUPLICATE', 'NOT_APPLICABLE', 'INFORMATIONAL', 'PENDING_DISCLOSURE', 'DISCLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('FIRST_BUG', 'SEVERITY_MILESTONE', 'PLATFORM_MILESTONE', 'FINANCIAL_MILESTONE', 'RECOGNITION', 'COLLABORATION', 'COMMUNITY', 'CERTIFICATION', 'CVE_ASSIGNMENT', 'HALL_OF_FAME', 'SPECIAL_EVENT', 'ANNIVERSARY');

-- CreateEnum
CREATE TYPE "AchievementDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "MethodologyCategory" AS ENUM ('WEB_APPLICATION', 'API_TESTING', 'MOBILE_APPLICATION', 'INFRASTRUCTURE', 'SOCIAL_ENGINEERING', 'PHYSICAL_SECURITY', 'CRYPTOGRAPHY', 'REVERSE_ENGINEERING', 'BUSINESS_LOGIC', 'RECONNAISSANCE', 'AUTOMATION', 'MANUAL_TESTING');

-- CreateEnum
CREATE TYPE "MethodologyDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "backupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifyToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockoutUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIP" TEXT,
    "lastLoginLocation" TEXT,
    "currentSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdIP" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "location" TEXT,
    "deviceFingerprint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "location" TEXT,
    "deviceFingerprint" TEXT,
    "success" BOOLEAN NOT NULL,
    "failureReason" "LoginFailureReason",
    "twoFactorUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "type" "SecurityEventType" NOT NULL,
    "severity" "SecuritySeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "userId" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "geoLocation" TEXT,
    "actionTaken" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ip_whitelist" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ip_whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_buckets" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "lastRefill" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bug_bounty_stats" (
    "id" TEXT NOT NULL,
    "totalBugs" INTEGER NOT NULL DEFAULT 0,
    "criticalBugs" INTEGER NOT NULL DEFAULT 0,
    "highBugs" INTEGER NOT NULL DEFAULT 0,
    "mediumBugs" INTEGER NOT NULL DEFAULT 0,
    "lowBugs" INTEGER NOT NULL DEFAULT 0,
    "informationalBugs" INTEGER NOT NULL DEFAULT 0,
    "totalReward" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalBounty" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avgRewardPerBug" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cveAssigned" INTEGER NOT NULL DEFAULT 0,
    "hallOfFame" INTEGER NOT NULL DEFAULT 0,
    "publicDisclosures" INTEGER NOT NULL DEFAULT 0,
    "avgResolutionDays" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fastestResolution" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bug_bounty_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bug_reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "privateNotes" TEXT,
    "severity" "BugSeverity" NOT NULL,
    "category" "VulnerabilityCategory" NOT NULL,
    "cweId" TEXT,
    "cveId" TEXT,
    "program" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "programUrl" TEXT,
    "methodology" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "payload" TEXT,
    "impact" TEXT NOT NULL,
    "affectedAssets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "usersAffected" INTEGER,
    "discoveredAt" TIMESTAMP(3) NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL,
    "firstResponseAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "disclosedAt" TIMESTAMP(3),
    "status" "BugReportStatus" NOT NULL DEFAULT 'SUBMITTED',
    "resolution" TEXT,
    "reproducible" BOOLEAN NOT NULL DEFAULT true,
    "duplicate" BOOLEAN NOT NULL DEFAULT false,
    "reward" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "bonusReward" DOUBLE PRECISION,
    "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "proofOfConcept" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reportUrl" TEXT,
    "publicUrl" TEXT,
    "blogPostUrl" TEXT,
    "collaborators" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "credits" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statsId" TEXT,

    CONSTRAINT "bug_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platforms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profileUrl" TEXT,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "rank" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "level" TEXT,
    "bugsSubmitted" INTEGER NOT NULL DEFAULT 0,
    "bugsAccepted" INTEGER NOT NULL DEFAULT 0,
    "bugsDuplicate" INTEGER NOT NULL DEFAULT 0,
    "bugsInformational" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averageReward" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "hallOfFame" INTEGER NOT NULL DEFAULT 0,
    "certificates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "joinedAt" TIMESTAMP(3),
    "lastActive" TIMESTAMP(3),
    "activeMonths" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publicProfile" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statsId" TEXT,

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "AchievementCategory" NOT NULL,
    "icon" TEXT,
    "badgeUrl" TEXT,
    "color" TEXT,
    "issuedBy" TEXT NOT NULL,
    "certificateUrl" TEXT,
    "verificationUrl" TEXT,
    "criteria" TEXT,
    "difficulty" "AchievementDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "rarity" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "points" INTEGER,
    "monetaryValue" DOUBLE PRECISION,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publicVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statsId" TEXT,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "methodologies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "MethodologyCategory" NOT NULL,
    "steps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "exampleTargets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "examplePayloads" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "commonMistakes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" "MethodologyDifficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "estimatedTime" TEXT,
    "successRate" DOUBLE PRECISION,
    "resources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "references" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "bugsFound" INTEGER NOT NULL DEFAULT 0,
    "lastUsed" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publicVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "methodologies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionToken_key" ON "user_sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refreshToken_key" ON "user_sessions"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "ip_whitelist_ipAddress_key" ON "ip_whitelist"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "rate_limit_buckets_identifier_bucket_key" ON "rate_limit_buckets"("identifier", "bucket");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_name_key" ON "platforms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "methodologies_name_key" ON "methodologies"("name");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bug_reports" ADD CONSTRAINT "bug_reports_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "bug_bounty_stats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platforms" ADD CONSTRAINT "platforms_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "bug_bounty_stats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "bug_bounty_stats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
