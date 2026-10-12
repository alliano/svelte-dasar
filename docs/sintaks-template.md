Repo: `belajar-svelte-dasar` · Branch: `feat/reactive-state` · Svelte 5.57 · 2026-10-12

---

# Interpolasi `{expression}`

- Kurung kurawal menyisipkan nilai JavaScript ke dalam markup
- Isinya ekspresi penuh, bukan cuma nama variabel — boleh operasi, pemanggilan fungsi, ternary
- Svelte mencatat variabel reaktif yang dibaca, lalu hanya memperbarui node teks itu saja
- Untuk atribut, taruh di posisi nilainya tanpa tanda kutip: `value={nama}`, bukan `value="{nama}"`
- https://svelte.dev/docs/svelte/basic-markup

```svelte
<h1>Counter: {count}</h1>
<p>{person.first_name.toUpperCase()}</p>
<p>{count > 0 ? "sudah dihitung" : "belum"}</p>

<input type="text" value={person.first_name} />
```

---

# Event Handler

- Di Svelte 5 event handler ditulis seperti atribut HTML biasa: `onclick`, `oninput`, `onsubmit`
- Yang diberikan adalah **referensi fungsinya** — `onclick={fn}`, bukan `onclick={fn()}`
- Kalau butuh argumen, bungkus arrow function supaya pemanggilannya tertunda
- Svelte 4 memakai `on:click={fn}`; modifier seperti `|preventDefault` sudah dihapus, tulis manual di handler
- https://svelte.dev/docs/svelte/basic-markup

```svelte
<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<button onclick={increment}>increment</button>
<button onclick={() => count += 5}>+5</button>

<form onsubmit={(e) => { e.preventDefault(); simpan(); }}>
```

```svelte
<!-- fungsi langsung jalan saat render, bukan saat diklik -->
<button onclick={increment()}>salah</button>
```

---

# Scoped Style

- Tag `<style>` di dalam komponen hanya berlaku untuk komponen itu sendiri
- Svelte menambahkan class unik saat compile, jadi `h1` di komponen lain tidak ikut terpengaruh
- Selector yang tidak dipakai akan dihapus, dan muncul warning `unused css selector` saat build
- Style untuk seluruh aplikasi taruh di file global seperti `src/app.css`, lalu diimpor di entry point
- https://svelte.dev/docs/svelte/scoped-styles

```svelte
<style>
  h1 {
    color: green;
  }
</style>

<h1>Counter: 0</h1>
```
