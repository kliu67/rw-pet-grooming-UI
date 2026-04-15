export async function handleDownloadPdf({
  t,
  confirmData,
  localDateString,
  localTimeString,
  priceModifier,
  localeNameString,
  email,
  phone,
}) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const marginX = 16;
  const maxWidth = 178;
  let y = 20;

  const addLine = (text, fontSize = 11, gap = 7) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(String(text || "-"), maxWidth);
    pdf.text(lines, marginX, y);
    y += lines.length * (fontSize * 0.38) + gap;
  };

  const ensurePage = (nextBlockHeight = 12) => {
    if (y + nextBlockHeight > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  pdf.setFont("helvetica", "bold");
  addLine(t("confirmStep.confirm"), 18, 4);
  pdf.setFont("helvetica", "normal");
  addLine(t("confirmStep.thankYou"), 11, 10);

  pdf.setFont("helvetica", "bold");
  ensurePage();
  addLine(`${t("confirmStep.confirmNumber")}: ${confirmData?.appointment_number || "N/A"}`, 12, 8);

  pdf.setFont("helvetica", "bold");
  ensurePage();
  addLine(t("confirmStep.details"), 14, 5);
  pdf.setFont("helvetica", "normal");
  addLine(confirmData?.service_name || "-");
  addLine(`${t("confirmStep.date")}: ${localDateString}`);
  addLine(`${t("confirmStep.time")}: ${localTimeString}`);
  addLine(
    `${t("confirmStep.duration")}: ${confirmData?.duration_snapshot || "-"} ${t(
      "confirmStep.minutes"
    )}`
  );
  addLine(`${t("confirmStep.pet")}: ${confirmData?.pet_name || "-"}`);
  addLine(`${confirmData?.breed_name || "-"} ${confirmData?.weight_class_label || ""}`.trim());

  pdf.setFont("helvetica", "bold");
  ensurePage();
  addLine(t("confirmStep.priceEstimate"), 14, 5);
  pdf.setFont("helvetica", "normal");
  addLine(`${t("confirmStep.basePrice")}: $${confirmData?.service_base_price || 0}`);
  addLine(`${t("confirmStep.weightCharge")}: $${priceModifier}`);
  addLine(`${t("confirmStep.totalAmount")}: $${confirmData?.price_snapshot || 0}`);

  pdf.setFont("helvetica", "bold");
  ensurePage();
  addLine(t("confirmStep.customerInfo"), 14, 5);
  pdf.setFont("helvetica", "normal");
  addLine(`${t("general.name")}: ${String(localeNameString || "-").trim() || "-"}`);
  if (email) addLine(`Email: ${email}`);
  if (phone) addLine(`Phone: ${phone}`);

  const confirmationNumber = String(confirmData?.appointment_number || "confirmation").replace(
    /[^a-zA-Z0-9-_]/g,
    "_"
  );
  pdf.save(`appointment-${confirmationNumber}.pdf`);
}
