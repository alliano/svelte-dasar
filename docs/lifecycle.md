Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/context`,
19 Oktober 2026, memakai Svelte 5.57.

# Lifecycle Hooks

Kadang kita butuh menjalankan sesuatu tepat saat component muncul di halaman,
misalnya mengambil data dari server. Kalau kodenya kita taruh langsung di block
`script`, dia berjalan terlalu awal — saat itu element-nya belum ada di DOM, jadi
apa pun yang butuh element-nya belum bisa kita sentuh.

``` svelte
<script>
  // terlalu awal: element-nya belum ada di halaman
  const el = document.querySelector("h1");
  console.log(el);   // null
</script>

<h1>Blog</h1>
```

Untuk itu Svelte menyediakan lifecycle hooks. Yang paling sering dipakai ada dua:
`onMount(callback)` yang jalan sekali setelah component terpasang ke DOM, dan
`onDestroy(callback)` yang jalan tepat sebelum component dilepas. Untuk lebih detail
nya bisa kunjungi disini https://svelte.dev/docs/svelte/lifecycle-hooks

``` svelte
<script>
  import { onMount, onDestroy } from "svelte";

  onMount(() => {
    console.log("component sudah tampil");
  });

  onDestroy(() => {
    console.log("component mau dilepas");
  });
</script>
```

Keduanya harus dipanggil saat component sedang diinisialisasi, yaitu langsung di
dalam block `script`. Kalau dipanggil dari dalam event handler, Svelte sudah tidak
tahu lagi component mana yang dimaksud dan melempar `lifecycle_outside_component`.

``` svelte
<script>
  // SALAH: dijalankan nanti, saat tidak ada component yang sedang dibuat
  function muat() {
    onMount(() => console.log("hai"));
  }
</script>
```

# Mengambil Data di onMount

Pemakaian `onMount` yang paling umum adalah mengambil data. Karena `fetch` itu
asynchronous, callback-nya kita tulis `async` lalu hasilnya kita simpan ke state.

``` svelte
<script>
  import { onMount } from "svelte";

  let blogs = $state([]);

  onMount(async () => {
    const data = await fetch("/blog.json");
    blogs = await data.json();
  });
</script>

