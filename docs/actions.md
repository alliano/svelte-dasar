Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/style`,
18 Oktober 2026, memakai Svelte 5.57.

# Action dengan use:

Kadang kita butuh melakukan sesuatu pada element DOM-nya sendiri, bukan pada
datanya — misalnya memasang library pihak ketiga, mengatur focus, atau menjalankan
timer yang menulis ke element itu. Biasanya kita akan mencari element-nya dulu
setelah halaman jadi, lalu mengerjakanya disana.

``` js
// harus menunggu element-nya ada, dan harus tahu id-nya
const h1 = document.getElementById("judul");
setInterval(() => {
  h1.textContent = new Date().toLocaleTimeString();
}, 1000);
```

Namun, di Svelte kita tidak perlu melakukanya seperti contoh diatas. Kita bisa
membuat Action, yaitu function biasa yang dipanggil Svelte ketika element-nya
dipasang ke halaman (mounted). Element-nya dikirim ke function itu sebagai argument
pertama, jadi kita tidak perlu mencarinya sendiri. Pemasanganya memakai directive
`use:<namaFunction>`. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/use

``` svelte
<script>
  // node adalah element DOM tempat action ini dipasang
  const time = (node) => {
    console.log(node);   // <h1>Title</h1>
  }
</script>

<h1 use:time>Title</h1>
```

Karena action-nya menerima element-nya langsung, kita bisa membaca atau mengubah
element itu tanpa `id` dan tanpa `getElementById`.

``` svelte
<script>
  const time = (node) => {
    // teks awal element-nya, dibaca sekali saat dipasang
    const text = node.textContent;
    node.textContent = `${text} ${new Date().toLocaleTimeString()}`;
  }
</script>

<h1 use:time>Title</h1>
```

# Membersihkan Action dengan $effect

Masalahnya muncul kalau action-nya menyalakan sesuatu yang berjalan terus, seperti
`setInterval`. Kalau element-nya dilepas dari halaman sedangkan interval-nya masih
hidup, dia akan terus berjalan dan menulis ke element yang sudah tidak ada —
inilah yang biasa kita sebut kebocoran.

Karena itu isi action biasanya kita taruh di dalam [`$effect`](https://svelte.dev/docs/svelte/$effect).
Function yang kita `return` dari dalam `$effect` akan dijalankan Svelte saat
element-nya dilepas, jadi disitulah tempat kita mematikan apa pun yang kita
nyalakan.

``` svelte
<script>
  const time = (node) => {
    const text = node.textContent;

    $effect(() => {
      const id = setInterval(() => {
        node.textContent = `${text} ${new Date().toLocaleTimeString()}`;
      }, 1000);

      // dipanggil saat element-nya dilepas: interval-nya ikut dimatikan
      return () => clearInterval(id);
    })
  }
</script>

<h1 use:time>Title</h1>
```

Tanpa baris `return` itu, interval-nya akan tetap jalan setelah element-nya hilang.

``` svelte
<script>
  const time = (node) => {
    $effect(() => {
      // BOCOR: tidak ada cleanup, interval-nya tidak pernah mati
      setInterval(() => {
        node.textContent = new Date().toLocaleTimeString();
      }, 1000);
    })
  }
</script>
```

Sebelum ada Rune, cleanup-nya ditulis dengan mengembalikan object berisi `destroy`
dari action-nya. Bentuk itu masih jalan di Svelte 5, tapi `$effect` yang dianjurkan
sekarang.

``` js
// cara lama, masih dikenali
function time(node) {
  const id = setInterval(/* ... */, 1000);
  return {
    destroy: () => clearInterval(id)
  };
}
```

# Satu Action untuk Banyak Element

Action itu function biasa, jadi satu action bisa kita pasang di element mana saja.
Yang perlu diingat, Svelte memanggilnya sekali untuk setiap element. Jadi setiap
element punya `node` sendiri, `text` sendiri, dan interval sendiri yang
masing-masing dibersihkan sendiri.

``` svelte
<!-- time() dipanggil dua kali: sekali untuk h1, sekali untuk p -->
<h1 use:time>Title</h1>
<p use:time>Hello World</p>
```

Karena itu kita tidak perlu khawatir dua element saling menimpa. Yang justru perlu
diwaspadai adalah menyimpan hasilnya di variabel di luar action, karena element
kedua akan menimpa catatan element pertama.

``` svelte
<script>
  // SALAH: satu variabel dipakai bersama semua element
  let intervalId;

  const time = (node) => {
    $effect(() => {
      intervalId = setInterval(/* ... */, 1000);

      // yang dimatikan hanya interval terakhir yang tercatat
      return () => clearInterval(intervalId);
    })
  }
</script>
```

# Action dengan Parameter

Action juga bisa menerima parameter, yang kita kirim lewat `use:nama={nilai}` dan
diterima sebagai argument kedua. Misalnya kita ingin jeda timer-nya bisa diatur per
element.

``` svelte
<script>
  const time = (node, jeda) => {
    const text = node.textContent;

    $effect(() => {
      const id = setInterval(() => {
        node.textContent = `${text} ${new Date().toLocaleTimeString()}`;
      }, jeda);

      return () => clearInterval(id);
    })
  }
</script>

<h1 use:time={1000}>Title</h1>
<p use:time={5000}>Hello World</p>
```

Lalu gimana dong kalau parameter-nya berasal dari state dan nanti berubah ?? Disini
ada jebakan yang gampang terlewat: Svelte memanggil action-nya sekali saja, dan
nilai parameternya dibaca secara untracked. Jadi parameter yang masuk sebagai
argument itu nilainya beku — meletakanya di dalam `$effect` pun tidak membuatnya
reaktif.

``` svelte
<script>
  let jeda = $state(1000);

  const time = (node, j) => {
    $effect(() => {
      // TIDAK reaktif: j hanya argument biasa, nilainya terkunci saat dipasang
      const id = setInterval(/* ... */, j);
      return () => clearInterval(id);
    })
  }
</script>

<h1 use:time={jeda}>Title</h1>
```

Kalau kita memang butuh action-nya ikut berubah, state-nya kita baca langsung di
dalam `$effect`, bukan lewat argument. Effect akan jalan ulang setiap kali state
itu berubah, dan cleanup-nya dipanggil dulu sebelum pengulangan — jadi interval
lamanya mati sebelum yang baru dinyalakan.

``` svelte
<script>
  let jeda = $state(1000);

  const time = (node) => {
    $effect(() => {
      // reaktif: jeda dibaca di dalam effect, jadi ikut jadi dependency-nya
      const id = setInterval(/* ... */, jeda);
      return () => clearInterval(id);
    })
  }
</script>

<h1 use:time>Title</h1>
```

Cara lainya, action-nya mengembalikan object dengan method `update`. Method itu
dipanggil Svelte setiap kali parameter-nya berubah, dan inilah satu-satunya jalan
kalau kita memang ingin menerima perubahan lewat parameter.

``` js
function time(node, jeda) {
  let id = setInterval(/* ... */, jeda);

  return {
    // dipanggil setiap kali nilai use:time={...} berubah
    update: (jedaBaru) => {
      clearInterval(id);
      id = setInterval(/* ... */, jedaBaru);
    },
    destroy: () => clearInterval(id)
  };
}
```
