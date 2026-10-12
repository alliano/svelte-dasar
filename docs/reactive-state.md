# Reactive State

Repo: `belajar-svelte-dasar` · Branch: `feat/reactive-state` · 2026-10-12
Svelte 5.57

---

**Reactive state adalah** data yang, kalau nilainya berubah, membuat tampilan
ikut berubah dengan sendirinya — tanpa kita menyentuh DOM.

Masalah yang diselesaikannya kelihatan jelas kalau kita kerjakan manual.
Tanpa reactive state, setiap kali data berubah kita harus ingat sendiri
bagian tampilan mana saja yang perlu di-update:

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

Tiga hal yang bikin cara ini rapuh:

1. Nilai awal `0` ditulis dua kali — di `let count` dan di teks `<h1>`. Kalau
   salah satu diubah, keduanya jadi tidak sinkron.
2. Fungsi `increment()` jadi tahu soal DOM. Dia butuh `id` yang tepat, dan
   akan diam-diam gagal kalau `id`-nya salah ketik.
3. Kalau nanti `count` ditampilkan di tiga tempat, kita harus meng-update
   ketiganya satu per satu.

Reactive state membalik tanggung jawab ini: kita cukup mengubah datanya,
framework yang mengurus tampilannya.

---

## $state()

**`$state()` adalah** rune Svelte 5 untuk menandai sebuah variabel sebagai
reaktif. "Rune" artinya dia bukan fungsi biasa yang diimpor, melainkan tanda
yang dibaca compiler Svelte — karena itu tidak ada `import` untuk `$state`.

```svelte
<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<h1>Counter: {count}</h1>

<button type="button" onclick={increment}>increment</button>
```

### Cara kerjanya

Saat compile, Svelte melihat `let count = $state(0)` dan mencatat bahwa
`count` reaktif. Setiap tempat yang membaca `count` — di sini `{count}` di
dalam `<h1>` — didaftarkan sebagai *dependency*. Compiler lalu membungkus
setiap penulisan ke `count` (termasuk `count++`) dengan kode yang menandai
nilainya kotor, sehingga bagian DOM yang bergantung padanya dijadwalkan untuk
diperbarui.

Jadi `count++` di dalam `increment()` tidak benar-benar "cuma menambah
angka" — hasil compile-nya juga memberi tahu Svelte bahwa tampilan perlu
disegarkan. Yang penting: ini terjadi karena **variabelnya** reaktif, bukan
karena kita memanggil sesuatu secara khusus.

Bandingkan dengan versi manual di atas: `increment()` sekarang tidak
menyinggung DOM sama sekali, dan nilai awal `0` hanya ditulis sekali.

### Kapan dibutuhkan

Pakai `$state()` kalau nilainya **berubah selama komponen hidup** dan
perubahan itu harus terlihat di tampilan.

Tidak perlu `$state()` untuk:

- Konstanta atau nilai yang tidak pernah berubah — `const TITLE = "Counter"`
  cukup ditulis biasa.
- Variabel sementara di dalam sebuah fungsi, yang tidak pernah dibaca
  template.
- Nilai yang bisa **dihitung** dari state lain. Untuk itu ada `$derived` —
  jangan simpan hasil hitungan sebagai `$state` kedua, karena harus
  disinkronkan manual dan gampang basi.

---

## $state() dengan object

`$state()` tidak terbatas ke angka. Satu object bisa menampung beberapa field
sekaligus, dan field-field itu tetap reaktif:

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

<input type="text" id="firstName" placeholder="first name" /> <br />
<input type="text" id="lastName"  placeholder="last name" /> <br />
<button onclick={sayHello}>Say Hello</button>

<p>my first name: {person.first_name}</p>
<p>my last name : {person.last_name}</p>
```

### Cara kerjanya

Untuk object, Svelte membungkus nilainya dengan `Proxy`. Proxy inilah yang
mencatat field mana yang dibaca template, dan mendeteksi saat salah satu
field ditulis.

Konsekuensi pentingnya: **cukup mengubah satu field** untuk memicu update.

```js
person.first_name = "Ali";   // cukup ini — tampilan ikut berubah
```

Kita **tidak perlu** mengganti object-nya utuh seperti kebiasaan di
React/Redux:

```js
person = { ...person, first_name: "Ali" };   // tidak perlu di Svelte 5
```

Karena yang reaktif adalah object-nya (bukan binding variabelnya), object
`$state` bahkan boleh dideklarasikan dengan `const` — yang dilarang hanya
menugaskan ulang variabelnya, sedangkan mutasi field tetap jalan:

```svelte
<script>
  const person = $state({ last_name: "" });

  person.last_name = "Hakim";   // boleh, dan memicu update
  // person = { ... };          // error: assignment to constant
</script>
```

Proxy ini juga *deep*: object atau array di dalam object tetap reaktif, jadi
`person.address.city = "Bandung"` atau `items.push(x)` juga terdeteksi.

### Kapan dibutuhkan

Kelompokkan jadi satu object kalau beberapa nilai memang satu kesatuan —
seperti field-field satu form, atau satu entitas `user`. Keuntungannya: satu
sumber data, enak dikirim utuh ke fungsi atau ke komponen lain.

Kalau nilai-nilainya tidak berhubungan, lebih jelas dibuat `$state` terpisah
masing-masing.

### Versi yang lebih idiomatis

Kode di atas masih membaca input lewat `document.getElementById()`. Artinya
state hanya ikut berubah saat tombol diklik — dan kita kembali menyebut `id`
seperti di versi manual.

Cara Svelte-nya adalah `bind:value`, yang menyambungkan input dan state dua
arah:

```svelte
<script>
  let person = $state({ first_name: "", last_name: "" });
</script>

<input type="text" bind:value={person.first_name} placeholder="first name" />
<input type="text" bind:value={person.last_name}  placeholder="last name" />

<p>my first name: {person.first_name}</p>
```

Dengan ini fungsi `sayHello()` dan tombolnya tidak diperlukan lagi: teks di
bawah ikut berubah setiap ketikan, dan tidak ada `id` yang perlu dicocokkan.
