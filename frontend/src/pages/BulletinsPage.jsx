import { CloudRain, TrendingUp, Bell, User, Zap } from "lucide-react";

export default function BulletinsPage({ bulletins, cropsBg, t }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="page-hero">
        <img
          src={cropsBg}
          alt="Agricultural bulletins"
          className="w-full h-full object-cover"
        />
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              {t("bulletinsTitle")}
            </h2>
            <p className="text-teal-100 text-sm mb-1">
              {t("bulletinsSubtitle")}
            </p>
            <p className="text-white/80 text-xs italic">
              {t("bulletinsTagline")}
            </p>
          </div>
        </div>
      </div>
      <div className="app-section-header">
        <div>
          <h2 className="app-page-title">{t("latestUpdates")}</h2>
          <p className="app-page-subtitle">
            {t("latestUpdatesSubtitle")}
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {bulletins.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              {t("noBulletins")}
            </p>
          </div>
        ) : (
          bulletins.map((bul) => (
            <div
              key={bul.id}
              className={`glass-card rounded-2xl p-6 relative overflow-hidden ${bul.isLive ? 'border-2 border-teal-500/50' : ''}`}
            >
              {bul.isLive && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  <Zap className="w-3 h-3" />
                  <span>{t("live")}</span>
                </div>
              )}
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-xl ${bul.type === "weather" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : bul.type === "market" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"}`}
                >
                  {bul.type === "weather" ? (
                    <CloudRain className="w-6 h-6" />
                  ) : bul.type === "market" ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <Bell className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                      {bul.type === "weather"
                        ? t("weatherAlert")
                        : bul.type === "market"
                          ? t("marketUpdate")
                          : t("govAlert")}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {bul.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                    {bul.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                    {bul.content}
                  </p>
                  <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <User className="w-3.5 h-3.5 mr-1.5" />
                    <span>
                      {t("publishedBy")}: {bul.author}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
