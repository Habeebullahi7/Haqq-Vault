import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  const protectedRoutes = ["/vault", "/wasiyyah", "/kaffarah", "/account", "/tracker"];
  const isProtected = protectedRoutes.some(p => req.nextUrl.pathname.startsWith(p));
  if (isProtected && !session) return NextResponse.redirect(new URL("/login", req.url));
  if (req.nextUrl.pathname === "/login" && session) return NextResponse.redirect(new URL("/vault", req.url));
  return res;
}
export const config = { matcher: ["/vault/:path*", "/wasiyyah/:path*", "/kaffarah/:path*", "/account/:path*", "/tracker/:path*", "/login"] };
