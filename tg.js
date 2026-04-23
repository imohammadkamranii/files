import { CONFIG } from "./config.js";

export async function tg(method, body = {}) {
  const res = await fetch(
    `https://api.telegram.org/bot${CONFIG.TG_TOKEN}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  return res.json();
}

export const tgSendText = (chatId, text) =>
  tg("sendMessage", { chat_id: chatId, text });

export async function tgGetFile(fileId) {
  const r = await tg("getFile", { file_id: fileId });
  if (!r.ok) throw new Error(r.description);
  return r.result;
}

export async function tgDownload(filePath) {
  const res = await fetch(
    `https://api.telegram.org/file/bot${CONFIG.TG_TOKEN}/${filePath}`
  );

  if (!res.ok) throw new Error("download failed");
  return Buffer.from(await res.arrayBuffer());
}
