import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authSchema } from "@/lib/validations";
import { createRoadmapForUser } from "@/lib/registration";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = authSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid registration details" },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? email.split("@")[0],
        password: passwordHash,
      },
    });

    await prisma.userPreference.create({
      data: {
        userId: user.id,
        theme: "system",
        weekdayHourGoal: 1.5,
        weekendHourGoal: 5,
      },
    });

    await createRoadmapForUser(user.id);

    return Response.json({ user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
