import { prisma } from "@/lib/prisma";
import { MessageSquare, Mail, Clock, CheckCircle, Inbox } from "lucide-react";
import MessageActions from "./MessageActions";
import MarkAllReadButton from "./MarkAllReadButton";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminMessagesPage({ searchParams }: Props) {
  const { tab = "all" } = await searchParams;

  const where: any = {};
  if (tab === "unread") where.isRead = false;
  if (tab === "read")   where.isRead = true;

  const [messages, totalCount, unreadCount, readCount] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.count({ where: { isRead: true } }),
  ]);

  const TABS = [
    { key: "all",    label: "Tous",     count: totalCount  },
    { key: "unread", label: "Non lus",  count: unreadCount },
    { key: "read",   label: "Lus",      count: readCount   },
  ];

  return (
    <div className="p-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-anthracite-900 flex items-center gap-2">
          <MessageSquare size={22} /> Messages de contact
        </h1>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Inbox size={18} /></div>
          <div>
            <p className="text-xl font-bold text-anthracite-900">{totalCount}</p>
            <p className="text-xs text-gray-500">Total messages</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-50 text-red-500"><MessageSquare size={18} /></div>
          <div>
            <p className="text-xl font-bold text-anthracite-900">{unreadCount}</p>
            <p className="text-xs text-gray-500">Non lus</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-50 text-green-600"><CheckCircle size={18} /></div>
          <div>
            <p className="text-xl font-bold text-anthracite-900">{readCount}</p>
            <p className="text-xs text-gray-500">Lus</p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(({ key, label, count }) => (
          <Link
            key={key}
            href={`/admin/messages${key !== "all" ? `?tab=${key}` : ""}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key || (key === "all" && tab !== "unread" && tab !== "read")
                ? "bg-white text-anthracite-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              key === "unread" && count > 0
                ? "bg-red-100 text-red-600"
                : "bg-gray-200 text-gray-600"
            }`}>
              {count}
            </span>
          </Link>
        ))}
      </div>

      {/* Liste messages */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">Aucun message</p>
          <p className="text-sm mt-1">
            {tab === "unread" ? "Tous les messages ont été lus." : tab === "read" ? "Aucun message lu pour l'instant." : "Aucun message de contact reçu."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl border transition-colors ${
                msg.isRead ? "border-gray-100" : "border-primary-200 shadow-sm"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    msg.isRead ? "bg-gray-100 text-gray-500" : "bg-primary-100 text-primary-700"
                  }`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {!msg.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1" />
                        )}
                        <span className="font-semibold text-anthracite-800">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                        >
                          <Mail size={12} />
                          {msg.email}
                        </a>
                        {!msg.isRead && (
                          <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">Nouveau</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                        <Clock size={11} />
                        {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {msg.subject && (
                      <p className="text-sm font-medium text-anthracite-700 mb-2">
                        {msg.subject}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="inline-flex items-center gap-1.5 text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Mail size={13} />
                    Répondre par email
                  </a>
                  <MessageActions messageId={msg.id} isRead={msg.isRead} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
