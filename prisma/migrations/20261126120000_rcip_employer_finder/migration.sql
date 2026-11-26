-- RCIP employer finder (26 Nov 2026). Additive only: five new tables, no
-- change to any existing table or row. Rows arrive through
-- POST /api/agent-data/rcip-employers after deploy.

-- CreateTable
CREATE TABLE "RcipEmployer" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "community" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNorm" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "businessTypeNorm" TEXT NOT NULL,
    "sector" TEXT,
    "listedSector" TEXT,
    "listAsOf" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "closedNote" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "emails" TEXT NOT NULL DEFAULT '[]',
    "contactSource" TEXT NOT NULL DEFAULT 'none',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RcipEmployer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinderUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "consentAt" TIMESTAMP(3),
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "noc" TEXT,
    "experience" TEXT,
    "clb" INTEGER,

    CONSTRAINT "FinderUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinderStep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinderStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactReveal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactReveal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactReport" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "userId" TEXT,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ContactReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RcipEmployer_key_key" ON "RcipEmployer"("key");

-- CreateIndex
CREATE INDEX "RcipEmployer_community_idx" ON "RcipEmployer"("community");

-- CreateIndex
CREATE INDEX "RcipEmployer_sector_idx" ON "RcipEmployer"("sector");

-- CreateIndex
CREATE UNIQUE INDEX "FinderUser_email_key" ON "FinderUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FinderStep_userId_step_key" ON "FinderStep"("userId", "step");

-- CreateIndex
CREATE INDEX "ContactReveal_userId_createdAt_idx" ON "ContactReveal"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContactReveal_userId_employerId_key" ON "ContactReveal"("userId", "employerId");

-- CreateIndex
CREATE INDEX "ContactReport_resolvedAt_createdAt_idx" ON "ContactReport"("resolvedAt", "createdAt");

-- AddForeignKey
ALTER TABLE "FinderStep" ADD CONSTRAINT "FinderStep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "FinderUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactReveal" ADD CONSTRAINT "ContactReveal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "FinderUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactReveal" ADD CONSTRAINT "ContactReveal_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "RcipEmployer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactReport" ADD CONSTRAINT "ContactReport_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "RcipEmployer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

