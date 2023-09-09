import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "auth";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Un-comment for actual auth
  // if (request.cookies.get(COOKIE_NAME)) {

  // }
}

// See "Matching Paths" below to learn more
export const config = {
  // Regex to match all paths except index, login and signup
  matcher: /^\/(?!home|login|signup).*$/,
};
