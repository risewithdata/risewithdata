ALTER TABLE "VolunteerApplication"
  ADD COLUMN "email"      TEXT NOT NULL DEFAULT '',
  ADD COLUMN "status"     "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "adminNotes" TEXT,
  ADD COLUMN "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "VolunteerApplication_status_idx" ON "VolunteerApplication"("status");
