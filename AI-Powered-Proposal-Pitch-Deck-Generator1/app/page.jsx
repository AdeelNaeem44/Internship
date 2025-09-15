export default function Page() {
return (
<main className="grid md:grid-cols-2 gap-6 items-center">
<section className="card">
<h1 className="text-3xl font-extrabold">AI‑Powered Proposal & Pitch Deck Generator</h1>
<p className="mt-3 text-neutral-600 dark:text-neutral-300">Turn client briefs into professional proposals (PDF) and investor decks (PPTX) in minutes. Free plan includes watermark. Premium plan coming soon.</p>
<div className="mt-6 flex gap-3">
<a className="btn btn-primary" href="/dashboard">Open Dashboard</a>
<a className="btn btn-secondary" href="/register">Create Account</a>
</div>
</section>
<section className="card">
<ul className="space-y-2 list-disc list-inside">
<li>Gemini API for content</li>
<li>MongoDB Atlas storage</li>
<li>JWT auth (cookies)</li>
<li>PDF & PPTX exports with templates</li>
</ul>
</section>
</main>
);
}