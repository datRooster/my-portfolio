-- CreateTable
CREATE TABLE "visitor_sessions" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pageViews" INTEGER NOT NULL DEFAULT 1,
    "currentPage" TEXT,
    "referrer" TEXT,
    "isMobile" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,

    CONSTRAINT "visitor_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visitor_sessions_fingerprint_idx" ON "visitor_sessions"("fingerprint");

-- CreateIndex
CREATE INDEX "visitor_sessions_lastSeen_idx" ON "visitor_sessions"("lastSeen");

-- CreateIndex
CREATE INDEX "visitor_sessions_firstSeen_idx" ON "visitor_sessions"("firstSeen");
