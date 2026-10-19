# Catatan Belajar Svelte

- [Context](context.md) — `setContext()`, `getContext()`, kenapa harus object `$state`, `createContext()`
- [Lifecycle Hooks dan @html](lifecycle.md) — `onMount()`, `onDestroy()`, cleanup yang harus sinkron, `{@html}`
- [Special Element](special-element.md) — `svelte:body`, `svelte:window`, aturan top level, event object

# Yang Perlu Dibenahi

Beberapa hal yang kelihatan saat membaca kode latihan ini:

- `blogs` di `src/lib/Blog.svelte` bukan `$state`, jadi `blogs = await data.json()`
  di dalam `onMount` tidak memicu render ulang. Fetch-nya berhasil, tapi `{#each}`
  tetap memakai array awalnya, sehingga yang tampil selamanya satu blog kosong.
  Dibahas di [lifecycle.md](lifecycle.md).
- Nilai awal `blogs` berisi satu object kosong (`title: ""`, `content: ""`,
  `footer: ""`), jadi ada satu blog kosong yang sempat terender sebelum datanya
  datang. Array kosong lebih tepat sebagai nilai awal.
- `console.log(data)` di dalam `onMount` mencetak object `Response`-nya, bukan isi
  JSON-nya. Kalau yang ingin dilihat datanya, yang dicetak seharusnya `blogs`.
- `{@render content()}` di `src/lib/Layout.svelte` ditulis tanpa `?.`, jadi snippet
  `content` wajib ada. Begitu `<Layout/>` dipakai tanpa snippet itu, halamanya error
  saat dijalankan. Kalau lubangnya boleh kosong, pakai `{@render content?.()}`.
- Nama file di `vite.config.js` salah tulis: entry-nya menunjuk ke
  `comtext-counter.html`, padahal file-nya `context-counter.html`. Saat
  `npm run dev` halamanya masih bisa dibuka karena Vite melayani file HTML di root
  apa adanya, tapi `npm run build` akan gagal mencari file yang tidak ada itu.
- Key context `"counter"` ditulis sebagai string di dua file terpisah
  (`ContextCounterApp.svelte` dan `ContextCounter.svelte`). Kalau salah satu salah
  tulis, `getContext` akan mengembalikan `undefined` tanpa peringatan apa pun.
  `createContext()` menghilangkan risiko itu.
- `$inspect(counter)` di `src/lib/ContextCounter.svelte` dipasang di keempat
  instance-nya, jadi satu klik mencetak empat baris log yang sama.
- `src/lib/Mouse.svelte` memakai `<svelte:body>` untuk melacak mouse, padahal
  isinya cuma dua baris `h1`. Area kosong di bawah `<body>` tidak ikut terlacak,
  jadi koordinatnya berhenti berubah disana. `<svelte:window>` lebih tepat untuk
  kasus ini. Dibahas di [special-element.md](special-element.md).
- Komentar di `src/lib/ContextCounter.svelte` ada yang kurang kata: "hanya component
  tersebut dan child nya saja yang bisa data state tersebut" — kurang kata "membaca".
  Kata `reaktive` dan `reactive` juga dipakai bergantian di kalimat yang sama.
