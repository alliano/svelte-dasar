# Catatan Belajar Svelte

- [Props di Svelte 5](component-props.md) — memisahkan component, `$props()`, spread props
- [Logic Block di Template Svelte](template-logic.md) — `{#if}`, `{:else if}`, `{#each}`, `{#await}`, `{#if}` di dalam `{#each}`
- [Satu Repo, Banyak Halaman Latihan](multi-page-vite.md) — entry HTML, `mount()`, config multi-page Vite, folder `public/`
- [Reactive State di Svelte 5](reactive-state.md) — `$state()`, deep reactivity, mengganti element array, `$state.raw`, `$inspect()`
- [Event Handler di Svelte 5](event-handling.md) — `onclick`, `preventDefault()`, `bind:value`, event props
- [Binding di Svelte 5](binding.md) — `bind:value`, `$bindable()`, `bind:checked`, `bind:this`
- [Styling di Svelte 5](styling.md) — scoped style, `:global()`, `style:`, `class:`, class dinamis
- [Action di Svelte 5](actions.md) — `use:`, cleanup lewat `$effect`, action dengan parameter

# Yang Perlu Dibenahi

- `src/lib/Time.svelte` masih menyisakan `console.log(node)` di dalam action-nya.
