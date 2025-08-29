import { cookies } from "next/headers";
export async function GET() {
cookies().set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
return Response.redirect(new URL("/login", process.env.APP_URL || "http://localhost:3000"));
}