-- Add resume file storage to StudentApplication
ALTER TABLE "StudentApplication"
  ADD COLUMN IF NOT EXISTS "resumeFileData" BYTEA,
  ADD COLUMN IF NOT EXISTS "adminNotes"     TEXT,
  ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
