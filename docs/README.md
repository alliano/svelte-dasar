# Catatan Belajar Svelte

- [Props di Svelte 5](component-props.md) — memisahkan component, `$props()`, spread props
- [Logic Block di Template Svelte](template-logic.md) — `{#if}`, `{:else if}`, `{#each}`, `{#await}`, `{#if}` di dalam `{#each}`
- [Satu Repo, Banyak Halaman Latihan](multi-page-vite.md) — entry HTML, `mount()`, config multi-page Vite, folder `public/`
- [Reactive State di Svelte 5](reactive-state.md) — `$state()`, deep reactivity, mengganti element array, `$state.raw`, `$inspect()`
- [Event Handler di Svelte 5](event-handling.md) — `onclick`, `preventDefault()`, `bind:value`, event props
- [Binding di Svelte 5](binding.md) — `bind:value`, `$bindable()`, `bind:checked`, `bind:this`
- [Styling di Svelte 5](styling.md) — scoped style, `:global()`, `style:`, `class:`, class dinamis
- [Action di Svelte 5](actions.md) — `use:`, cleanup lewat `$effect`, action dengan parameter
- [Transition di Svelte 5](transitions.md) — `transition:`, `in:`/`out:`, parameter, `|global`
- [Snippet dan @render](snippets.md) — `{#snippet}`, `{@render}`, snippet sebagai props, `children`

# Yang Perlu Dibenahi

- `src/lib/Time.svelte` masih menyisakan `console.log(node)` di dalam action-nya.
- Indentasi di `src/lib/TodoApp.svelte` meleset di beberapa tempat setelah markup-nya
  dipindah ke dalam snippet: `let editingId` kelebihan satu spasi, lalu `<li>` dan
  `{#if}` di dalam `{#snippet}` tidak sejajar dengan penutupnya.
- Komentar penjelasan yang tadinya ada di `src/lib/TodoApp.svelte` ikut terhapus saat
  markup-nya dirapikan jadi snippet, termasuk catatan kenapa handler-nya dipasang di
  `onsubmit` dan kenapa `{#each}`-nya diberi key. Penjelasanya sekarang hanya ada di
  dokumen, tidak lagi di kodenya.
- Kata `tampa` dan `tetep` di komentar snippet `src/lib/TodoApp.svelte` salah tulis,
  seharusnya `tanpa` dan `tetap`. Begitu juga `reder` yang seharusnya `render`.
