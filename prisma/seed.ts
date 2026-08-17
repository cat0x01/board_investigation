import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.caseEdge.deleteMany();
  await prisma.caseNode.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.note.deleteMany();
  await prisma.case.deleteMany({ where: { caseId: "23-7482-X" } });

  const created = await prisma.case.create({
    data: {
      caseId: "23-7482-X",
      title: "Operation Nightfall",
      codename: "Nightfall",
      status: "Active",
      priority: "Critical",
      assignedAnalyst: "Local Analyst",
      tags: JSON.stringify(["cybercrime", "financial-crime", "malware"]),
      description: "Fictional investigation into an intrusion ring coordinating data theft, malware deployment, and offshore fund transfers."
    }
  });

  const nodes = [
    node("victor-marquez", "Suspect", "Victor Marquez", "Primary suspect", "Main suspect in cyber espionage and data breach conspiracy.", 480, 110, "Critical", ["primary", "watchlist"]),
    node("alex-rivera", "Person", "Alex Rivera", "Associate", "IT specialist and close associate of Victor Marquez.", 190, 360, "High", ["associate"]),
    node("isabella-moretti", "Person", "Isabella Moretti", "Logistics contact", "Handles logistics and safehouse arrangements.", 800, 600, "High", ["logistics"]),
    node("blackcell-tech", "Organization", "Blackcell Tech", "Cybersecurity firm", "Cybersecurity firm used as a front for illegal operations.", 170, 120, "Critical", ["front-company"]),
    node("encrypted-laptop", "Device", "Encrypted Laptop", "Device", "Contains encrypted notes and hacking tools.", 600, 360, "High", ["device"]),
    node("offshore-account", "Bank Account", "Offshore Account", "Financial node", "Receives laundered funds from multiple accounts.", 420, 560, "High", ["finance"]),
    node("prague-safehouse", "Location", "Prague Safehouse", "Location", "Location of meetings between suspects and contacts.", 980, 360, "Medium", ["safehouse"]),
    node("nightfall-malware", "Malware Sample", "nightfall.exe", "Malware sample", "Loader associated with the observed breach activity.", 650, 520, "Critical", ["malware"]),
    node("data-breach", "Event", "Data Breach Incident", "Incident", "Multiple government and corporate data breaches.", 690, 670, "Critical", ["breach"]),
    node("crypto-wallet", "Crypto Wallet", "Crypto Wallet", "Wallet", "Wallet used to route investigation-linked transfers.", 390, 410, "High", ["crypto"])
  ];

  for (const item of nodes) {
    await prisma.caseNode.create({ data: { ...item, caseId: created.id } });
  }

  const edge = (id: string, sourceNodeId: string, targetNodeId: string, relationType: string, color: string, lineStyle = "solid") => ({
    id,
    sourceNodeId,
    targetNodeId,
    relationType,
    shortDescription: `${relationType} relationship recorded during Operation Nightfall.`,
    confidence: 82,
    color,
    lineStyle,
    direction: "one-way",
    source: "Seed intelligence packet",
    caseId: created.id
  });

  const edges = [
    edge("edge-victor-blackcell", "victor-marquez", "blackcell-tech", "Works For", "#ef4444"),
    edge("edge-alex-victor", "alex-rivera", "victor-marquez", "Communicates With", "#94a3b8", "dashed"),
    edge("edge-victor-laptop", "victor-marquez", "encrypted-laptop", "Uses", "#cbd5e1"),
    edge("edge-laptop-malware", "encrypted-laptop", "nightfall-malware", "Related To", "#ef4444"),
    edge("edge-victor-wallet", "victor-marquez", "crypto-wallet", "Controls", "#38bdf8"),
    edge("edge-wallet-offshore", "crypto-wallet", "offshore-account", "Transferred", "#22c55e"),
    edge("edge-isabella-victor", "isabella-moretti", "victor-marquez", "Associated With", "#a3e635"),
    edge("edge-isabella-safehouse", "isabella-moretti", "prague-safehouse", "Uses", "#f59e0b", "dashed"),
    edge("edge-breach-malware", "data-breach", "nightfall-malware", "Related To", "#ef4444")
  ];

  for (const item of edges) {
    await prisma.caseEdge.create({ data: item });
  }

  for (const item of [
    {
      caseId: created.id,
      title: "Encrypted disk image manifest",
      fileType: "Document",
      source: "Forensic acquisition",
      collectedBy: "Local Analyst",
      chainOfCustodyNotes: "Acquired from a fictional lab image. Hashes are demo values only.",
      sha256: "9f4c2e8b7a19d733e82e6fbdcad000000000000000000000000000000000000"
    },
    {
      caseId: created.id,
      title: "Wallet transfer ledger",
      fileType: "CSV",
      source: "Financial analysis",
      collectedBy: "Local Analyst",
      chainOfCustodyNotes: "Synthetic transaction ledger connected to the demo wallet node."
    }
  ]) {
    await prisma.evidence.create({ data: item });
  }

  for (const item of [
    { caseId: created.id, occurredAt: new Date("2026-03-04T22:30:00Z"), title: "Initial breach activity detected", eventType: "Data Breach", severity: "Critical", description: "Fictional intrusion telemetry shows nightfall.exe staging activity." },
    { caseId: created.id, occurredAt: new Date("2026-03-08T14:15:00Z"), title: "Wallet transfer cluster flagged", eventType: "Financial", severity: "High", description: "Synthetic wallet transfers linked to offshore routing pattern." },
    { caseId: created.id, occurredAt: new Date("2026-03-12T09:45:00Z"), title: "Safehouse meeting logged", eventType: "Surveillance", severity: "Medium", description: "Demo timeline note connecting logistics contact to Prague safehouse." }
  ]) {
    await prisma.timelineEvent.create({ data: item });
  }

  await prisma.note.create({
    data: {
      caseId: created.id,
      title: "Initial analyst summary",
      body: "## Key Assessment\n\nVictor Marquez appears central to the fictional Nightfall graph. The strongest links are the device, malware sample, and crypto wallet relations.\n\n- Validate wallet transfer chain\n- Review laptop-linked evidence\n- Expand safehouse travel timeline",
      tags: JSON.stringify(["summary", "priority"]),
      pinned: true
    }
  });

  await prisma.activityLog.create({
    data: {
      caseId: created.id,
      action: "seeded",
      entity: "case",
      entityId: created.id,
      details: JSON.stringify({ name: "Operation Nightfall" })
    }
  });
}

function node(id: string, type: string, title: string, subtitle: string, description: string, x: number, y: number, priority: string, tags: string[]) {
  return {
    id,
    type,
    title,
    subtitle,
    description,
    image: "",
    status: "Active",
    priority,
      tags: JSON.stringify(tags),
    source: "Seed intelligence packet",
    confidence: priority === "Critical" ? 92 : 78,
    x,
    y,
    metadata: JSON.stringify({ fictional: true })
  };
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
