-- Drop old resume and terms columns
ALTER TABLE "ContactSubmission" DROP COLUMN IF EXISTS "resumeFileName";
ALTER TABLE "ContactSubmission" DROP COLUMN IF EXISTS "resumeFileType";
ALTER TABLE "ContactSubmission" DROP COLUMN IF EXISTS "resumeFileSizeBytes";
ALTER TABLE "ContactSubmission" DROP COLUMN IF EXISTS "termsAccepted";

-- Add message column (use default '' for any existing rows, then drop default)
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "message" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ContactSubmission" ALTER COLUMN "message" DROP DEFAULT;
