CREATE TYPE "CourseStatus" AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TABLE "AdminCourse" (
  "id"                   TEXT          NOT NULL,
  "name"                 TEXT          NOT NULL,
  "trainerName"          TEXT          NOT NULL,
  "duration"             TEXT          NOT NULL,
  "startDate"            TIMESTAMP(3)  NOT NULL,
  "endDate"              TIMESTAMP(3)  NOT NULL,
  "seatsAvailable"       INTEGER       NOT NULL DEFAULT 0,
  "applicationsReceived" INTEGER       NOT NULL DEFAULT 0,
  "status"               "CourseStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt"            TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"            TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminCourse_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminCourse_status_idx"      ON "AdminCourse"("status");
CREATE INDEX "AdminCourse_createdAt_idx"   ON "AdminCourse"("createdAt");
CREATE INDEX "AdminCourse_trainerName_idx" ON "AdminCourse"("trainerName");
