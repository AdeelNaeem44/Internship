import pptxgen from "pptxgenjs";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";


export async function POST(req) {
const { content } = await req.json();
const token = cookies().get("token")?.value;
const user = token ? await verifyJwt(token) : null;
const plan = user?.plan || "free";


const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";


const addSlide = (title, body) => {
const s = pptx.addSlide();
s.addText(title, { x: 0.5, y: 0.4, w: 9, h: 1, fontSize: 28, bold: true });
s.addText(typeof body === "string" ? body : JSON.stringify(body, null, 2), { x: 0.5, y: 1.2, w: 9, h: 4.5, fontSize: 16, valign: "top" });
if (plan === "free") {
s.addText("FREE – CodeCelix", { x: 0.5, y: 6.6, w: 9, h: 0.4, fontSize: 12, italic: true, align: "center" });
}
};


const sections = content?.raw ? { Raw: content.raw } : content;
if (!sections) return Response.json({ error: "No content" }, { status: 400 });


Object.entries(sections).forEach(([k, v]) => addSlide(k, v));


const buffer = await pptx.write("nodebuffer");
return new Response(buffer, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation", "Content-Disposition": "attachment; filename=pitch_deck.pptx" } });
}