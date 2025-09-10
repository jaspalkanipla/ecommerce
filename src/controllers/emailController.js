import { sendEmail } from "../utils/email.js";
import path from 'path';
import  ejs  from 'ejs';

export const sendTestEmail = async (req, res) => {
  try {
    // const filePath = path.resolve("public/abc.png");
    const data = {
      name: "Yashpal",
      orderId: "ORD12345",
      actionUrl: "https://yourapp.com/orders/ORD12345"
    };

    // Resolve path of ejs template
    const templatePath = path.resolve("src/views/emailTemplate.ejs");

    // Render HTML with EJS
    const html = await ejs.renderFile(templatePath, data);

    await sendEmail({
      to: ["yashpalkanipla13@gmail.com", "rajnikanipla13@gmail.com"], // multiple recipients
      cc: "dcsa2123jaspal@kuk.ac.in",
      bcc: ["jaspalkaniplewale@gmail.com"],
      // to: "yashpalkanipla13@gmail.com", // you can take from req.body.to
      subject: "This is a test email 🚀",
      // html: "<h1>Hello!</h1><p>This is a test email 🚀</p>",
      html,
      attachments: [
        {
          // filename: "abc.png",   // the name user will see
          // path: filePath,           // absolute path
          filename: "users.pdf",   // the name user will see
          path: "https://jaspal-s3-bucketfortesting.s3.ap-south-1.amazonaws.com/reports/users.pdf",          // absolute path
        },
      ],
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const sendEmailWithImage = async (req, res) => {
  try {
    const data = {
      name: "Yashpal",
      orderId: "ORD98765"
    };

    const templatePath = path.resolve("src/views/emailWithImage.ejs");
    const html = await ejs.renderFile(templatePath, data);

    await sendEmail({
      to: "yashpalkanipla13@gmail.com",
      subject: "Order Confirmation with Logo 🛒",
      html,
      attachments: [
        {
          filename: "logo.png",
          path: "public/images/logo.png", // make sure this file exists
          cid: "logo123"
        }
      ]
    });

    res.json({ success: true, message: "Email with inline image sent ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};