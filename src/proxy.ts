import { auth } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api/auth|login|register|onboarding|_next/static|_next/image|favicon.ico).*)",
  ],
};

export default auth;