{#each blogs as blog}
  <h1>{blog.title}</h1>
{/each}
```

Yang wajib diingat, variabel penampungnya harus `$state`. Kalau variabel biasa,
`fetch`-nya tetap berhasil tapi tampilanya tidak pernah ikut berubah — Svelte tidak
tahu nilainya sudah diganti, jadi yang terender selamanya nilai awalnya.

``` svelte
<script>
  // TIDAK reaktif: {#each} tetap memakai array awal walaupun fetch-nya sukses
  let blogs = [{ title: "", content: "", footer: "" }];

  onMount(async () => {
    blogs = await (await fetch("/blog.json")).json();
  });
</script>
```

Karena datanya baru datang setelah mount, nilai awal itu sempat terender lebih dulu.
Jadi nilai awalnya sebaiknya array kosong supaya tidak ada tampilan kosong yang
berkelip, atau datanya kita serahkan ke `{#await}` kalau mau sekalian ada tampilan
loading dan error.

``` svelte
<script>
  async function getBlogs() {
    const data = await fetch("/blog.json");
    if (!data.ok) throw new Error(`Gagal memuat: ${data.status}`);
    return await data.json();
  }

  const blogsPromise = getBlogs();
</script>

<!-- tidak perlu onMount maupun state penampung -->
{#await blogsPromise}
  <p>Loading...</p>
{:then blogs}
  {#each blogs as blog}<h1>{blog.title}</h1>{/each}
{:catch error}
  <p>Error: {error.message}</p>
{/await}
```

# Cleanup dari onMount Harus Sinkron

`onMount` punya kemudahan: kalau callback-nya mengembalikan sebuah function,
function itu akan dipanggil saat component dilepas. Jadi kita tidak perlu menulis
`onDestroy` terpisah.

``` svelte
<script>
  onMount(() => {
    const id = setInterval(() => console.log("tik"), 1000);

    // dipanggil saat component dilepas
    return () => clearInterval(id);
  });
</script>
```

Tapi ini hanya berlaku kalau callback-nya sinkron. Callback `async` selalu
mengembalikan Promise, bukan function, jadi Svelte mengabaikanya dan cleanup-nya
tidak pernah jalan. Ini jebakan yang halus, karena kodenya kelihatan benar.

``` svelte
<script>
  onMount(async () => {
    const id = setInterval(() => console.log("tik"), 1000);

    // DIABAIKAN: callback async mengembalikan Promise, bukan function
    return () => clearInterval(id);
  });
</script>
```

Kalau kita memang butuh `async` sekaligus cleanup, pisahkan keduanya: `async`-nya
dipanggil dari dalam callback sinkron, dan cleanup-nya tetap di-`return`.

``` svelte
<script>
  onMount(() => {
    // tidak di-await, cukup dijalankan
    muatData();

    const id = setInterval(() => console.log("tik"), 1000);
    return () => clearInterval(id);
  });
</script>
```

# onMount Tidak Jalan di Server

Satu sifat `onMount` yang perlu kita tahu: dia tidak dijalankan saat server-side
rendering, karena memang tidak ada DOM disana. Jadi dia tempat yang aman untuk kode
yang hanya masuk akal di browser, seperti menyentuh `window` atau `localStorage`.

``` svelte
<script>
  let lebar = $state(0);

  onMount(() => {
    // aman: baris ini tidak pernah dijalankan di server
    lebar = window.innerWidth;
  });
</script>
```

Dari keempat hook lama — `onMount`, `beforeUpdate`, `afterUpdate`, dan `onDestroy` —
hanya `onDestroy` yang juga berjalan di component sisi server. Dua yang di tengah
itu sisa dari Svelte 4 dan sudah tidak dianjurkan lagi di Svelte 5; untuk bereaksi
terhadap perubahan state, `$effect` yang dipakai.

``` svelte
<script>
  // cara lama, jangan dipakai lagi di repo ini
  import { afterUpdate } from "svelte";
  afterUpdate(() => console.log("ada yang berubah"));
</script>
```

Bahkan untuk banyak kasus `onMount` pun bisa digantikan `$effect`, bedanya `onMount`
jalan sekali saja sedangkan `$effect` jalan ulang setiap kali state yang dibacanya
berubah.

``` svelte
<script>
  // jalan sekali setelah mount, lalu cleanup saat dilepas
  $effect(() => {
    const id = setInterval(() => console.log("tik"), 1000);
    return () => clearInterval(id);
  });
</script>
```

# Menampilkan HTML Mentah dengan @html

Biasanya semua yang kita tulis di dalam kurung kurawal diperlakukan sebagai teks.
Itu memang yang kita mau, karena tag di dalam datanya tidak akan dieksekusi sebagai
HTML.

``` svelte
<!-- tampil apa adanya: <b>tebal</b> -->
<p>{blog.content}</p>
```

Namun kalau datanya memang berisi markup dan kita ingin dirender sebagai HTML, kita
bisa memakai `{@html expression}`. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/@html

``` svelte
<!-- <b>tebal</b> di dalam content akan beneran jadi tebal -->
<p>{@html blog.content}</p>
```

Yang perlu diwaspadai, Svelte tidak menyaring isinya sama sekali. Jadi kalau
datanya berasal dari luar — input user, komentar, API pihak lain — script di
dalamnya bisa ikut berjalan di halaman kita.

``` svelte
<script>
  // misalnya ini datang dari inputan user
  let content = "<img src=x onerror=\"alert('kena')\">";
</script>

<!-- BAHAYA: disuntikan apa adanya, tanpa disanitasi -->
<p>{@html content}</p>
```

Untuk file JSON milik sendiri seperti di latihan ini, `{@html}` aman. Tapi begitu
sumbernya tidak kita kendalikan, isinya harus disanitasi dulu sebelum masuk.
