import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const workspaceRoot = path.join(__dirname, "..", "..");

dotenv.config({ path: path.join(workspaceRoot, ".env.local") });
dotenv.config({ path: path.join(workspaceRoot, ".env") });
dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

export default defineConfig({
    schema: path.join(__dirname, "prisma", "schema.prisma"),
    datasource: process.env.DATABASE_URL ? { url: process.env.DATABASE_URL } : undefined,
});
