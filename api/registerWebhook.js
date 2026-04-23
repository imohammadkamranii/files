import { CONFIG } from "../lib/config.js";

export default async function handler(req, res) {
  const url = `https://${req.headers.host}${CONFIG.WEBHOOK_PATH}`;

  const r = await fetch(
    `https://api.telegram.org/bot${CONFIG.TG_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }
  );

  const data = await r.json();
  res.json(data);
}
