Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/transition`,
18 Oktober 2026, memakai Svelte 5.57.

# Transition

Sampai sini todo kita muncul dan hilang dengan tiba-tiba. Kalau mau ada animasinya,
biasanya kita akan menyiapkan dua class CSS lalu menambah dan menghapusnya sendiri
dengan timer, dan yang paling merepotkan adalah saat element-nya dihapus: kita harus
menunda penghapusanya sampai animasi keluarnya selesai.

``` js
// cara panjangnya: animasinya dulu, hapus element-nya belakangan
li.classList.add("keluar");
setTimeout(() => li.remove(), 1000);
```

Namun, di Svelte kita tidak perlu melakukanya seperti contoh diatas. Svelte punya
directive `transition:` yang memberi animasi pada element ketika dia masuk dan
keluar dari DOM, termasuk menahan penghapusanya sampai animasinya selesai. Untuk
lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/transition

``` svelte
<script>
  import { fly } from "svelte/transition";
</script>

<!-- animasinya jalan saat li masuk DOM dan saat keluar dari DOM -->
<li transition:fly>{todo.name}</li>
```

Yang perlu kita ingat, transition hanya jalan kalau element-nya benar-benar masuk
atau keluar dari DOM. Jadi dia berpasangan dengan block seperti `{#if}` dan
`{#each}`, bukan dengan perubahan data biasa.

``` svelte
<!-- masuk saat todos ditambah, keluar saat todo-nya dihapus -->
{#each todos as todo (todo.id)}
  <li transition:fly>{todo.name}</li>
{/each}
```

# Transition yang Tersedia

Kita tidak perlu membuat animasinya sendiri, karena Svelte sudah menyediakan
beberapa transition siap pakai di module `svelte/transition`. Yang ada di versi ini
adalah `fade`, `blur`, `fly`, `slide`, `scale`, `draw`, dan `crossfade`. Untuk lebih
detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/svelte-transition

``` svelte
<script>
  import { fade, fly, slide, scale } from "svelte/transition";
</script>

<li transition:fade>memudar</li>
<li transition:fly>bergerak dari satu posisi</li>
<li transition:slide>tinggi element-nya mengembang</li>
<li transition:scale>membesar dan mengecil</li>
```

# Parameter Transition

Setiap transition punya parameter sendiri yang bisa kita ubah, dan cara
mengirimkanya adalah `transition:jenis={parameter}` dengan isinya sebuah object.
Khusus untuk `fly` parameternya adalah `x`, `y`, `duration`, `delay`, `opacity`, dan
`easing`.

``` svelte
<!-- datang dari 200px di bawah posisinya, selama 2 detik -->
<li transition:fly={{y: 200, duration: 2000}}>{todo.name}</li>

<!-- dari samping, dengan jeda sebelum mulai -->
<li transition:fly={{x: -100, delay: 300}}>{todo.name}</li>
```

Karena yang kita kirim itu object literal di dalam kurung kurawal expression, kurung
kurawalnya memang jadi dobel. Kalau hanya ditulis sekali, kodenya tidak akan
compile, karena isi `={...}` dibaca sebagai expression JavaScript biasa dan `y: 200`
bukan expression yang sah.

``` svelte
<!-- SALAH: compile error "Expected token }" -->
<li transition:fly={y: 200, duration: 2000}>{todo.name}</li>

<!-- BENAR: kurawal luar untuk expression, kurawal dalam untuk object-nya -->
<li transition:fly={{y: 200, duration: 2000}}>{todo.name}</li>
```

Parameter `easing` menentukan irama gerakanya, dan fungsi-fungsinya diambil dari
module `svelte/easing`.

``` svelte
<script>
  import { fly } from "svelte/transition";
  import { bounceOut } from "svelte/easing";
</script>

<li transition:fly={{y: 200, duration: 2000, easing: bounceOut}}>{todo.name}</li>
```

# In dan Out

Kadang kita ingin jenis atau arah animasi yang berbeda antara masuk dan keluar.
Untuk itu `transition:` bisa kita pecah jadi dua directive: `in:` yang hanya jalan
saat element-nya masuk, dan `out:` yang hanya jalan saat keluar.

``` svelte
<!-- masuk dari bawah selama 2 detik, keluar ke atas selama 1 detik -->
<li in:fly={{y: 200, duration: 2000}} out:fly={{y: -200, duration: 1000}}>
  {todo.name}
</li>
```

Keduanya tidak harus jenis yang sama, jadi kita bebas mencampurnya.

``` svelte
<script>
  import { fly, fade } from "svelte/transition";
</script>

<!-- masuknya bergerak, keluarnya cukup memudar -->
<li in:fly={{y: 200}} out:fade>{todo.name}</li>
```

Bedanya dengan `transition:` bukan cuma soal bisa beda jenis. `transition:` itu satu
animasi dua arah, jadi kalau element-nya dihapus saat animasi masuknya belum selesai,
animasinya akan berbalik dari posisi saat itu. Sedangkan `in:` dan `out:` adalah dua
animasi terpisah yang tidak saling tahu, sehingga animasi keluarnya mulai dari awal.
Untuk daftar todo yang cepat ditambah-hapus, perbedaan ini kelihatan.

``` svelte
<!-- berbalik di tengah jalan kalau dihapus sebelum animasi masuknya selesai -->
<li transition:fly={{y: 200, duration: 2000}}>{todo.name}</li>

<!-- animasi keluarnya selalu mulai dari awal, tidak melanjutkan yang masuk -->
<li in:fly={{y: 200, duration: 2000}} out:fly={{y: -200}}>{todo.name}</li>
```

# Transition itu Lokal

Satu hal yang gampang membingungkan: transition hanya jalan kalau block tempat dia
berada yang berubah, bukan ketika block di atasnya yang muncul atau hilang. Jadi
kalau seluruh daftarnya kita bungkus `{#if}` lagi, animasi tiap `<li>` tidak akan
ikut jalan saat daftar itu pertama kali ditampilkan.

``` svelte
{#if tampil}
  <ul>
    {#each todos as todo (todo.id)}
      <!-- tidak beranimasi saat tampil berubah jadi true -->
      <li transition:fly={{y: 200}}>{todo.name}</li>
    {/each}
  </ul>
{/if}
```

Kalau kita memang ingin animasinya tetap jalan dalam kondisi itu, ada modifier
`|global` yang membuatnya tidak lagi dibatasi block-nya sendiri.

``` svelte
{#if tampil}
  <ul>
    {#each todos as todo (todo.id)}
      <!-- ikut beranimasi walaupun yang berubah adalah block di atasnya -->
      <li transition:fly|global={{y: 200}}>{todo.name}</li>
    {/each}
  </ul>
{/if}
```
