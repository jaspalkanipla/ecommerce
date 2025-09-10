import path from "path";
import puppeteer from "puppeteer";
import ejs from "ejs";

/**
 * Generate PDF from EJS template
 * @param {Object|Array} data - data to render in template
 * @param {String} fileName - ejs template file (must exist inside views/)
 * @param {Object} options - extra pdf settings
 *    options = {
 *      format: "A4" | "Letter" | "A3", // default: A4
 *      downloadName: "report.pdf",     // default: output.pdf
 *      landscape: true|false,          // default: false
 *      margin: { top, right, bottom, left } // default: 0
 *    }
 * @returns {Buffer} PDF Buffer
 */
export const generatePDF = async (data = {}, fileName = "notfound.ejs", options = {}) => {
  try {
    const templatePath = path.join(process.cwd(), "src", "views", fileName);

    // Render EJS -> HTML
    const html = await ejs.renderFile(templatePath, { data });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Merge defaults + user options
    const pdfOptions = {
      format: options.format || "A4",
      printBackground: true,
      landscape: options.landscape || false,
      margin: options.margin || undefined,
    };

    const pdfBuffer = await page.pdf(pdfOptions);

    await browser.close();

    // Return buffer + metadata (downloadName helpful for controller)
    return { pdfBuffer, fileName: options.downloadName || "output.pdf" };

  } catch (err) {
    console.error("PDF Generation Error:", err);
    throw new Error(err.message || "Error generating PDF");
  }
};







// import path from "path";
// import puppeteer from "puppeteer";
// import  ejs  from 'ejs';

// export const generatePDF = async (data=[],fileName="notfound.ejs",open) => {
//     try {
        
//     const templatePath = path.join(process.cwd(), "src", "views", `${fileName}`);
//     const html = await ejs.renderFile(templatePath, { data });
//         // 1. Static HTML (later we will replace with EJS)
//         // 2. Launch puppeteer
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         // 3. Set HTML content
//         await page.setContent(html, { waitUntil: "networkidle0" });
//         // 4. Generate PDF
//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             printBackground: true,
//         });
//         await browser.close();
//         let a;

//         if (open=="open") {
//              a={
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "inline; filename=users.pdf",
//     }
//         } else {
//             a={
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "inline; filename=users.pdf",
//     }
//         }
       
//         return {pdfBuffer,}

//     } catch (err) {
//         console.error("PDF Generation Error:", err);
//         return err.message || err.msg || "Error generating PDF"
//     }
// };