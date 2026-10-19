Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/context`,
19 Oktober 2026, memakai Svelte 5.57.

# Special Element

Saat membuat web, kadang kita ingin menempelkan sesuatu ke element yang ada di
luar component kita, seperti `window`, `document`, `body`, atau `head`. Masalahnya
component Svelte itu dirender ke dalam halaman yang sudah ada, jadi di template
kita tidak bisa menulis `<body>` atau `<window>` begitu saja — element-nya bukan
milik kita.

Biasanya kita akan turun ke javascript biasa, pasang listener-nya manual, lalu
jangan lupa melepasnya lagi saat component dilepas supaya tidak bocor.

``` svelte
<script>
  import { onMount, onDestroy } from "svelte";

  function handleMouseMove(event) { /* ... */ }

  onMount(() => document.body.addEventListener("mousemove", handleMouseMove));

  // gampang lupa: kalau ini tidak ditulis, listener-nya tetap nempel
  onDestroy(() => document.body.removeEventListener("mousemove", handleMouseMove));
</script>
```

Namun, ketika kita memakai special element kita tidak perlu melakukannya seperti
contoh diatas. Svelte menyediakan component bawaan yang merepresentasikan
element-element tadi, jadi kita bisa memasang event-nya persis seperti memasang
props ke component biasa. Pemasangan dan pelepasan listener-nya diurus Svelte
sendiri mengikuti umur component-nya.

``` svelte
<script>
  const mouse = $state({ x: 0, y: 0 });

  function handleMouseMove(event) {
    mouse.x = event.clientX;   // posisi mouse relatif terhadap viewport
    mouse.y = event.clientY;
  }
</script>

<!-- self closing, dan tidak punya isi — dia cuma "pegangan" ke <body> -->
<svelte:body onmousemove={handleMouseMove}/>

<h1>X: {mouse.x}</h1>
<h1>Y: {mouse.y}</h1>
```

Perhatikan bahwa nama event-nya ditulis `onmousemove`, bukan `on:mousemove`.
Di Svelte 5 event sudah jadi property biasa, jadi penulisannya sama dengan event
handler di element HTML lainnya.

Ada beberapa special element yang bisa kita pakai, semuanya ditulis dengan prefix
`svelte:`:

- [`svelte:window`](https://svelte.dev/docs/svelte/svelte-window) — representasi `window`
- [`svelte:document`](https://svelte.dev/docs/svelte/svelte-document) — representasi `document`
- [`svelte:body`](https://svelte.dev/docs/svelte/svelte-body) — representasi `<body>`
- [`svelte:head`](https://svelte.dev/docs/svelte/svelte-head) — menyisipkan isi ke `<head>`

Satu aturan yang perlu diingat: special element ini hanya boleh ditulis di level
paling atas template, tidak boleh dibungkus `{#if}`, `{#each}`, atau element lain.
Kalau dibungkus, compiler-nya akan langsung menolak.

``` svelte
<!-- ERROR: <svelte:body> harus di top level -->
{#if tracking}
  <svelte:body onmousemove={handleMouseMove}/>
{/if}

<!-- benar: element-nya tetap di atas, yang dikondisikan isi handler-nya -->
<svelte:body onmousemove={(e) => tracking && handleMouseMove(e)}/>
```

Yang membedakan satu sama lain adalah jangkauan event-nya. `svelte:body` hanya
menangkap event di dalam `<body>`, sementara `svelte:window` menangkap event di
seluruh jendela browser. Untuk melacak mouse, `svelte:window` biasanya lebih
aman — kalau isi halamannya pendek, area kosong di bawahnya bukan bagian dari
`<body>`, sehingga koordinatnya berhenti berubah disana.

``` svelte
<!-- berhenti update begitu kursor keluar dari area body -->
<svelte:body onmousemove={handleMouseMove}/>

<!-- ikut terus selama kursor masih di dalam jendela browser -->
<svelte:window onmousemove={handleMouseMove}/>
```

Khusus `svelte:window` dan `svelte:document`, ada bonus: sebagian property-nya
bisa kita `bind` langsung, jadi untuk kasus seperti ukuran layar atau posisi
scroll kita bahkan tidak perlu menulis handler sama sekali.

``` svelte
<script>
  let scrollY = $state(0);
  let innerWidth = $state(0);
</script>

<!-- nilainya otomatis ikut berubah setiap kali user scroll / resize -->
<svelte:window bind:scrollY bind:innerWidth/>

<p>scroll: {scrollY}px, lebar: {innerWidth}px</p>
```

# Event Object

Handler yang kita pasang ke special element menerima event object asli dari DOM,
sama persis seperti `addEventListener`. Jadi semua property-nya tetap tersedia,
termasuk `clientX` dan `clientY` yang kita pakai diatas.

Yang sering bikin bingung, untuk posisi mouse ada beberapa pasang koordinat yang
berbeda, dan memilih yang salah bikin angkanya kelihatan "meleset" saat halaman
di-scroll.

``` js
function handleMouseMove(event) {
  event.clientX;   // relatif terhadap viewport, tidak terpengaruh scroll
  event.pageX;     // relatif terhadap dokumen, ikut bertambah saat di-scroll
  event.offsetX;   // relatif terhadap element yang kena event
}
```
