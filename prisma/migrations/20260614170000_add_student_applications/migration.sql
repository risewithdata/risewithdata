CREATE TABLE "StudentApplication" (
  "id"                  TEXT NOT NULL,
  "firstName"           TEXT NOT NULL,
  "lastName"            TEXT NOT NULL,
  "address"             TEXT NOT NULL,
  "zipcode"             TEXT NOT NULL,
  "linkedinName"        TEXT NOT NULL,
  "resumeFileName"      TEXT NOT NULL,
  "resumeFileType"      TEXT NOT NULL,
  "resumeFileSizeBytes" INTEGER NOT NULL,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StudentApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StudentApplication_createdAt_idx" ON "StudentApplication"("createdAt");
