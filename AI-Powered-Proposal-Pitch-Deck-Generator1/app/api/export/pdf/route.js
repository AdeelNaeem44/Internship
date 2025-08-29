import PDFDocument from "pdfkit";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";


export async function POST(req) {
const { content } = await req.json();


const token = cookies().get("token")?.value;
const user = token ? await verifyJwt(token) : null;
const plan = user?.plan || "free";


const stream = new ReadableStream({
start(controller) {
const doc = new PDFDocument({ size: "A4", margin: 50 });
const bufs = [];
doc.on("data", (d) => bufs.push(d));
doc.on("end", () => { controller.enqueue(Buffer.concat(bufs)); controller.close(); });


// Header
doc.fontSize(20).text("CodeCelix – Business Proposal", { align: "center" });
doc.moveDown();


// Watermark for Free plan
if (plan === "free") {
doc.fillColor("#999");
doc.rotate(45, { origin: [300, 400] });
doc.fontSize(60).opacity(0.15).text("FREE PLAN – CODECELIX", 80, 250, { align: "center" });
doc.rotate(-45, { origin: [300, 400] });
doc.opacity(1).fillColor("#000");
}


const sections = content?.raw ? { Raw: content.raw } : content;
if (!sections) {
doc.text("No content", { align: "center" });
doc.end();
return;
}


Object.entries(sections).forEach(([title, body]) => {
doc.moveDown(0.5);
doc.fontSize(14).fillColor("#0f172a").text(title.toUpperCase(), { underline: true });
doc.moveDown(0.2);
doc.fontSize(11).fillColor("#111827").text(typeof body === "string" ? body : JSON.stringify(body, null, 2), { align: "left" });
});


doc.end();
},
});


return new Response(stream, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=proposal.pdf" } });
}