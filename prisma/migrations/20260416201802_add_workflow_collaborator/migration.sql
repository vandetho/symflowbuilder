-- AlterTable
ALTER TABLE "Workflow" ALTER COLUMN "symfonyVersion" SET DEFAULT '8.0';

-- CreateTable
CREATE TABLE "WorkflowCollaborator" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkflowCollaborator_userId_idx" ON "WorkflowCollaborator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowCollaborator_workflowId_userId_key" ON "WorkflowCollaborator"("workflowId", "userId");

-- AddForeignKey
ALTER TABLE "WorkflowCollaborator" ADD CONSTRAINT "WorkflowCollaborator_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCollaborator" ADD CONSTRAINT "WorkflowCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
