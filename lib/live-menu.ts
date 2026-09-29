"use client";

/**
 * مصدر المنيو الموحّد.
 *
 * ══ المبدأ ══
 * لوحة التحكم هي المصدر الوحيد للحقيقة. الموقع يعرض ما فيها:
 * الأقسام والأصناف والأسعار والمكونات والصور وحالة التوفّر.
 * أي إضافة أو تعديل أو حذف يظهر هنا مباشرة بلا نشر.
 *
 * ══ لماذا تغيّر هذا ══
 * كان menu-data.ts مصدراً موازياً يُدمج مع بيانات البوت. الازدواجية
 * سبّبت: أقساماً جديدة لا تظهر، وأصنافاً محذوفة تبقى، و«القسم غير
 * موجود» عند التحديث لأن الثابت يُرسم أولاً.
 *
 * ══ الاحتياطي ══
 * 1) آخر نسخة ناجحة محفوظة في المتصفح — تظهر فوراً عند التحديث
 * 2) menu-data.ts — إن لم يسبق للزائر أن حمّل شيئاً والبوت غير متاح
 *
 * فلا تظهر صفحة فارغة في أي حال.
 */

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { getMenuByBranch, type MenuData, type MenuItem } from "./menu-data";
import { imgSrc } from "./img";

const DIRECT_URL = (process.env.NEXT_PUBLIC_BOT_URL || "").replace(/\/+$/, "");
const USE_PROXY = process.env.NEXT_PUBLIC_USE_BOT_PROXY === "1";
const BOT_URL = USE_PROXY ? "/bot-api" : DIRECT_URL;

/** بلا إعداد نطاق نستعمل مساراً نسبياً — قاعدة rewrites توجّهه للبوت */
const ENDPOINT = USE_PROXY
  ? "/bot-api/public/menu"
  : DIRECT_URL
  ? `${DIRECT_URL}/api/public/menu`
  : "/api/public/menu";

const REFRESH_MS = 20_000;
/** مهلة الطلب: خادم Render المجاني قد يكون نائماً — لا ننتظره للأبد */
const FETCH_TIMEOUT_MS = 12_000;
/** إعادة المحاولة السريعة ما دام الخادم لم يرد بعد */
const RETRY_MS = 5_000;
// const REFRESH_MS = 45_000;
/** v4: النسخ القديمة قد تحوي منيو الفرع الآخر (بسبب كاش Netlify) — تُهمل */
const CACHE_KEY = "o2-menu-cache-v4";
/**
 * أقصى عمر للنسخة المحفوظة قبل أن تُعتبر مجرد عرض مؤقت.
 * بعده نُبقي عرضها (أفضل من شاشة فارغة) لكن لا نعتبر الحالة
 * مستقرّة، فلا يُحكم بخلوّ قسم أو عدم وجوده قبل وصول الجديد.
 */
const CACHE_TRUST_MS = 2 * 60 * 1000;

export const LIVE_CONFIG = {
  useProxy: USE_PROXY,
  directUrl: DIRECT_URL,
  resolvedBase: BOT_URL,
  endpoint: ENDPOINT,
  configured: true, // يعمل دائماً: نطاق صريح أو وسيط أو مسار نسبي
};

type LiveItem = {
  id: number;
  branch: string;
  cat: string;
  name: string;
  active: boolean;
  price?: number;
  pricePerKg?: number;
  variants?: { name: string; price: number }[];
  desc?: string;
  image?: string;
};

type LiveCategory = {
  id: string;
  name: string;
  label?: string;
  emoji?: string;
  byWeight?: boolean;
  order?: number;
  /** عدد الأصناف المتوفرة في كل فرع — لمعرفة أين يوجد القسم */
  counts?: Record<string, number>;
  count?: number;
};

type Payload = { categories: LiveCategory[]; items: LiveItem[]; at: number; rev?: number };

