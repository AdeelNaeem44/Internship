"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return (
    <div className="header container">
      <div className="logo">{process.env.NEXT_PUBLIC_APP_NAME || "AI Pitcher"}</div>
      <div className="actions">
        {!token ? (
          <>
            <button className="btn" onClick={() => router.push("/login")}>Login</button>
            <button className="btn" onClick={() => router.push("/register")}>Register</button>
          </>
        ) : (
          <button className="btn" onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  );
}
