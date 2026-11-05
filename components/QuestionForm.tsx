"use client";

import { useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { WhatsApp } from "@/components/icons";
import { fill } from "@/lib/i18n";

/** « Une question ? » : nom, téléphone, message → récapitulatif pré-rempli sur WhatsApp, dans la langue du site. Rien n'est stocké. */
export function QuestionForm() {
  const { d } = useLocale();
  const q = d.question;
  const [v, setV] = useState({ name: "", phone: "", message: "" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = [q.waIntro, "", fill(q.waName, { v: v.name.trim() }), fill(q.waPhone, { v: v.phone.trim() }), fill(q.waMessage, { v: v.message.trim() })].join("\n");
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const field = "mt-2 block w-full rounded-[2px] border hairline bg-transparent px-4 py-3 text-paper placeholder:text-stone transition-colors focus:border-gold focus:outline-none";

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-[0.875rem] text-bone">
          {q.name}
          <input required name="name" autoComplete="given-name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} className={field} />
        </label>
        <label className="block text-[0.875rem] text-bone">
          {q.phone}
          <input required name="phone" type="tel" inputMode="tel" autoComplete="tel" value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} className={`${field} num`} />
        </label>
      </div>
      <label className="block text-[0.875rem] text-bone">
        {q.message}
        <textarea required name="message" rows={4} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} className={`${field} resize-y`} />
      </label>
      <button type="submit" className="btn btn-line justify-self-start">
        <WhatsApp size={18} /> {q.send}
      </button>
    </form>
  );
}

/** Bouton WhatsApp flottant rond, au-dessus de la barre de réservation mobile. */
export function WhatsAppFab() {
  const { d } = useLocale();
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(d.whatsapp.hello)}`}
      target="_blank"
      rel="noopener"
      aria-label={d.whatsapp.float}
      className="fixed right-4 bottom-[88px] z-40 grid size-14 place-items-center rounded-full border hairline bg-char text-paper shadow-[0_8px_24px_rgb(0_0_0/0.45)] transition-colors hover:border-gold hover:text-gold-hi md:right-6 md:bottom-6"
    >
      <WhatsApp size={24} />
    </a>
  );
}