/**
 * live   = وصلت من البوت الآن
 * cached = نسخة محفوظة حديثة (أقل من دقيقتين) — تُعتبر مستقرّة
 * stale  = نسخة محفوظة قديمة — تُعرض لكن ننتظر الجديد قبل الحكم
 * static = الملف الثابت — البوت غير متاح
 */
export type LiveStatus = "loading" | "live" | "cached" | "stale" | "static";

/* ── تخزين مؤقت في المتصفح ── */

function readCache(branch: string): Payload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${CACHE_KEY}:${branch}`);
    if (!raw) return null;
    const p = JSON.parse(raw) as Payload;
    if (!p || !Array.isArray(p.items) || !p.items.length) return null;
    return p;
  } catch {
    return null;
  }
}

function writeCache(branch: string, p: Payload) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${CACHE_KEY}:${branch}`, JSON.stringify(p));
  } catch {
    /* المساحة ممتلئة أو التخزين معطّل — غير حرج */
  }
}

/** يحوّل رد البوت إلى شكل المنيو الذي تعرضه الصفحات */
export function buildMenu(payload: Payload): MenuData {
  const cats = [...payload.categories].sort(
    (a, b) => (a.order || 999) - (b.order || 999),
  );

  const out: MenuData = {};
  for (const c of cats) {
    out[c.id] = {
      title: c.label || c.name || c.id,
      byWeight: Boolean(c.byWeight),
      items: [],
      counts: c.counts,
    } as MenuData[string];
  }

  for (const i of payload.items) {
    if (!out[i.cat]) {
      // صنف في قسم غير مُعلَن — ننشئه بدل إسقاط الصنف
      out[i.cat] = { title: i.cat, byWeight: false, items: [] } as MenuData[string];
    }
    out[i.cat].items.push({
      id: i.id,   // مفتاح ثابت للبطاقة (الاسم قد يتكرر)
      name: i.name,
      desc: i.desc || "",
      image: imgSrc(i.image),
      active: i.active,
      ...(i.pricePerKg ? { pricePerKg: i.pricePerKg } : {}),
      ...(i.variants && i.variants.length ? { variants: i.variants } : {}),
      ...(!i.pricePerKg &&
      !(i.variants && i.variants.length) &&
      i.price !== undefined
        ? { price: i.price }
        : {}),
    } as MenuItem);
  }
  return out;
}

/** يصلح مسارات صور المنيو الثابت لتمرّ بنفس منطق imgSrc */
function normalizeStatic(menu: MenuData): MenuData {
  const out: MenuData = {};
  for (const [k, c] of Object.entries(menu)) {
    out[k] = { ...c, items: c.items.map((i) => ({ ...i, image: imgSrc(i.image) })) };
  }
  return out;
}

/**
 * منيو الفرع من لوحة التحكم.
 *
 *   const { menu, status, lastUpdated, refresh } = useLiveMenu(branch);
 */
