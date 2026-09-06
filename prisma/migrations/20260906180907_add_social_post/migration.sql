-- One attempt to publish one article to one social destination.
-- The unique constraint is the duplicate guard: it makes a second send to the
-- same destination impossible rather than merely unlikely.
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'article',
    "postedAt" TIMESTAMP(3),
    "remoteUrl" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SocialPost_articleId_destination_kind_key"
    ON "SocialPost"("articleId", "destination", "kind");

CREATE INDEX "SocialPost_destination_createdAt_idx"
    ON "SocialPost"("destination", "createdAt");

ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_articleId_fkey"
    FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
