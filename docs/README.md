# Catatan Belajar Svelte

- [Props di Svelte 5](component-props.md) — memisahkan component, `$props()`, spread props
- [Logic Block di Template Svelte](template-logic.md) — `{#if}`, `{:else if}`, `{#each}`, `{#await}`
- [Satu Repo, Banyak Halaman Latihan](multi-page-vite.md) — entry HTML, `mount()`, config multi-page Vite, folder `public/`

# Yang Perlu Dibenahi

Beberapa hal yang kelihatan saat membaca kode latihan ini:

- Folder `dist/` ikut ter-commit (`dist/assets/*`, `dist/hello.html`, dan lainya).
  Hasil build sebaiknya masuk `.gitignore`, bukan masuk repo.
- `package-lock.json` justru masuk `.gitignore`. Biasanya file lock ini yang
  di-commit supaya versi dependency-nya sama di semua mesin.
- Di `src/lib/TodoApp.svelte` masih ada `<ul>` berisi dua `<Todo>` yang di-hardcode
  di atas versi `{#each}`-nya. Sengaja disimpan sebagai pembanding, tapi kalau hanya
  mau melihat hasil `{#each}` bagian itu bisa dihapus.
- `src/App.svelte` dan `src/lib/Counter.svelte` adalah sisa template `create-vite`,
  belum dipakai di latihan mana pun.
- Field `tittle` di `public/article.json` dan di `src/lib/Article.svelte` sama-sama
  salah tulis, jadi tampilanya memang jalan. Tapi kalau nanti JSON-nya dibetulkan
  jadi `title`, markup-nya ikut harus diubah.
- `getArticle()` di `src/lib/Article.svelte` belum memeriksa `response.ok`, sehingga
  cabang `{:catch}` praktis tidak pernah kelihatan kecuali koneksinya yang mati.
