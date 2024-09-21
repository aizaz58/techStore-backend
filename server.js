import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"
import corsOption from "./config/corsOption.js"
import errorHandler from "./middlewares/errorHandler.js"
import mongoose from "mongoose"
 import authRoutes from "./routes/authRoutes.js";
 import productRoutes from "./routes/productRoutes.js";
 import cartRoutes from "./routes/cartRoutes.js";

import { connectDB } from "./lib/db.js";
import router from "./routes/root.js";

dotenv.config();


const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
connectDB();
//cross origin resource sharing
app.use(cors(corsOption))
// built-in middlewares for handling json and urlencoded  data in post and put requests from req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// third-party middleware for cookies
app.use(cookieParser())


// app.use("/",express.static(path.join(__dirname,"public")))
app.get("/", (req, res) => res.send("Exp"));
//app.use("/",router)
 app.use("/api/auth", authRoutes);
 app.use("/api/products", productRoutes);
 app.use("/api/cart", cartRoutes);

 app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})
  
    //custom middleware for error handling
    app.use(errorHandler)

   

let server
 mongoose.connection.once("open",()=>{
    console.log("datbaseConnected")
   server= app.listen(port,()=>{
        console.log(`app is running on port ${port}`)
    })

})

mongoose.connection.on("error",(err)=>{
console.log(err)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });