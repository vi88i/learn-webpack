let csvGenerate = null, pdfGenerate = null;

const handleCsvButtonClick = async () => {
    if (!csvGenerate) {
        const module = await import(/* webpackChunkName: "csvGenerate" */ "./csvGenerate");
        csvGenerate = module.default;
    }

    csvGenerate.downloadCsv();
};
const button1 = document.createElement("button");
button1.addEventListener("click", handleCsvButtonClick);
button1.innerText = "CSV";

const handlePdfButtonClick = async () => {
    if (!pdfGenerate) {
        const module = await import(/* webpackChunkName: "pdfGenerate" */ "./pdfGenerate");
        pdfGenerate = module.default;
    }

    pdfGenerate.downloadPdf();
};
const button2 = document.createElement("button");
button2.addEventListener("click", handlePdfButtonClick);
button2.innerText = "PDF";

[button1, button2].forEach((button) => document.body.appendChild(button));
