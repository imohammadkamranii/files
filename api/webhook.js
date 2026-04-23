import { processMessage } from "../lib/bot.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const update = req.body;

  if (update.message) {
    processMessage(update.message).catch(console.error);
  }

  res.status(200).send("OK");
}