export function useLiveMenu(branch: string) {
  const cacheState = (p: Payload | null): LiveStatus =>
    !p ? "loading" : Date.now() - p.at < CACHE_TRUST_MS ? "cached" : "stale";

  const [payload, setPayload] = useState<Payload | null>(() => readCache(branch));
  const [status, setStatus] = useState<LiveStatus>(() => cacheState(readCache(branch)));
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const inFlight = useRef(false);
  const lastOk = useRef(0);

  const fetchLive = useCallback(
    async (outer?: AbortSignal) => {
      // طلب واحد في كل وقت — كانت نوافذ التركيز والمؤقت تكدّس طلبات
      // متوازية على خادم نائم فيزداد البطء
      if (inFlight.current) return;
      inFlight.current = true;
      const ctrl = new AbortController();
      const onOuter = () => ctrl.abort();
      outer?.addEventListener("abort", onOuter);
      let timedOut = false;
      const t = setTimeout(() => { timedOut = true; ctrl.abort(); }, FETCH_TIMEOUT_MS);
      const signal = ctrl.signal;
      try {
        // الفرع في المسار وليس فقط بعد '?': كاش Netlify قد يتجاهل الاستعلام
        // فيعطي غزة والأوسط نفس الرد — وهذا ما كان يجعل الإغلاق يظهر بالفرعين.
        // t= يكسر أي كاش متبقٍّ في المتصفح أو الوسيط.
        const b = encodeURIComponent(branch);
        const r = await fetch(
          `${ENDPOINT}/${b}?branch=${b}&t=${Date.now()}`,
          { signal, cache: "no-store" },
        );
        if (!r.ok) throw new Error(String(r.status));
        const d = await r.json();
        if (!d.ok || !Array.isArray(d.items)) throw new Error("رد غير متوقع");
        // رد لفرع آخر؟ لا نعرضه أبداً
        if (d.branch !== undefined && d.branch !== branch) throw new Error("رد لفرع آخر");

        const p: Payload = {
          categories: Array.isArray(d.categories) ? d.categories : [],
          // حماية إضافية: أصناف هذا الفرع فقط
          items: d.items.filter((i: LiveItem) => !i.branch || i.branch === branch),
          at: Date.now(),
          rev: d.rev,
        };
        setPayload(p);
        writeCache(branch, p);
        setLastUpdated(new Date());
        setStatus("live");
        lastOk.current = Date.now();
      } catch (e) {
        if ((e as Error).name === "AbortError" && !timedOut) return; // مغادرة الصفحة
        // نُبقي ما لدينا: نسخة محفوظة أو الملف الثابت
        // الفشل يُنهي الانتظار: نعرض ما لدينا ونسمح بالحكم
        setStatus((prev) => (prev === "live" ? "live" : readCache(branch) ? "cached" : "static"));
      } finally {
        clearTimeout(t);
        outer?.removeEventListener("abort", onOuter);
        inFlight.current = false;
      }
    },
    [branch],
  );

  useEffect(() => {
    const cached = readCache(branch);
    setPayload(cached);
    setStatus(cacheState(cached));

    const ctrl = new AbortController();
    lastOk.current = 0;
    fetchLive(ctrl.signal);

    // كل 5 ثوانٍ نقرر: لم يصل رد حيّ بعد ← نعيد المحاولة الآن،
    // وإلا نحدّث كل 20 ثانية كالمعتاد
    const timer = setInterval(() => {
      if (!lastOk.current || Date.now() - lastOk.current >= REFRESH_MS) fetchLive(ctrl.signal);
    }, RETRY_MS);
    const onFocus = () => {
      if (document.visibilityState === "visible") fetchLive(ctrl.signal);
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      ctrl.abort();
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [branch, fetchLive]);

  /**
   * لا نرسم الملف الثابت أثناء انتظار الرد الأول: كان يُرسم ثم يُستبدل
   * بالمنيو الحقيقي فتتكرر البطاقات وتتبدل الصور ثم «تنضم».
   * الثابت يظهر فقط إذا فشل الاتصال فعلاً ولا توجد نسخة محفوظة.
   */
  const menu = useMemo(() => {
    if (payload) return buildMenu(payload);
    if (status === "static") return normalizeStatic(getMenuByBranch(branch));
    return {} as MenuData;
  }, [payload, branch, status]);

  /**
   * true متى صار الحكم بعدم وجود قسم أو خلوّه آمناً.
   * النسخة القديمة (stale) لا تكفي — قد تكون قبل تعديلك مباشرة.
   */
  const settled = status === "live" || status === "cached" || status === "static";

  return { menu, status, settled, lastUpdated, refresh: () => fetchLive() };
}

/** عدد الأصناف المتوفرة في قسم */
export function countActive(menu: MenuData, catId: string): number {
  const c = menu[catId];
  if (!c) return 0;
  return c.items.filter((i) => i.active !== false).length;
}
