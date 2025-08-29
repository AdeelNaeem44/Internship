"use client";
import { useState } from "react";


export default function InputForm({ onGenerate }) {
const [form, setForm] = useState({ clientName: "", industry: "", description: "", targetMarket: "", budget: "", competitors: "" });
const [loading, setLoading] = useState(false);


const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


const submit = async (e) => {
e.preventDefault();
setLoading(true);
const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
const data = await res.json();
setLoading(false);
onGenerate(data.sections);
};


return (
<form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
<div className="md:col-span-1">
<label className="label">Company / Client Name</label>
<input className="input" name="clientName" onChange={handleChange} />
</div>
<div className="md:col-span-1">
<label className="label">Industry / Niche</label>
<input className="input" name="industry" onChange={handleChange} />
</div>
<div className="md:col-span-2">
<label className="label">Project Description</label>
<textarea className="input h-28" name="description" onChange={handleChange} />
</div>
<div>
<label className="label">Target Market</label>
<input className="input" name="targetMarket" onChange={handleChange} />
</div>
<div>
<label className="label">Budget & Goals</label>
<input className="input" name="budget" onChange={handleChange} />
</div>
<div className="md:col-span-2">
<label className="label">Competitors (optional)</label>
<input className="input" name="competitors" onChange={handleChange} />
</div>
<button className="btn btn-primary md:col-span-2" type="submit" disabled={loading}>{loading ? "Generating…" : "Generate with AI"}</button>
</form>
);
}