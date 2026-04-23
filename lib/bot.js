import { CONFIG, USER_MAPPING } from "./config.js";

// ================= Telegram =================

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

// ================= Bale =================

export async function baleSend(chatId, buffer, fileName) {
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("document", new Blob([buffer]), fileName);

  const res = await fetch(
    `https://tapi.bale.ai/bot${CONFIG.BALE_TOKEN}/sendDocument`,
    {
      method: "POST",
      body: form,
    }
  );

  const json = await res.json();
  if (!json.ok) throw new Error(json.description);
  return json;
}

// ================= Core Logic =================

export async function processMessage(msg) {
  const sender = String(msg.chat.id);
  const baleId = USER_MAPPING[sender];

  if (!baleId) {
    return tgSendText(sender, "❌ دسترسی ندارید");
  }

  const media =
    msg.document ||
    msg.video ||
    msg.audio ||
    msg.voice ||
    (msg.photo ? msg.photo.at(-1) : null);

  if (!media) {
    return tgSendText(sender, "فقط فایل ارسال کنید");
  }

  await tgSendText(sender, "⏳ در حال دریافت فایل...");

  try {
    const file = await tgGetFile(media.file_id);
    const buffer = await tgDownload(file.file_path);

    await tgSendText(sender, "📤 در حال ارسال به بله...");

    await baleSend(
      baleId,
      buffer,
      media.file_name || "file"
    );

    await tgSendText(sender, "✅ انجام شد");
  } catch (e) {
    await tgSendText(sender, "❌ خطا: " + e.message);
  }
}
