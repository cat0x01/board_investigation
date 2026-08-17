import { prisma } from "../src/lib/db/prisma";
import { encodeEvidenceData, encodeNodeData, encodeNoteData, encodeTimelineData } from "../src/lib/db/serde";

const CASE_NUMBER = "INT-2026-0917";

function portrait(initials: string, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#070707"/><circle cx="200" cy="145" r="75" fill="${color}"/><path d="M65 390c10-105 65-150 135-150s125 45 135 150" fill="${color}"/><text x="200" y="375" text-anchor="middle" font-family="Arial" font-size="30" font-weight="bold" fill="#080808">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function main() {
  const owner = await prisma.user.findFirst({ where: { email: "cat0x01@gmail.com" } }) ?? await prisma.user.findFirst();
  if (!owner) throw new Error("No user exists to own the training case.");
  const previous = await prisma.case.findUnique({ where: { caseId: CASE_NUMBER } });
  if (previous) {
    console.log(`Training case already exists: ${previous.id}`);
    return;
  }

  const record = await prisma.case.create({ data: {
    caseId: CASE_NUMBER,
    title: "Operation Crimson Echo",
    codename: "Crimson Echo",
    status: "Active",
    priority: "Critical",
    assignedAnalyst: owner.name,
    tags: JSON.stringify(["fictional", "training", "homicide", "digital-forensics", "priority"]),
    description: "FICTIONAL TRAINING CASE. Investigation into the simulated homicide of investigative journalist Elena Ward, discovered at the Blackwood Hotel on 14 July 2026. Evidence indicates premeditation, financial motive, digital surveillance, and an attempted staged robbery.",
    urls: "https://example.test/cases/crimson-echo\nhttps://example.test/lab/CE-2026",
    userId: owner.id
  }});

  const nodeFixtures = [
    { key: "suspect", type: "Suspect", title: "Marcus Vale", subtitle: "Primary suspect · Security contractor", description: "Former security contractor with access to the victim's travel itinerary. CCTV and telecom evidence place him near the hotel during the murder window.", image: portrait("MV", "#d7aa28"), status: "Under Review", priority: "Critical", confidence: 92, x: 650, y: 220, tags: ["primary-suspect", "trained", "financial-motive"], metadata: { alias: "Rook", dateOfBirth: "1984-11-03", nationality: "British", location: "London, United Kingdom", contact: "+44 7700 900101 | marcus.vale@example.test", identifier: "SUBJ-MV-001", occupation: "Private Security Consultant", socialAccounts: "X: @rook_vale_demo\nLinkedIn: /in/marcus-vale-training", files: "suspect-profile.pdf\ninterview-transcript-01.pdf", intelligenceNotes: "Subject denies entering the hotel. Gait analysis indicates an 89% similarity to the masked individual recorded at 22:41." } },
    { key: "victim", type: "Victim", title: "Elena Ward", subtitle: "Victim · Investigative journalist", description: "Journalist investigating offshore payments connected to Helix Meridian Group. Last confirmed alive at 22:18 on 14 July 2026.", image: portrait("EW", "#e7d9b4"), status: "Verified", priority: "High", confidence: 100, x: 150, y: 220, tags: ["victim", "journalist", "verified"], metadata: { dateOfBirth: "1991-02-18", nationality: "Canadian", location: "Room 714, Blackwood Hotel", contact: "elena.ward@example.test", identifier: "VICT-EW-001", occupation: "Investigative Journalist", socialAccounts: "X: @ElenaWardReports\nInstagram: @elenaward.demo", files: "victim-background.pdf\nlast-article-draft.docx", intelligenceNotes: "Victim was preparing to publish a financial investigation within 48 hours." } },
    { key: "witness", type: "Person", title: "Noah Bennett", subtitle: "Key witness · Hotel night manager", description: "Reported seeing a man matching Vale's height and build leaving the service corridor shortly after the estimated time of death.", image: portrait("NB", "#b9a46a"), status: "Verified", priority: "High", confidence: 84, x: 150, y: 520, tags: ["witness", "verified", "hotel-staff"], metadata: { location: "Blackwood Hotel", contact: "+44 7700 900202", identifier: "WIT-NB-004", occupation: "Night Manager", files: "witness-statement.pdf", intelligenceNotes: "Witness independently identified the suspect's distinctive right-leg limp." } },
    { key: "organization", type: "Organization", title: "Helix Meridian Group", subtitle: "Financial services holding company", description: "Fictional corporate entity under investigation for offshore transfers and suspected bribery. Victim was investigating its executive accounts.", image: portrait("HM", "#d7aa28"), status: "Under Review", priority: "Critical", confidence: 78, x: 1050, y: 220, tags: ["organization", "offshore", "financial"], metadata: { location: "Canary Wharf, London", contact: "legal@example.test", identifier: "ORG-HMG-772", files: "corporate-registry.pdf\noffshore-ledger.csv", intelligenceNotes: "A shell company connected to Helix paid the suspect GBP 75,000 six days before the murder." } },
    { key: "location", type: "Location", title: "Blackwood Hotel · Room 714", subtitle: "Primary crime scene", description: "Seventh-floor hotel room where the victim was discovered. No forced entry. Service corridor camera was disabled for eleven minutes.", image: portrait("714", "#8f793f"), status: "Verified", priority: "Critical", confidence: 100, x: 400, y: 380, tags: ["crime-scene", "hotel", "verified"], metadata: { location: "17 Blackwood Street, London", identifier: "SCENE-BH-714", files: "scene-photographs.zip\nfloor-plan.pdf\nforensic-scan.json", intelligenceNotes: "Electronic lock records show an unauthorized maintenance credential at 22:37." } },
    { key: "weapon", type: "Evidence", title: "Recovered Combat Knife", subtitle: "Suspected murder weapon", description: "Knife recovered from a storm drain 430 metres from the hotel. Trace blood matches the fictional victim profile; partial print is consistent with the suspect.", image: portrait("E7", "#d7aa28"), status: "Verified", priority: "Critical", confidence: 96, x: 650, y: 520, tags: ["weapon", "dna", "fingerprint"], metadata: { identifier: "EVD-CE-007", location: "Storm drain, Mercer Lane", files: "knife-forensics.pdf\nprint-comparison.png", intelligenceNotes: "Blade geometry is consistent with the wound profile. Chain of custody verified." } },
    { key: "phone", type: "Device", title: "Burner Phone NX-44", subtitle: "Recovered mobile device", description: "Prepaid phone recovered from the suspect's vehicle. Contains encrypted messages coordinating a meeting and deletion instructions.", image: portrait("NX", "#c9a227"), status: "Verified", priority: "High", confidence: 91, x: 900, y: 520, tags: ["device", "messages", "location-data"], metadata: { identifier: "DEV-NX44-8821", contact: "+44 7700 900404", files: "device-extraction.zip\nmessage-export.pdf", intelligenceNotes: "Cell-site data places the device within 120 metres of the hotel between 22:31 and 23:04." } },
    { key: "vehicle", type: "Vehicle", title: "Black Audi A6", subtitle: "Suspect vehicle · Plate LX26 RAV", description: "Vehicle recorded entering the hotel underground garage at 22:29 and exiting at 23:08. Registered to a company controlled by the suspect.", image: portrait("A6", "#9f812d"), status: "Verified", priority: "High", confidence: 94, x: 1050, y: 420, tags: ["vehicle", "cctv", "suspect-property"], metadata: { identifier: "VEH-LX26-RAV", location: "Impound Facility 3", files: "vehicle-search.pdf\ngarage-cctv.mp4", intelligenceNotes: "Victim DNA simulation sample recovered from rear passenger floor mat." } }
  ];

  const nodes = new Map<string, { id: string }>();
  for (const fixture of nodeFixtures) {
    const { key, ...node } = fixture;
    const created = await prisma.caseNode.create({ data: { ...encodeNodeData(node), caseId: record.id } });
    nodes.set(key, created);
  }

  const edgeFixtures = [
    ["suspect", "victim", "Communicates With", "Encrypted contact occurred three days before death", 88],
    ["suspect", "location", "Located At", "Telecom and CCTV correlation", 92],
    ["victim", "location", "Located At", "Confirmed crime scene", 100],
    ["witness", "suspect", "Seen With", "Witness observed suspect leaving corridor", 84],
    ["weapon", "suspect", "Associated With", "Partial print and purchase history", 90],
    ["weapon", "location", "Related To", "Weapon type matches scene findings", 96],
    ["phone", "suspect", "Uses", "Device recovered from suspect vehicle", 97],
    ["phone", "location", "Located At", "Cell-site proximity during murder window", 91],
    ["vehicle", "suspect", "Owns", "Controlled through suspect company", 95],
    ["organization", "suspect", "Paid", "GBP 75,000 simulated transfer", 82],
    ["victim", "organization", "Associated With", "Subject of victim investigation", 89],
    ["vehicle", "location", "Located At", "Garage CCTV confirmation", 94]
  ] as const;
  for (const [source, target, relationType, shortDescription, confidence] of edgeFixtures) {
    await prisma.caseEdge.create({ data: { caseId: record.id, sourceNodeId: nodes.get(source)!.id, targetNodeId: nodes.get(target)!.id, relationType, shortDescription, confidence, color: "#facc15", direction: "one-way", lineStyle: confidence < 85 ? "dashed" : "solid" } });
  }

  const evidenceFixtures = [
    { title: "Crime Scene Forensic Package", fileType: "Archive", fileName: "CE-scene-package.zip", fileSize: 8_420_000, sha256: "f1c7a91e4a97d7d89678a96b305a9765c0f66c199db12dd474fe6a63d19cfa01", source: "Blackwood Hotel Room 714", collectedBy: "Forensic Unit Alpha", chainOfCustodyNotes: "Sealed at 03:14 and transferred to Evidence Vault A.", relatedNodeIds: [nodes.get("location")!.id, nodes.get("victim")!.id] },
    { title: "Combat Knife EVD-CE-007", fileType: "Physical Evidence", fileName: "knife-forensics.pdf", fileSize: 1_240_000, sha256: "ad31f91e721a231acb3d736f24c746d6752e21777c1557f074a6217c2dc91b82", source: "Mercer Lane storm drain", collectedBy: "Detective Training Unit", chainOfCustodyNotes: "Photographed in place, sealed in tamper-evident container.", relatedNodeIds: [nodes.get("weapon")!.id, nodes.get("suspect")!.id] },
    { title: "NX-44 Mobile Extraction", fileType: "Digital Evidence", fileName: "device-extraction.zip", fileSize: 4_815_000, sha256: "808c10ab12f63ef8f67aa953b06339dd6f2b0b4ca96c90f3790f073349427fd1", source: "Suspect vehicle", collectedBy: "Digital Forensics Unit", chainOfCustodyNotes: "Faraday isolated and imaged using read-only forensic workflow.", relatedNodeIds: [nodes.get("phone")!.id, nodes.get("suspect")!.id] },
    { title: "Hotel CCTV Timeline", fileType: "Video", fileName: "hotel-cctv-export.mp4", fileSize: 9_700_000, sha256: "4491b33db016559f6b08069d570a5bbdb06c77cfea0284631c586ffc935d2e47", source: "Blackwood Hotel Security", collectedBy: "Noah Bennett", chainOfCustodyNotes: "Export witnessed and hash verified at collection.", relatedNodeIds: [nodes.get("vehicle")!.id, nodes.get("location")!.id] }
  ];
  for (const evidence of evidenceFixtures) await prisma.evidence.create({ data: { ...encodeEvidenceData(evidence), caseId: record.id } });

  const timelineFixtures = [
    { occurredAt: new Date("2026-07-14T22:18:00Z"), title: "Victim last confirmed alive", eventType: "Observation", description: "Victim enters Room 714 and speaks with editor by phone.", relatedNodeIds: [nodes.get("victim")!.id, nodes.get("location")!.id], relatedEvidenceIds: [], severity: "High" },
    { occurredAt: new Date("2026-07-14T22:29:00Z"), title: "Suspect vehicle enters garage", eventType: "Travel", description: "Black Audi A6 captured by garage camera.", relatedNodeIds: [nodes.get("vehicle")!.id, nodes.get("suspect")!.id], relatedEvidenceIds: [], severity: "Critical" },
    { occurredAt: new Date("2026-07-14T22:37:00Z"), title: "Unauthorized lock credential used", eventType: "Access", description: "Maintenance credential opens Room 714.", relatedNodeIds: [nodes.get("location")!.id], relatedEvidenceIds: [], severity: "Critical" },
    { occurredAt: new Date("2026-07-14T22:46:00Z"), title: "Estimated time of death", eventType: "Homicide", description: "Forensic estimate based on simulated scene findings.", relatedNodeIds: [nodes.get("victim")!.id, nodes.get("weapon")!.id], relatedEvidenceIds: [], severity: "Critical" },
    { occurredAt: new Date("2026-07-14T23:08:00Z"), title: "Suspect vehicle exits garage", eventType: "Travel", description: "Vehicle departs toward Mercer Lane.", relatedNodeIds: [nodes.get("vehicle")!.id, nodes.get("suspect")!.id], relatedEvidenceIds: [], severity: "High" }
  ];
  for (const event of timelineFixtures) await prisma.timelineEvent.create({ data: { ...encodeTimelineData(event), caseId: record.id } });

  const notes = [
    { title: "Lead investigator assessment", body: "## Current assessment\n\nEvidence supports a planned homicide staged as a robbery. Marcus Vale remains the primary suspect. Financial records and telecom data provide independent corroboration.\n\n**Next action:** obtain a second interview and verify the Helix payment authorization chain.", tags: ["assessment", "priority"], pinned: true, linkedNodeIds: [nodes.get("suspect")!.id, nodes.get("organization")!.id] },
    { title: "Forensic correlation summary", body: "Knife geometry, trace evidence, lock activity and cell-site timing align with the estimated murder window. All findings are fictional training data.", tags: ["forensics", "training"], pinned: false, linkedNodeIds: [nodes.get("weapon")!.id, nodes.get("phone")!.id, nodes.get("location")!.id] },
    { title: "Witness reliability review", body: "Noah Bennett's statement is internally consistent and supported by corridor timing. Reliability assessed as high pending final video comparison.", tags: ["witness", "review"], pinned: false, linkedNodeIds: [nodes.get("witness")!.id] }
  ];
  for (const note of notes) await prisma.note.create({ data: { ...encodeNoteData(note), caseId: record.id } });
  await prisma.activityLog.create({ data: { caseId: record.id, action: "created", entity: "case", entityId: record.id, details: JSON.stringify({ title: record.title, fixture: "fictional homicide training case" }) } });
  console.log(JSON.stringify({ id: record.id, caseId: record.caseId, title: record.title, nodes: nodes.size, relations: edgeFixtures.length, evidence: evidenceFixtures.length, timeline: timelineFixtures.length, notes: notes.length }));
}

main().finally(() => prisma.$disconnect());
