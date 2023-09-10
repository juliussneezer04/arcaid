-- CreateTable
CREATE TABLE "Application" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "applicationHash" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_email_key" ON "Application"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Application_applicationHash_key" ON "Application"("applicationHash");
