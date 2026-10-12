# Dokumentasi Pembelajaran

Catatan konsep dari latihan Svelte 5 + Vite di repo ini. Tiap konstruksi
ditulis ringkas: beberapa poin, link dokumentasi resmi, lalu contoh kode.

| Dokumen | Konstruksi |
|---------|-----------|
| [reactive-state.md](./reactive-state.md) | `$state()`, `$state()` dengan object, `$state.raw()`, `bind:value` |
| [render-komponen.md](./render-komponen.md) | `mount()`, rantai file `.html` → `.js` → `.svelte` |
| [sintaks-template.md](./sintaks-template.md) | Interpolasi `{...}`, event handler `onclick`, scoped style |
| [vite-multi-page.md](./vite-multi-page.md) | `build.rolldownOptions.input`, akses halaman di dev server |

Versi acuan: **Svelte 5.57**, **Vite 8.3** (lihat `package.json`). Svelte 5
mengubah banyak sintaks dari Svelte 4 — bagian yang berbeda ditandai di tiap
dokumen, supaya tutorial versi lama tidak bikin bingung.

---

## Yang Perlu Dibenahi

- **`src/lib/HelloSvelte.svelte` kosong**, tapi masih diimpor `src/hello.js`.
  Jadi `hello.html` ter-build tanpa menampilkan apa pun. Isinya terhapus di
  commit `b8eb2be`.
- **Dua file beda kapital:** `src/lib/Counter.svelte` (versi `$state`, yang
  dipakai) dan `src/lib/counter.svelte` (versi DOM manual, sisa latihan).
  Rawan salah impor — sebaiknya dihapus atau diganti nama jadi
  `CounterManual.svelte` kalau mau disimpan sebagai pembanding.
- **Folder `dist/` ikut ter-commit.** Hasil build biasanya masuk `.gitignore`;
  isinya akan terus bikin diff tiap kali `vite build` jalan.
