import mongoose from "mongoose";


const ProposalSchema = new mongoose.Schema(
{
userId: { type: String, required: true },
clientName: String,
industry: String,
description: String,
targetMarket: String,
budget: String,
competitors: String,
generatedContent: Object,
},
{ timestamps: true }
);


export default mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);