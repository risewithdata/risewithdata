CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'INSTRUCTOR', 'STUDENT');

CREATE TABLE "User" (
  "id"           TEXT NOT NULL,
  "email"        TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "firstName"    TEXT NOT NULL,
  "lastName"     TEXT NOT NULL,
  "role"         "Role" NOT NULL,
  "active"       BOOLEAN NOT NULL DEFAULT true,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
