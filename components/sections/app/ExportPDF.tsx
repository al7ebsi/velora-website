"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ExportPDF() {

  async function exportReport() {
    const element = document.body;

    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("TEMPORALIS-REPORT.pdf");
  }

  return (
    <div className="mt-20 text-center">
      <button
        onClick={exportReport}
        className="border border-white/20 px-6 py-3 rounded-md hover:bg-white/10"
      >
        Export Institutional Report (PDF)
      </button>
    </div>
  );
}