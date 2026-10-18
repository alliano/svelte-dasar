# Catatan Belajar Svelte

- [Reactive Class di Svelte 5](reactive-class.md) — `$state` dan `$derived` sebagai field class, binding ke field
- [Store dan Global State](store.md) — `writable()`, akses dengan `$`, `readable()`, subscribe manual, pengganti Rune-nya

# Yang Perlu Dibenahi

Beberapa hal yang kelihatan saat membaca kode latihan ini:

- `box.html` dan `counter.html` belum didaftarkan di `vite.config.js`. Saat
  `npm run dev` halamanya tetap bisa dibuka, karena Vite melayani file HTML apa pun
  di root. Tapi saat `npm run build` keduanya tidak ikut ter-build, karena
  `build.rolldownOptions.input` baru berisi `index` dan `hello`.
- Nama `counter.html` dan `src/store-counter.js` tidak sejalan, padahal pasangan
  lainya seragam (`box.html` dengan `src/box.js`). Lebih enak dicari kalau
  halamanya dinamai `store-counter.html`.
- `src/state/counter.js` menyelipkan `counter.subscribe(count => console.log(count))`
  di dalam state yang dipakai bersama. Selain itu log debug, subscribe ini tidak
  pernah dilepas, jadi callback-nya jalan terus selama halamanya hidup.
- Kalau nanti state-nya dipindah ke Rune, file-nya harus dinamai
  `src/state/counter.svelte.js`. Rune hanya diproses di file dengan infix
  `.svelte.`, jadi di `counter.js` biasa `$state` tidak akan jalan.
- Komentar di `src/lib/StoreCounter.svelte` ada beberapa salah tulis (`Sebleum`,
  `memnuat`, `nisa`, `sedagkan`, `mengguakan`, `menrupakan`), dan nama function-nya
  `writable` bukan `writeable`. Kalimat tentang Rune sebagai pengganti store juga
  berhenti di tengah, belum selesai.
- `style:background-color="blue"` di `src/lib/Box.svelte` nilainya tetap, jadi lebih
  pas ditaruh di block `<style>` ketimbang jadi style directive.
