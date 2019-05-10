async function getLatestPdf() {
  return 'not implemented';
}

async function stampedPdfWithBuyerData(pdf, event) {
  console.log(pdf, event);
  return 'not implemented';
}

async function sendEmail(stampedPdf, event) {
  console.log(stampedPdf, event);
  return 'not implemented';
}

async function sendPdfToBuyer(event) {
  const pdf = await getLatestPdf();
  const stampedPdf = await stampedPdfWithBuyerData(pdf, event);
  await sendEmail(stampedPdf, event);
}

module.exports = {
  sendPdfToBuyer,
};
