import "../styles/globals.css";


export const metadata = { title: "CodeCelix | AI Proposal & Pitch Deck", description: "Generate proposals & decks with AI" };


export default function RootLayout({ children }) {
return (
<html lang="en">
<body>
<div className="max-w-6xl mx-auto p-6">
<header className="flex items-center justify-between mb-6">
<div className="flex items-center gap-3">
<div className="size-9 rounded-2xl bg-blue-600" />
<div className="font-bold text-lg">CodeCelix – AI Pitcher</div>
</div>
<nav className="flex gap-2">
<a className="btn btn-secondary" href="/login">Login</a>
<a className="btn btn-primary" href="/register">Register</a>
</nav>
</header>
{children}
</div>
</body>
</html>
);
}