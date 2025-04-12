// /app/api/signup/route.js
import { createUser } from "@/lib/db";

export async function POST(req) {
  const { email, password } = await req.json();
  const user = await createUser(email, password);
  return Response.json({ success: true, user });
}
