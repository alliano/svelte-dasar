# Sintaks Template

Repo: `belajar-svelte-dasar` · Branch: `feat/reactive-state` · 2026-10-12
Svelte 5.57

---

**Markup di file `.svelte` adalah HTML biasa plus beberapa sintaks tambahan**
yang dibaca compiler. Tidak ada `return`, tidak ada JSX — yang ditulis di luar
`<script>` sudah merupakan tampilannya.

Tiga tambahan yang dipakai di repo ini: interpolasi `{...}`, event handler
sebagai atribut, dan `<style>` yang otomatis ter-scope.

---

## Interpolasi `{expression}`

**Kurung kurawal adalah** cara menyisipkan nilai JavaScript ke dalam markup.

```svelte
<h1>Counter: {count}</h1>
<p>my first name: {person.first_name}</p>
```

### Cara kerjanya

Isi kurung kurawal adalah **ekspresi** JavaScript, bukan hanya nama variabel.
Jadi ini semua valid:

```svelte
<p>{count * 2}</p>
<p>{person.first_name.toUpperCase()}</p>
<p>{count > 0 ? "sudah dihitung" : "belum"}</p>
```

Saat compile, Svelte mencatat variabel reaktif apa saja yang dibaca ekspresi
itu. Begitu salah satunya berubah, hanya node teks inilah yang diperbarui —
bukan seluruh komponen di-render ulang. Inilah untungnya dibanding
`innerText` manual: hubungan antara data dan tempat tampilnya sudah tercatat
compiler, tidak perlu kita yang mengingat.

Nilainya otomatis di-escape, jadi teks yang mengandung `<script>` akan tampil
sebagai teks, bukan dieksekusi.

### Kapan dibutuhkan

Setiap kali tampilan perlu menampilkan data. Untuk atribut, kurung kurawal
dipakai di posisi nilainya:

```svelte
<input type="text" value={person.first_name} />
<img src={imageUrl} alt="foto" />
```

Hati-hati: jangan ditulis di dalam tanda kutip (`value="{...}"`) — itu
membuat hasilnya selalu jadi string.

---

## Event handler sebagai atribut

**Di Svelte 5, event handler ditulis seperti atribut HTML biasa** — `onclick`,
`oninput`, `onsubmit` — dengan nilainya sebuah fungsi.

```svelte
<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<button type="button" onclick={increment}>increment</button>
```

### Cara kerjanya

Yang diberikan ke `onclick` adalah **referensi fungsinya**, bukan hasil
pemanggilannya. Perbedaan ini sering jadi bug:

```svelte
<button onclick={increment}>benar — fungsinya diserahkan ke Svelte</button>
<button onclick={increment()}>salah — fungsi langsung jalan saat render</button>
```

Kalau butuh argumen, bungkus dengan arrow function supaya pemanggilannya
tertunda sampai event-nya terjadi:

```svelte
<button onclick={() => count += 5}>+5</button>
<button onclick={() => hapus(item.id)}>hapus</button>
```

Karena bentuknya atribut biasa, handler-nya juga bisa diisi dari variabel atau
dikirim lewat props — tidak ada sintaks khusus yang membatasinya.

### Beda dengan Svelte 4

Svelte 4 memakai directive dengan titik dua:

```svelte
<!-- Svelte 5 -->
<button onclick={increment}>increment</button>

<!-- Svelte 4 — gaya lama -->
<button on:click={increment}>increment</button>
```

Kalau menemukan tutorial dengan `on:click`, itu materi versi lama. Konsekuensi
lain dari perubahan ini: event modifier bawaan seperti `on:click|once` dan
`on:submit|preventDefault` sudah tidak ada di Svelte 5 — tulis manual di dalam
handler-nya:

```svelte
<form onsubmit={(e) => { e.preventDefault(); simpan(); }}>
```

---

## `<style>` yang ter-scope

**Tag `<style>` di dalam komponen hanya berlaku untuk komponen itu sendiri.**

```svelte
<style>
  h1 {
    color: green;
  }
</style>

<h1>Counter: 0</h1>
```

### Cara kerjanya

Saat compile, Svelte menambahkan sebuah class unik (misal `s-xYz123`) ke
element-element komponen ini, lalu menulis ulang selector-nya menjadi
`h1.s-xYz123`. Jadi `h1` di komponen lain tidak ikut hijau, walaupun
selector-nya ditulis seluas itu.

Efek sampingnya: **selector yang tidak dipakai akan dihapus** dan muncul
warning `unused css selector` saat build. Kalau style-nya menyasar element
yang dibuat komponen lain, selector itu akan hilang — untuk kasus itu ada
`:global(...)`.

### Kapan dibutuhkan

Pakai `<style>` lokal untuk tampilan yang memang milik komponen itu. Style
yang berlaku untuk seluruh aplikasi — reset, font, variabel warna — taruh di
file CSS global seperti `src/app.css`, yang diimpor di entry point:

```js
import "./app.css";
```
