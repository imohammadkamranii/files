import { CONFIG, USER_MAPPING } from "./config.js";
import { tg, tgSendText, tgGetFile, tgDownload, baleSend } from "./core.js";
import { withRetry } from "./bot.js";

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

  const status = await tgSendText(sender, "⏳ در حال دریافت فایل...");

  try {
    const file = await tgGetFile(media.file_id);
    const buffer = await tgDownload(file.file_path);

    await tgSendText(sender, "📤 در حال ارسال به بله...");

    await baleSend(
      baleId,
      buffer,
      media.file_name || "file",
      1,
      1
    );

    await tgSendText(sender, "✅ فایل با موفقیت ارسال شد");
  } catch (e) {
    await tgSendText(sender, `❌ خطا:\n${e.message}`);
  }
}
