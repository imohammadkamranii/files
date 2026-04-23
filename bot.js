import { CONFIG } from "./config.js";

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
