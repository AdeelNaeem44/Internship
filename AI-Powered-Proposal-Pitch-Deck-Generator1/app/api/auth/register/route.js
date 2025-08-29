// app/api/auth/register/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password, plan } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    // hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      plan: plan || "free",
    });

    await newUser.save();

    return Response.json(
      { message: "User registered successfully", user: { id: newUser._id, email: newUser.email } },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
