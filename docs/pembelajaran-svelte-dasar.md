# Pembelajaran Svelte Dasar

Catatan belajar Svelte 5 + Vite di repo `belajar-svelte-dasar`.
Terakhir diperbarui: 2026-10-12 · Branch: `feat/reactive-state`

---

## Ringkasan Perjalanan

| # | Commit | Yang dipelajari |
|---|--------|-----------------|
| 1 | `832e593` | Setup proyek, bikin file `.svelte`, render ke browser |
| 2 | `b8eb2be` | Reactive state manual (manipulasi DOM langsung) |
| 3 | `6acc6e6` | Reactive state pakai rune `$state()` |
| 4 | `be579c7` | Posisi file HTML harus cocok dengan input build Vite |
| 5 | `13c9c3c` | `$state` berbentuk object + halaman multi-input |

---

## 1. Cara Svelte Masuk ke Halaman

Setiap halaman butuh tiga bagian yang saling nyambung:

```
counter.html  ──script──▶  src/counter.js  ──mount──▶  src/lib/Counter.svelte
```

File entry JS-nya selalu pola yang sama:

```js
import { mount } from "svelte";
import Counter from "./lib/Counter.svelte";
import "./app.css";

const app = mount(Counter, {
  target: document.getElementById("app")
});

export default app;
```

**Poin penting:** di Svelte 5 komponen di-render pakai `mount()` dari paket
`svelte`, bukan lagi `new Component({ target })` seperti Svelte 4.
Target-nya `<div id="app">` yang ada di file HTML.

---

## 2. Reactive State: Manual vs Rune

Ini bagian paling berharga dari sesi ini, karena dicoba **dua cara** biar
kelihatan bedanya.

### Cara manual (yang capek)

```svelte
<script>
  let count = 0;

  function increment() {
    count++;
    document.getElementById("counter").innerText = `Counter : ${count}`;
  }
</script>

<h1 id="counter">Counter: 0</h1>
```

Masalahnya:
- Harus pegang `id` dan cari element-nya sendiri.
- Nilai awal ditulis dua kali (`let count = 0` dan teks `"Counter: 0"`) —
  gampang nggak sinkron.
- Tiap tempat yang nampilin `count` harus di-update manual satu-satu.

### Cara Svelte (pakai rune `$state`)

```svelte
<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<h1>Counter: {count}</h1>
```

`$state()` menandai variabel sebagai reaktif. Begitu nilainya berubah,
Svelte yang urus update DOM-nya. Fungsi `increment()` jadi cuma logika
murni — nggak tahu-menahu soal DOM.

> **Intinya:** `$state` itu bukan sekadar singkatan. Dia memindahkan
> tanggung jawab update tampilan dari kita ke framework.

---

## 3. `$state` Berisi Object

State nggak harus angka. Satu object bisa menampung beberapa field, dan
semua field-nya tetap reaktif:

```svelte
<script>
  let person = $state({
    first_name: "",
    last_name: ""
  });

  function sayHello() {
    person.first_name = document.getElementById("firstName").value;
    person.last_name  = document.getElementById("lastName").value;
  }
</script>

<input type="text" id="firstName" placeholder="first name" />
<input type="text" id="lastName"  placeholder="last name" />
<button onclick={sayHello}>Say Hello</button>

<p>my first name: {person.first_name}</p>
<p>my last name : {person.last_name}</p>
```

Mengubah `person.first_name` saja sudah cukup untuk memicu re-render —
object-nya nggak perlu diganti utuh.

### Catatan untuk langkah berikutnya

Kode di atas masih baca input lewat `document.getElementById()`. Cara yang
lebih Svelte adalah `bind:value`, yang bikin input dan state saling
sinkron otomatis tanpa tombol:

```svelte
<input type="text" bind:value={person.first_name} placeholder="first name" />
```

Dengan `bind:value`, fungsi `sayHello()` nggak diperlukan lagi — teks di
bawah langsung ikut berubah tiap ketikan.

---

## 4. Event Handler di Svelte 5

Svelte 5 pakai atribut biasa, bukan directive `on:`:

```svelte
<!-- Svelte 5 -->
<button onclick={increment}>increment</button>

<!-- Svelte 4 (gaya lama) -->
<button on:click={increment}>increment</button>
```

Bisa juga inline: `onclick={() => count++}`.

---

## 5. Multi-Page dengan Vite

Repo ini punya beberapa halaman latihan, masing-masing harus didaftarkan
di `vite.config.js`:

```js
export default defineConfig({
  plugins: [svelte()],
  build: {
    rolldownOptions: {
      input: {
        index:     "index.html",
        hello:     "hello.html",
        counter:   "counter.html",
        say_hello: "sayHello.html"
      }
    }
  }
})
```

**Pelajaran dari commit `be579c7`:** path di `input` itu relatif terhadap
root proyek. File `counter.html` sempat ada di `src/` padahal config-nya
nunjuk ke root, jadi halaman itu nggak bisa di-build. Setiap halaman baru
butuh dua langkah: bikin file HTML-nya **di root**, lalu tambahkan
entry-nya di `input`.

---

## 6. Styling Scoped

Tag `<style>` di dalam komponen hanya berlaku untuk komponen itu sendiri:

```svelte
<style>
  h1 { color: green; }
</style>
```

`h1` di komponen lain tidak terpengaruh. Svelte otomatis menambahkan class
unik saat compile.

---

## Yang Perlu Dibenahi

- `src/lib/HelloSvelte.svelte` sekarang **kosong**, tapi masih diimpor oleh
  `src/hello.js`. Jadi halaman `hello.html` nggak nampilin apa-apa.
- Ada dua file dengan nama mirip: `src/lib/Counter.svelte` (versi `$state`,
  yang dipakai) dan `src/lib/counter.svelte` (versi manual, sisa latihan).
  Di filesystem case-sensitive keduanya beda file, tapi ini rawan bikin
  bingung — sebaiknya yang lama dihapus atau diganti nama jadi jelas,
  misal `CounterManual.svelte`.
- Folder `dist/` ikut ter-commit. Biasanya hasil build masuk `.gitignore`.

## Rencana Belajar Selanjutnya

- [ ] `bind:value` untuk two-way binding (ganti `getElementById` di SayHello)
- [ ] `$derived` untuk nilai turunan, misal `full_name` dari first + last
- [ ] `$effect` untuk side effect saat state berubah
- [ ] Props: kirim data dari parent ke child pakai `$props()`
- [ ] Logic template: `{#if}`, `{#each}`, `{#await}`
