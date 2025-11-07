# 🌍 Platform Pariwisata Aceh

Proyek ini adalah aplikasi web berbasis **Next.js** untuk menampilkan destinasi wisata di Banda Aceh.  
Data destinasi disimpan dan dikelola menggunakan **Supabase**, sedangkan peta interaktif menggunakan **Google Maps API**.

---

## 🚀 Teknologi yang Digunakan

- [Next.js 15](https://nextjs.org/) — Framework React modern dengan dukungan App Router dan SSR.
- [TypeScript](https://www.typescriptlang.org/) — Memberikan type safety dalam pengembangan.
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework untuk styling cepat.
- [Shadcn UI](https://ui.shadcn.com/) — UI Component Untuk mempercepat pembuatan components.
- [Supabase](https://supabase.com/) — Backend as a Service untuk database dan autentikasi.
- [Google Maps API](https://developers.google.com/maps) — Untuk menampilkan lokasi wisata di peta interaktif.

---

## 🧩 Persiapan Sebelum Menjalankan Project

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Dzakkiyansyah/platform-pariwisata-aceh
cd nama-project
```

### Install Dependencies

```
npm install
```

### Setup Environment Variables

```
file .env.local

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=ISI_API_KEY_DI_SINI
NEXT_PUBLIC_SUPABASE_URL=ISI_SUPABASE_URL_DI_SINI
NEXT_PUBLIC_SUPABASE_ANON_KEY=ISI_SUPABASE_ANON_KEY_DI_SINI
SUPABASE_SERVICE_ROLE_KEY=ISI_SERVICE_ROLE_KEY
```

### Cara Menjalankan Project

```
npm run dev
```
