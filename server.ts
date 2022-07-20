import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import { metaData } from "./source/environment/meta-data";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./source/environment/swagger-spec";
import mediaRoutes from "./source/api/routes/media-routes";

const app = express();
const port = metaData.base.apiPort;
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

// swagger UI
app.use("/api/media/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//routes
app.use("/api/media", mediaRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Connected")
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
