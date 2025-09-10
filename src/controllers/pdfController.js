import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import { generatePDF } from "../utils/generatePDF.js";

export const generateInvoicePDF = async (req, res) => {
    try {
        // 1. Dynamic data (can come from DB or req.body)
        const data = {
            customer: "jaspal",
            date: new Date().toLocaleDateString(),
            items: [
                { name: "Laptop", qty: 1, price: 1200 },
                { name: "Mouse", qty: 2, price: 40 },
            ],
            total: 1240,
        };

        // 2. EJS render → HTML string
        const templatePath = path.join(process.cwd(), "src", "views", "invoice.ejs");
        const html = await ejs.renderFile(templatePath, data);

        const pdfBuffer = await generatePDF(html)

        // 6. Send PDF to browser (open inline)
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=invoice.pdf",
        });
        res.send(pdfBuffer);

    } catch (err) {
        console.error("PDF Generation Error:", err);
        res.status(500).send("Error generating PDF");
    }
};



export const generateSamplePDF = async (req, res) => {
    try {
        // 1. Static HTML (later we will replace with EJS)
        const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center;  }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            .total { text-align: right; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Jaspal</h1>
          <h1>Invoice</h1>
          <p>Customer: John Doe</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>

          <table>
            <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
            <tr><td>Laptop</td><td>1</td><td>$1200</td></tr>
            <tr><td>Mouse</td><td>2</td><td>$40</td></tr>
          </table>

          <p class="total">Total: $1240</p>
        </body>
      </html>
    `;

        // 2. Launch puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 3. Set HTML content
        await page.setContent(html, { waitUntil: "networkidle0" });

        // 4. Generate PDF
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        // 5. Send PDF to client
        res.set({
            "Content-Type": "application/pdf",
            //   "Content-Disposition": "attachment; filename=sample-invoice.pdf", // direct download
            "Content-Disposition": "inline; filename=sample-invoice.pdf", // 👈 inline
        });
        res.send(pdfBuffer);

    } catch (err) {
        console.error("PDF Generation Error:", err);
        res.status(500).send("Error generating PDF");
    }
};
