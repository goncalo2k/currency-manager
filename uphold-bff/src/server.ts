// src/server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { UpholdConnectorService } from "./services/uphold-connector.service";
import { APIResponse, ResponseStatusMessage } from "./common-types";

const PORT = Number(process.env.PORT);
const API_BASE = process.env.UPHOLD_API_BASE_URL;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

const app = express();
const whitelist = new Set([
  'http://localhost:5173',
  'https://localhost:5173', 
  'http://127.0.0.1:5173',
  'https://127.0.0.1:5173',
]);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser tools (curl/Postman) with no origin
      if (!origin) return cb(null, true);
      if (whitelist.has(origin)) return cb(null, true);
      cb(new Error(`CORS rejected origin: ${origin}`));
    },
  })
);

app.use(express.json());

const upholdService = new UpholdConnectorService();
app.get(
  "/api/authorize-url/:state",
  async (req, res) => {
    const { state } = req.params;
    console.log(res.json);
    let authUrl = upholdService.getAuthorizeUrl(state);
    res.json({ message: ResponseStatusMessage.OK, result: authUrl });
  }
);

app.get("/api/auth-callback/:code", async (req, res) => {
  try {
    const { code } = req.params;
    console.log('code',);
    const response = await upholdService.completeLogin(code);
    res.json(response);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log("BFF listening on http://localhost:" + PORT);
});
