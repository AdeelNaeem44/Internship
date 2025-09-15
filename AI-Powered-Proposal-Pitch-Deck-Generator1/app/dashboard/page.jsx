"use client";
import { useState } from "react";
import InputForm from "@/components/InputForm";

export default function Dashboard() {
  const [sections, setSections] = useState(null);

  const exportFile = async (type) => {
    const res = await fetch(`/api/export/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: sections }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "pdf" ? "proposal.pdf" : "pitch_deck.pptx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pretty = (obj) => JSON.stringify(obj, null, 2);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">AI Pitch Deck Generator</h1>
          <a
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            href="/api/auth/logout"
          >
            Logout
          </a>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Create a New Proposal / Pitch Deck</h2>
          <InputForm onGenerate={setSections} />
        </div>

        {/* Preview */}
        {sections && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Generated Preview</h3>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-96 border border-gray-200 dark:border-gray-700">
              {pretty(sections)}
            </pre>
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
                onClick={() => exportFile("pdf")}
              >
                Export PDF
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                onClick={() => exportFile("pptx")}
              >
                Export PPTX
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
