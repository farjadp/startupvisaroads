-- The knowledge tweets have no article behind them: they are written from a
-- theme, for the English account, on the days the blog has nothing new to say.
-- The row is still worth keeping — it is how a repeat is avoided and how the
-- digest knows the lane ran at all.
ALTER TABLE "SocialPost" ALTER COLUMN "articleId" DROP NOT NULL;
ALTER TABLE "SocialPost" ADD COLUMN "topic" TEXT;
