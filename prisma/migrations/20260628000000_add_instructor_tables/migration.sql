CREATE TABLE "CourseMaterial" (
  "id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "courseName" TEXT NOT NULL,
  "title" TEXT NOT NULL, "description" TEXT, "fileName" TEXT NOT NULL,
  "fileType" TEXT NOT NULL, "uploadedBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CourseMaterial_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CourseMaterial_courseId_idx" ON "CourseMaterial"("courseId");
CREATE INDEX "CourseMaterial_uploadedBy_idx" ON "CourseMaterial"("uploadedBy");

CREATE TABLE "CourseAnnouncement" (
  "id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "courseName" TEXT NOT NULL,
  "title" TEXT NOT NULL, "body" TEXT NOT NULL, "postedBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CourseAnnouncement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CourseAnnouncement_courseId_idx" ON "CourseAnnouncement"("courseId");
CREATE INDEX "CourseAnnouncement_postedBy_idx" ON "CourseAnnouncement"("postedBy");

CREATE TABLE "CourseScheduleSlot" (
  "id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "courseName" TEXT NOT NULL,
  "title" TEXT NOT NULL, "slotDate" TIMESTAMP(3) NOT NULL,
  "startTime" TEXT NOT NULL, "endTime" TEXT NOT NULL,
  "location" TEXT, "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CourseScheduleSlot_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CourseScheduleSlot_courseId_idx" ON "CourseScheduleSlot"("courseId");
