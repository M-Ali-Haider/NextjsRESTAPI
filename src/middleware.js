import { NextResponse } from "next/server";
import { authMiddleware } from "../middlewares/api/authMiddleware";

export const config = {
  matcher: "/api/:path*",
};
export default function middleware(req) {
  const authResult = authMiddleware(req);

  if (!authResult?.isValid && req.method != "GET") {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  return NextResponse.next();
}
