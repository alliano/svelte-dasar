Repo: `belajar-svelte-dasar` · Branch: `feat/reactive-state` · Svelte 5.57 · 2026-10-12

---

# Reactive State

- Kadang kita butuh data yang berubah-ubah, dan tampilan harus ikut berubah
- Tanpa ini, tampilan harus di-update manual lewat `document.getElementById(...)`
- Rune `$state(nilai)` menandai sebuah variabel sebagai reaktif
- Begitu nilainya berubah, Svelte yang mengurus update DOM-nya
- https://svelte.dev/docs/svelte/$state

```svelte
<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<h1>Counter: {count}</h1>
<button onclick={increment}>increment</button>
```

Versi manual, sebelum pakai `$state` — nilai awal ketulis dua kali dan gampang tidak sinkron:

```svelte
<script>
  // TIDAK reaktif: tampilan harus diurus sendiri
  let count = 0;

  function increment() {
    count++;
    document.getElementById("counter").innerText = `Counter : ${count}`;
  }
</script>

<h1 id="counter">Counter: 0</h1>
```

---

# $state() dengan Object

- Satu object bisa menampung beberapa nilai yang berhubungan, misal field satu form
- Svelte membungkusnya dengan `Proxy`, jadi mutasi per-field tetap terlacak
- Cukup ubah satu field — tidak perlu mengganti object utuh seperti di React
- Proxy-nya *deep*, jadi object atau array di dalamnya ikut reaktif
- https://svelte.dev/docs/svelte/$state

```svelte
<script>
  let person = $state({
    first_name: "",
    last_name: ""
  });

  function sayHello() {
    person.first_name = document.getElementById("firstName").value;
  }
</script>

<input type="text" id="firstName" placeholder="first name" />
<button onclick={sayHello}>Say Hello</button>

<p>my first name: {person.first_name}</p>
```

Kode di atas masih baca input lewat `getElementById`. `bind:value` menyambungkan input dan state dua arah, jadi tombolnya tidak perlu — lihat https://svelte.dev/docs/svelte/bind

```svelte
<input type="text" bind:value={person.first_name} placeholder="first name" />

<p>my first name: {person.first_name}</p>
```

---

# $state.raw()

- Dipakai saat datanya selalu diganti utuh — response API, atau object besar yang tak pernah disunting per-field
- `$state.raw(nilai)` melewatkan `Proxy`, jadi lebih murah tapi pelacakannya lebih kasar
- Hanya bereaksi saat variabelnya **diganti utuh**; mutasi field diabaikan tanpa error atau warning
- Mutasinya tetap mengubah object, jadi `console.log` tampak benar sementara tampilan diam — ini jebakan utamanya
- `bind:value` tidak jalan di sini, karena cara kerjanya menulis ke field
- https://svelte.dev/docs/svelte/$state

```svelte
<script>
  let university = $state.raw({
    name: "",
    major: ""
  });

  function inputDataUniversity() {
    // ganti seluruh object — ini yang terlacak
    university = {
      name: document.getElementById("universityName").value,
      major: document.getElementById("universityMajor").value
    };
  }
</script>

<input type="text" id="universityName" placeholder="University Name" />
<button onclick={inputDataUniversity}>Save Data</button>

<h1>My University Is {university.name}</h1>
```

```js
// TIDAK reaktif: $state.raw tidak melihat perubahan field
university.name = "Universitas Indonesia";

// update sebagian: spread + ganti utuh
university = { ...university, major: "Sistem Informasi" };
```
