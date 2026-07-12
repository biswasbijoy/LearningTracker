type MailtrapMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendOtpEmail(email: string, name: string, otp: string) {
  const token = process.env.MAILTRAP_API_TOKEN;
  const fromEmail = process.env.MAILTRAP_FROM_EMAIL;
  const fromName = process.env.MAILTRAP_FROM_NAME ?? "SQA Learning Tracker";

  if (!token || !fromEmail) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[OTP DEV MODE] Send ${otp} to ${email}`);
      return;
    }

    throw new Error("Mailtrap sender configuration is missing");
  }

  const payload = {
    from: { email: fromEmail, name: fromName },
    to: [{ email, name }],
    subject: "Your registration OTP",
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
  } satisfies Record<string, unknown>;

  const response = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mailtrap send failed: ${response.status} ${errorText}`);
  }
}
