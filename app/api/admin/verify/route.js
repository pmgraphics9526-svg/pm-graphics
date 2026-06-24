import { isAuthenticated } from "@/lib/auth";

export async function GET(request) {
  const user = isAuthenticated(request);
  if (!user) {
    return Response.json({ authenticated: false }, { status: 401 });
  }
  return Response.json({ authenticated: true });
}
