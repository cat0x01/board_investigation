"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { FileDown } from "lucide-react";

type ReportNode = {
  id?: string;
  title: string;
  type: string;
  subtitle?: string;
  description?: string;
  image?: string;
  status?: string;
  priority?: string;
  confidence: number;
  source?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

type ReportNote = { title: string; body: string; tags?: string[]; pinned?: boolean };
type ReportEdge = { sourceNodeId: string; targetNodeId: string; relationType: string; shortDescription?: string; confidence?: number; direction?: string };

type ReportCase = {
  caseId: string;
  title: string;
  codename?: string;
  status?: string;
  priority?: string;
  assignedAnalyst?: string;
  description?: string;
  urls?: string;
  createdAt?: string;
  updatedAt?: string;
  nodes?: ReportNode[];
  edges?: ReportEdge[];
  notes?: ReportNote[];
};

async function loadLogo() {
  try {
    const response = await fetch("/logo.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function imageToPngDataUrl(source?: string) {
  if (!source) return null;
  return await new Promise<string | null>((resolve) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const maxSize = 900;
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) return resolve(null);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = source;
  });
}

function metadataList(value: unknown) {
  return typeof value === "string" ? value.split(/\n|,/).map((entry) => entry.trim()).filter(Boolean) : [];
}

export function GenerateReportButton({ caseId, compact = false }: { caseId: string; compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/cases/${caseId}`);
      if (!response.ok) throw new Error("Report data unavailable.");
      const item = await response.json() as ReportCase;
      const logo = await loadLogo();
      const nodeImageGalleries = await Promise.all((item.nodes ?? []).map(async (node) => {
        const sources = [...new Set([node.image ?? "", ...metadataList(node.metadata?.galleryImages)].filter(Boolean))];
        const images = await Promise.all(sources.map((source) => imageToPngDataUrl(source)));
        return images.filter((image): image is string => Boolean(image));
      }));
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      const margin = 17;
      const contentWidth = width - margin * 2;
      const red: [number, number, number] = [153, 27, 27];
      const brightRed: [number, number, number] = [220, 38, 38];
      const black: [number, number, number] = [8, 8, 10];
      const gray: [number, number, number] = [75, 85, 99];
      let y = 0;
      let activeSubject: { name: string; type: string; index: number; total: number; id?: string } | null = null;

      const clean = (value: unknown, fallback = "Not recorded") => {
        const text = String(value ?? "").trim();
        return text || fallback;
      };

      const drawPageFrame = (section = "INTELLIGENCE CASE FILE") => {
        doc.setFillColor(...black);
        doc.rect(0, 0, width, 21, "F");
        doc.setFillColor(...red);
        doc.rect(0, 21, width, 1.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("CAT0X01", margin, 9);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.text("CENTRAL INTELLIGENCE AGENCY", margin, 14);
        doc.setTextColor(248, 113, 113);
        doc.setFont("courier", "bold");
        doc.text(section, width - margin, 12, { align: "right" });
        y = 31;
      };

      const drawSubjectBar = () => {
        if (!activeSubject) return;
        doc.setFillColor(64, 8, 12);
        doc.rect(margin, y, contentWidth, 17, "F");
        doc.setFillColor(...brightRed);
        doc.rect(margin, y, 4, 17, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(activeSubject.name.toUpperCase(), margin + 9, y + 8);
        doc.setTextColor(254, 202, 202);
        doc.setFont("courier", "bold");
        doc.setFontSize(7);
        doc.text(`${activeSubject.type.toUpperCase()} // RECORD ${activeSubject.index} OF ${activeSubject.total}`, margin + 9, y + 13);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6.5);
        doc.text(activeSubject.id ? `ID ${activeSubject.id}` : "IDENTIFIER PENDING", width - margin - 5, y + 10.5, { align: "right" });
        y += 23;
      };

      const ensureSpace = (needed: number, section?: string) => {
        if (y + needed <= height - 20) return;
        doc.addPage();
        drawPageFrame(section);
        drawSubjectBar();
      };

      const sectionTitle = (title: string, code?: string) => {
        ensureSpace(16, title);
        doc.setFillColor(...red);
        doc.rect(margin, y, 3, 10, "F");
        doc.setFillColor(245, 245, 245);
        doc.rect(margin + 3, y, contentWidth - 3, 10, "F");
        doc.setTextColor(...black);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(title.toUpperCase(), margin + 8, y + 6.5);
        if (code) {
          doc.setTextColor(...red);
          doc.setFont("courier", "bold");
          doc.setFontSize(7);
          doc.text(code, width - margin - 4, y + 6.3, { align: "right" });
        }
        y += 15;
      };

      const paragraph = (text: unknown, options?: { color?: [number, number, number]; size?: number; indent?: number }) => {
        const indent = options?.indent ?? 0;
        doc.setTextColor(...(options?.color ?? [31, 41, 55]));
        doc.setFont("helvetica", "normal");
        doc.setFontSize(options?.size ?? 9);
        const rows = doc.splitTextToSize(clean(text), contentWidth - indent);
        const blockHeight = rows.length * 4.7 + 2;
        ensureSpace(blockHeight);
        doc.text(rows, margin + indent, y);
        y += blockHeight;
      };

      const infoRow = (label: string, value: unknown, x: number, rowY: number, boxWidth: number) => {
        doc.setFillColor(250, 250, 249);
        doc.setDrawColor(214, 211, 209);
        doc.roundedRect(x, rowY, boxWidth, 18, 1.5, 1.5, "FD");
        doc.setTextColor(...red);
        doc.setFont("courier", "bold");
        doc.setFontSize(6.5);
        doc.text(label.toUpperCase(), x + 4, rowY + 5.5);
        doc.setTextColor(...black);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        const clipped = doc.splitTextToSize(clean(value), boxWidth - 8).slice(0, 2);
        doc.text(clipped, x + 4, rowY + 11.5);
      };

      const detailBlock = (label: string, value: unknown) => {
        const printable = typeof value === "object" ? JSON.stringify(value, null, 2) : clean(value);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        const rows = doc.splitTextToSize(printable, contentWidth - 14);
        const blockHeight = Math.max(18, rows.length * 4.4 + 13);
        ensureSpace(blockHeight + 5, "SUBJECT DOSSIER // CONTINUED");
        doc.setFillColor(250, 250, 249);
        doc.setDrawColor(220, 220, 220);
        doc.roundedRect(margin, y, contentWidth, blockHeight, 1.5, 1.5, "FD");
        doc.setFillColor(...red);
        doc.rect(margin, y, 3, blockHeight, "F");
        doc.setTextColor(...red);
        doc.setFont("courier", "bold");
        doc.setFontSize(7);
        doc.text(label.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase(), margin + 8, y + 6);
        doc.setTextColor(31, 31, 31);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(rows, margin + 8, y + 12);
        y += blockHeight + 5;
      };

      // Cover page
      doc.setFillColor(...black);
      doc.rect(0, 0, width, height, "F");
      doc.setFillColor(...red);
      doc.rect(0, 0, 7, height, "F");
      doc.rect(16, 24, width - 32, 1.2, "F");
      if (logo) {
        try { doc.addImage(logo, "PNG", width / 2 - 18, 37, 36, 36); } catch { /* Keep report generation resilient. */ }
      }
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(23);
      doc.text("CAT0X01", width / 2, 88, { align: "center" });
      doc.setTextColor(248, 113, 113);
      doc.setFontSize(10);
      doc.setCharSpace(1.8);
      doc.text("CENTRAL INTELLIGENCE AGENCY", width / 2, 98, { align: "center" });
      doc.setCharSpace(0);
      doc.setDrawColor(...red);
      doc.setLineWidth(0.7);
      doc.line(42, 109, width - 42, 109);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text(clean(item.title).toUpperCase(), width / 2, 127, { align: "center", maxWidth: 150 });
      doc.setTextColor(156, 163, 175);
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.text(`CASE FILE: ${clean(item.caseId)}`, width / 2, 141, { align: "center" });
      doc.text(`CODENAME: ${clean(item.codename, "CASE FILE").toUpperCase()}`, width / 2, 148, { align: "center" });
      doc.setFillColor(...red);
      doc.roundedRect(width / 2 - 29, 168, 58, 13, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("CLASSIFIED", width / 2, 176.5, { align: "center" });
      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("AUTHORIZED PERSONNEL ONLY", width / 2, 189, { align: "center" });
      doc.setDrawColor(55, 65, 81);
      doc.line(30, 235, width - 30, 235);
      doc.setTextColor(209, 213, 219);
      doc.text(`PREPARED FOR: ${clean(item.assignedAnalyst).toUpperCase()}`, 30, 245);
      doc.text(`GENERATED: ${new Date().toLocaleString().toUpperCase()}`, 30, 252);
      doc.setTextColor(248, 113, 113);
      doc.text("UNAUTHORIZED DISCLOSURE IS PROHIBITED", 30, 266);

      // Case overview
      doc.addPage();
      drawPageFrame("CASE OVERVIEW");
      sectionTitle("Executive case overview", `FILE // ${item.caseId}`);
      const gap = 4;
      const boxWidth = (contentWidth - gap) / 2;
      infoRow("Case identifier", item.caseId, margin, y, boxWidth);
      infoRow("Operational status", item.status, margin + boxWidth + gap, y, boxWidth);
      y += 22;
      infoRow("Priority classification", item.priority, margin, y, boxWidth);
      infoRow("Lead investigator", item.assignedAnalyst, margin + boxWidth + gap, y, boxWidth);
      y += 27;
      sectionTitle("Intelligence summary");
      paragraph(item.description || "No executive summary has been recorded for this case.", { size: 10 });
      if (item.urls) {
        y += 3;
        sectionTitle("Reference sources");
        paragraph(item.urls, { color: gray, size: 8 });
      }
      y += 3;
      sectionTitle("Operational inventory");
      infoRow("Intelligence nodes", item.nodes?.length ?? 0, margin, y, boxWidth);
      infoRow("Analyst notes", item.notes?.length ?? 0, margin + boxWidth + gap, y, boxWidth);
      y += 24;

      // Complete node dossiers. Every subject starts on its own page so no
      // image, field, or long-form intelligence is omitted.
      if (!(item.nodes?.length)) {
        doc.addPage();
        drawPageFrame("SUBJECT DOSSIERS");
        sectionTitle("Intelligence node dossiers", "0 RECORDS");
        paragraph("No intelligence nodes have been recorded.", { color: gray });
      }
      (item.nodes ?? []).forEach((node, index) => {
        doc.addPage();
        drawPageFrame("SUBJECT DOSSIER");
        activeSubject = { name: clean(node.title), type: clean(node.type), index: index + 1, total: item.nodes?.length ?? 0, id: node.id };
        drawSubjectBar();

        const portrait = nodeImageGalleries[index]?.[0];
        if (portrait) {
          doc.setDrawColor(...red);
          doc.setLineWidth(0.8);
          doc.roundedRect(margin, y, 42, 42, 2, 2, "S");
          try { doc.addImage(portrait, "PNG", margin + 1, y + 1, 40, 40); } catch { /* Text data remains available. */ }
        } else {
          doc.setFillColor(20, 20, 22);
          doc.setDrawColor(...red);
          doc.roundedRect(margin, y, 42, 42, 2, 2, "FD");
          doc.setTextColor(248, 113, 113);
          doc.setFont("courier", "bold");
          doc.setFontSize(8);
          doc.text("IMAGE", margin + 21, y + 19, { align: "center" });
          doc.text("UNAVAILABLE", margin + 21, y + 25, { align: "center" });
        }
        const detailX = margin + 47;
        const detailWidth = contentWidth - 47;
        infoRow("Classification", node.type, detailX, y, detailWidth);
        infoRow("Role / subtitle", node.subtitle, detailX, y + 22, detailWidth);
        y += 47;

        const subjectBoxWidth = (contentWidth - gap) / 2;
        infoRow("Status", node.status, margin, y, subjectBoxWidth);
        infoRow("Priority", node.priority, margin + subjectBoxWidth + gap, y, subjectBoxWidth);
        y += 22;
        infoRow("Confidence assessment", `${node.confidence}%`, margin, y, subjectBoxWidth);
        infoRow("Tags", node.tags?.join(" / "), margin + subjectBoxWidth + gap, y, subjectBoxWidth);
        y += 27;
        infoRow("Record identifier", node.id, margin, y, subjectBoxWidth);
        infoRow("Last updated", node.updatedAt ? new Date(node.updatedAt).toLocaleString() : "Not recorded", margin + subjectBoxWidth + gap, y, subjectBoxWidth);
        y += 27;

        const gallery = nodeImageGalleries[index] ?? [];
        sectionTitle("Photographic evidence", `${gallery.length} IMAGES`);
        if (!gallery.length) {
          paragraph("No printable images are attached to this subject.", { color: gray });
        } else {
          const imageGap = 4;
          const imageWidth = (contentWidth - imageGap * 2) / 3;
          const imageHeight = imageWidth;
          gallery.forEach((image, imageIndex) => {
            const column = imageIndex % 3;
            if (column === 0) ensureSpace(imageHeight + 10, "SUBJECT DOSSIER // PHOTOGRAPHIC EVIDENCE");
            const x = margin + column * (imageWidth + imageGap);
            doc.setFillColor(15, 15, 16);
            doc.setDrawColor(...red);
            doc.roundedRect(x, y, imageWidth, imageHeight, 1.5, 1.5, "FD");
            try { doc.addImage(image, "PNG", x + 1, y + 1, imageWidth - 2, imageHeight - 2); } catch { /* Continue with remaining evidence. */ }
            doc.setFillColor(...red);
            doc.rect(x, y + imageHeight - 6, imageWidth, 6, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("courier", "bold");
            doc.setFontSize(6.5);
            doc.text(`IMAGE ${String(imageIndex + 1).padStart(2, "0")}`, x + 3, y + imageHeight - 2);
            if (column === 2 || imageIndex === gallery.length - 1) y += imageHeight + 7;
          });
        }

        sectionTitle("Full intelligence summary");
        paragraph(node.description || "No field notes recorded.", { size: 9.5 });

        sectionTitle("Source intelligence");
        paragraph(node.source || "No source recorded.", { color: gray, size: 8 });

        const relationships = (item.edges ?? []).filter((edge) => edge.sourceNodeId === node.id || edge.targetNodeId === node.id);
        sectionTitle("Known relationships", `${relationships.length} LINKS`);
        if (!relationships.length) paragraph("No linked intelligence relationships recorded.", { color: gray });
        relationships.forEach((edge) => {
          const outgoing = edge.sourceNodeId === node.id;
          const otherId = outgoing ? edge.targetNodeId : edge.sourceNodeId;
          const other = item.nodes?.find((candidate) => candidate.id === otherId);
          const direction = outgoing ? "TO" : "FROM";
          const relationship = `${edge.relationType} ${direction} ${clean(other?.title, otherId)}${edge.confidence !== undefined ? ` // ${edge.confidence}% CONFIDENCE` : ""}`;
          detailBlock(relationship, edge.shortDescription || "No relationship notes recorded.");
        });

        const metadata = Object.entries(node.metadata ?? {}).filter(([, value]) => value !== "" && value !== null && value !== undefined);
        const identityKeys = new Set(["alias", "dateOfBirth", "nationality", "occupation", "location", "contact", "identifier"]);
        const digitalKeys = new Set(["socialAccounts", "email", "phone", "website", "wallet", "ipAddress"]);
        const analysisKeys = new Set(["files", "galleryImages", "intelligenceNotes"]);
        const groups = [
          { title: "Identity & contact intelligence", entries: metadata.filter(([key]) => identityKeys.has(key)) },
          { title: "Digital & social intelligence", entries: metadata.filter(([key]) => digitalKeys.has(key)) },
          { title: "Files & analyst assessment", entries: metadata.filter(([key]) => analysisKeys.has(key)) },
          { title: "Additional intelligence", entries: metadata.filter(([key]) => !identityKeys.has(key) && !digitalKeys.has(key) && !analysisKeys.has(key)) }
        ].filter((group) => group.entries.length);
        sectionTitle("Complete subject metadata", `${metadata.length} FIELDS`);
        if (!metadata.length) paragraph("No additional metadata recorded.", { color: gray });
        groups.forEach((group) => {
          sectionTitle(group.title, `${group.entries.length} RECORDS`);
          group.entries.forEach(([key, value]) => detailBlock(key, value));
        });
      });

      // Notes
      activeSubject = null;
      doc.addPage();
      drawPageFrame("ANALYST NOTES");
      sectionTitle("Analyst notes", `${item.notes?.length ?? 0} ENTRIES`);
      if (!(item.notes?.length)) paragraph("No analyst notes have been recorded.", { color: gray });
      (item.notes ?? []).forEach((note, index) => {
        const rows = doc.splitTextToSize(clean(note.body), contentWidth - 10);
        ensureSpace(18 + rows.length * 4.4, "ANALYST NOTES");
        doc.setTextColor(...red);
        doc.setFont("courier", "bold");
        doc.setFontSize(7);
        doc.text(`NOTE ${String(index + 1).padStart(2, "0")}${note.pinned ? " // PRIORITY PINNED" : ""}`, margin, y);
        y += 6;
        doc.setTextColor(...black);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(clean(note.title), margin, y);
        y += 6;
        doc.setTextColor(31, 41, 55);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(rows, margin + 3, y);
        y += rows.length * 4.4 + 9;
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y - 4, width - margin, y - 4);
      });

      // Footer on every page
      const pages = doc.getNumberOfPages();
      for (let page = 1; page <= pages; page += 1) {
        doc.setPage(page);
        doc.setDrawColor(...brightRed);
        doc.setLineWidth(0.4);
        doc.line(margin, height - 14, width - margin, height - 14);
        doc.setTextColor(...red);
        doc.setFont("courier", "bold");
        doc.setFontSize(6.5);
        doc.text("CAT0X01 // CLASSIFIED", margin, height - 8.5);
        doc.setTextColor(...gray);
        doc.text(`CASE ${item.caseId}   |   PAGE ${page} OF ${pages}`, width - margin, height - 8.5, { align: "right" });
      }

      doc.save(`${item.caseId}-classified-intelligence-report.pdf`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button onClick={generate} disabled={loading} className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 text-sm text-slate-200 transition hover:border-red-400/60 hover:bg-red-500/10 ${compact ? "size-9" : "h-10 px-3"}`} title="Generate classified PDF report">
        <FileDown className="size-4 text-red-400" />{!compact && (loading ? "Building dossier..." : "Generate Report")}
      </button>
      {error && <div role="alert" className="absolute right-0 top-12 z-50 w-64 rounded-md border border-red-400/40 bg-black p-3 text-xs text-red-200 shadow-xl">{error}</div>}
    </div>
  );
}
