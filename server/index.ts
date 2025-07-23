import express from "express";
import { recipientRoutes } from "./modules/recipient/recipient.routes";

const app = express();

// middleware
app.use(express.json());
const port = 4000;

// routes
app.use("/", recipientRoutes);

// app.get("/", (_req, res) => res.send('Payment Splitter API'))


// listen to the server
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})
