# Catatan Belajar Svelte

- [Props di Svelte 5](component-props.md) — memisahkan component, `$props()`, spread props
- [Logic Block di Template Svelte](template-logic.md) — `{#if}`, `{:else if}`, `{#each}`, `{#await}`
- [Satu Repo, Banyak Halaman Latihan](multi-page-vite.md) — entry HTML, `mount()`, config multi-page Vite, folder `public/`
- [Reactive State di Svelte 5](reactive-state.md) — `$state()`, deep reactivity, `$state.raw`, `$inspect()`
- [Event Handler di Svelte 5](event-handling.md) — `onclick`, `preventDefault()`, `bind:value`

# Yang Perlu Dibenahi

Beberapa hal yang kelihatan saat membaca kode latihan ini:

- Folder `dist/` ikut ter-commit (`dist/assets/*`, `dist/hello.html`, dan lainya).
  Hasil build sebaiknya masuk `.gitignore`, bukan masuk repo.
- `package-lock.json` justru masuk `.gitignore`. Biasanya file lock ini yang
  di-commit supaya versi dependency-nya sama di semua mesin.
- Fungsi `add()` di `src/lib/TodoApp.svelte` tidak mengisi field `done`, padahal
  `src/lib/Todo.svelte` memakainya untuk `{#if done}`. Jadi todo baru selalu masuk
  ke cabang `{:else}`. Cukup tambahkan `done: false` saat push.
- `src/lib/TodoApp.svelte` membaca input dengan `document.getElementById("todo")`.
  Jalan, tapi mencampur DOM API dengan state Svelte, dan `id`-nya harus unik di satu
  halaman. Alternatifnya `bind:value`, dibahas di [event-handling.md](event-handling.md).
- Handler `add()` dipasang di `onclick` button, bukan di `onsubmit` form, sehingga
  menekan Enter di dalam input tidak menambah todo.
- `{#each todos as todo }` di `src/lib/TodoApp.svelte` kelebihan satu spasi sebelum
  kurung tutup, begitu juga `<button  onclick=...>` yang spasinya dobel.
- `{#each}`-nya belum memakai key. Untuk hapus pakai `filter()` memang masih aman,
  tapi menambahkan `(todo.id)` jadi `{#each todos as todo (todo.id)}` membuat Svelte
  memindahkan element yang ada daripada me-render ulang dari posisi yang berubah.
- `src/App.svelte` dan `src/lib/Counter.svelte` adalah sisa template `create-vite`,
  belum dipakai di latihan mana pun.
- Field `tittle` di `public/article.json` dan di `src/lib/Article.svelte` sama-sama
  salah tulis, jadi tampilanya memang jalan. Tapi kalau nanti JSON-nya dibetulkan
  jadi `title`, markup-nya ikut harus diubah.
- `getArticle()` di `src/lib/Article.svelte` belum memeriksa `response.ok`, sehingga
  cabang `{:catch}` praktis tidak pernah kelihatan kecuali koneksinya yang mati.
