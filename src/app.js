import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import addressRoutes from "./routes/address.route.js";


// import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";  // 👈 add this
import ejsviewRoutes from "./routes/ejsviewRoutes.js";  // 👈 add this
import pdfRoutes from "./routes/pdfRoutes.js";  // 👈 add this
import path from "path";
import { fileURLToPath } from "url";
import emailRoutes from "./routes/emailRoutes.js";
import categoriesRoutes from "./routes/category.routes.js";
import subcategoriesRoutes from "./routes/subcategory.routes.js";
import productsRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
//////////////////////// ecommerece routes //////////////////////

app.use("/api/users", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/subcategories", subcategoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


//////////////////////// ecommerece routes end  //////////////////////
// Routes
// app.use("/api/users", userRoutes); 
app.use("/api/s3", uploadRoutes);

app.use("/api", ejsviewRoutes);
app.use("/api/pdf", pdfRoutes);
// app.get("/ejs-test", (req, res) => {
//   res.render("index", { message: "Hello from Express + EJS!" });
// });

// Routes
app.use("/api/email", emailRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(notFound);
app.use(errorHandler);
export default app;


