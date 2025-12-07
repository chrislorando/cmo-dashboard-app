-- CreateTable
CREATE TABLE "cmo_dashboard"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cmo_dashboard"."notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "cmo_dashboard"."users"("email");

-- CreateIndex
CREATE INDEX "notes_userId_idx" ON "cmo_dashboard"."notes"("userId");

-- CreateIndex
CREATE INDEX "notes_parentId_idx" ON "cmo_dashboard"."notes"("parentId");

-- CreateIndex
CREATE INDEX "notes_type_idx" ON "cmo_dashboard"."notes"("type");

-- CreateIndex
CREATE UNIQUE INDEX "notes_userId_parentId_name_key" ON "cmo_dashboard"."notes"("userId", "parentId", "name");

-- AddForeignKey
ALTER TABLE "cmo_dashboard"."notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "cmo_dashboard"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cmo_dashboard"."notes" ADD CONSTRAINT "notes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "cmo_dashboard"."notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
