import { prisma } from "@symflowbuilder/db";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/lib/schemas/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = signUpSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = parsed.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return Response.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return Response.json({ id: user.id }, { status: 201 });
    } catch {
        return Response.json({ error: "Failed to create account" }, { status: 500 });
    }
}
