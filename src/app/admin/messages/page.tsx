"use server";

import { prisma } from "@/lib/prisma";
import { MessageSquare, Mail, Clock, CheckCircle } from "lucide-react";
import MarkReadButton from "./MarkReadButton";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-anthracite-900 flex items-center gap-2">
          <MessageSquare size={22} /> Messages de contact
          {unread > 0 && (
            <span className="text-sm font-normal bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {unread} non lu{unread > 1 ? "s" : ""}
            </span>
          )}
        </h1>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun message pour l'instant.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl border p-5 transition-colors ${
                msg.isRead ? "border-gray-100" : "border-primary-200 bg-primary-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                    )}
                    <p className="font-semibold text-anthracite-800">{msg.name}</p>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <Mail size={13} />
                      {msg.email}
                    </a>
                  </div>

                  {msg.subject && (
                    <p className="text-sm font-medium text-anthracite-700 mb-2">
                      Sujet : {msg.subject}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {!msg.isRead && (
                    <MarkReadButton messageId={msg.id} />
                  )}
                  {msg.isRead && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <CheckCircle size={12} /> Lu
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  <Mail size={13} />
                  Répondre par email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
