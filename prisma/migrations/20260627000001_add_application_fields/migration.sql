CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "StudentApplication"
  ADD COLUMN IF NOT EXISTS "email"         TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "courseApplied" TEXT,
  ADD COLUMN IF NOT EXISTS "trainer"       TEXT,
  ADD COLUMN IF NOT EXISTS "status"        "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "StudentApplication_status_idx" ON "StudentApplication"("status");
CREATE INDEX IF NOT EXISTS "StudentApplication_email_idx"  ON "StudentApplication"("email");
