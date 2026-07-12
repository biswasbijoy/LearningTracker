import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authSchema } from "@/lib/validations";
import { createRoadmapForUser } from "@/lib/registration";
import { sendOtpEmail } from "@/lib/mailtrap";

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

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

    const otp = generateOtp();
    const passwordHash = await bcrypt.hash(password, 12);
    const otpHash = hashOtp(otp);

    await prisma.pendingRegistration.upsert({
      where: { email },
      create: {
        email,
        name: name ?? email.split("@")[0],
        password: passwordHash,
        otpHash,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
      update: {
        name: name ?? email.split("@")[0],
        password: passwordHash,
        otpHash,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
    });

    await sendOtpEmail(email, name ?? email.split("@")[0], otp);

    return Response.json(
      {
        message: "OTP sent to email",
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration request error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";

    if (!email || !otp) {
      return Response.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const pending = await prisma.pendingRegistration.findUnique({ where: { email } });
    if (!pending) {
      return Response.json({ error: "OTP request not found" }, { status: 404 });
    }

    if (pending.otpExpiresAt < new Date()) {
      await prisma.pendingRegistration.delete({ where: { email } });
      return Response.json({ error: "OTP has expired" }, { status: 400 });
    }

    if (pending.attempts >= 5) {
      await prisma.pendingRegistration.delete({ where: { email } });
      return Response.json({ error: "Too many invalid attempts. Request a new OTP." }, { status: 429 });
    }

    const isValid = pending.otpHash === hashOtp(otp);
    if (!isValid) {
      await prisma.pendingRegistration.update({
        where: { email },
        data: { attempts: { increment: 1 } },
      });

      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      await prisma.pendingRegistration.delete({ where: { email } });
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: pending.name ?? email.split("@")[0],
        password: pending.password,
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

    await prisma.pendingRegistration.delete({ where: { email } });

    return Response.json({ user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Registration verification error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
