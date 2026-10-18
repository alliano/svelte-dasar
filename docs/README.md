# Catatan Belajar Svelte

- [Props di Svelte 5](component-props.md) — memisahkan component, `$props()`, spread props
- [Logic Block di Template Svelte](template-logic.md) — `{#if}`, `{:else if}`, `{#each}`, `{#await}`, `{#if}` di dalam `{#each}`
- [Satu Repo, Banyak Halaman Latihan](multi-page-vite.md) — entry HTML, `mount()`, config multi-page Vite, folder `public/`
- [Reactive State di Svelte 5](reactive-state.md) — `$state()`, deep reactivity, mengganti element array, `$state.raw`, `$inspect()`
- [Event Handler di Svelte 5](event-handling.md) — `onclick`, `preventDefault()`, `bind:value`, event props
- [Binding di Svelte 5](binding.md) — `bind:value`, `$bindable()`, `bind:checked`, `bind:this`

# Yang Perlu Dibenahi

Beberapa hal yang kelihatan saat membaca kode latihan ini:

- Folder `dist/` ikut ter-commit (`dist/assets/*`, `dist/hello.html`, dan lainya).
  Hasil build sebaiknya masuk `.gitignore`, bukan masuk repo.
- `package-lock.json` justru masuk `.gitignore`. Biasanya file lock ini yang
  di-commit supaya versi dependency-nya sama di semua mesin.
- Fungsi `add()` di `src/lib/TodoApp.svelte` tidak mengisi field `done`, padahal
  `src/lib/Todo.svelte` memakainya untuk `{#if done}`. Jadi todo baru selalu masuk
  ke cabang `{:else}`. Cukup tambahkan `done: false` saat push.
- Input tambah todo di `src/lib/TodoApp.svelte` sudah di-bind ke `name`, tapi `add()`
  masih membaca lewat `document.getElementById("todo")` dan mengosongkanya dengan
  `input.value = ""`. State `name` jadi tidak ikut kosong, sehingga teks lamanya bisa
  muncul kembali. Cukup `todos.push({ id: id++, name })` lalu `name = ""`, dan `id`
  pada input-nya tidak diperlukan lagi. Dibahas di [binding.md](binding.md).
- Handler `add()` dipasang di `onclick` button, bukan di `onsubmit` form, sehingga
  menekan Enter di dalam input tidak menambah todo.
- Di `edit()` pada `src/lib/TodoApp.svelte`, urutan spread-nya terbalik:
  `{edit: true, ...todos[i]}` membuat `...todos[i]` menimpa `edit` kembali ke nilai
  lamanya. Jadi sebuah todo hanya bisa masuk mode edit sekali; setelah disimpan
  (`edit: false`), tombol Edit-nya tidak bereaksi lagi. Yang benar
  `{...todos[i], edit: true}`, dibahas di [reactive-state.md](reactive-state.md).
- `onEdit()` menyusun ulang object-nya dari nol (`{id, name, edit: false}`), jadi
  field lain seperti `done` akan terhapus setelah todo-nya di-edit.
- Loop di `edit()` dan `onEdit()` tetap berjalan sampai akhir array padahal `id`-nya
  unik. `findIndex()` lebih ringkas dan berhenti saat ketemu.
- Field `edit` disimpan di dalam object todo, padahal dia status tampilan dan bukan
  data todo. Menyimpan `editingId` di satu state lebih bersih dan otomatis membuat
  hanya satu baris yang bisa terbuka sekaligus.
- `EditTodo.svelte` sudah memakai `bind:value={name}`, tapi `save()`-nya masih
  membaca nilainya lewat `document.getElementById(id)`. Jadi binding-nya belum
  terpakai; isi `save()` cukup `onedit(id, name)`, dan `id={id}` di input-nya pun
  tidak diperlukan lagi.
- Selama `id` todo masih dipakai sebagai id element HTML, id-nya akan bertabrakan
  kalau nanti ada dua daftar todo di satu halaman.
- `{#each todos as todo }` di `src/lib/TodoApp.svelte` kelebihan satu spasi sebelum
  kurung tutup, begitu juga `<button  onclick=...>` yang spasinya dobel. Indentasi
  `</li>` di dalam `{#each}` juga meleset satu level.
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
