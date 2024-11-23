-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "numberOfQuestions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sharedUrl" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_sharedUrl_key" ON "Quiz"("sharedUrl");
