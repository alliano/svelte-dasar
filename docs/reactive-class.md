Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/reactive-class`,
18 Oktober 2026, memakai Svelte 5.57.

# State di Dalam Class

Biasanya state kita simpan sebagai variabel lepas di dalam block `script`. Begitu
datanya mulai berhubungan satu sama lain, variabel-variabel itu berserakan dan
kita harus mengingat sendiri mana yang satu kesatuan.

``` svelte
<script>
  // tiga hal yang sebenarnya satu kesatuan, tapi terpisah-pisah
  let width = $state(0);
  let height = $state(0);
  let area = $derived(width * height);
</script>
```

Namun, Rune tidak terbatas pada variabel. `$state` juga bisa kita pakai sebagai
field sebuah class, sehingga data yang berhubungan bisa kita bungkus jadi satu
object yang tetap reaktif. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/$state

``` svelte
<script>
  class Box {
    // field-nya reaktif, sama seperti kalau pakai variabel
    width = $state(0);
    height = $state(0);
  }

  const box = new Box();
</script>

<p>{box.width} × {box.height}</p>
```

Reaktifnya menempel di instance-nya, jadi setiap `new Box()` punya state sendiri
dan kita bisa membuat sebanyak yang kita mau.

``` svelte
<script>
  const kotakKiri = new Box();
  const kotakKanan = new Box();

  // hanya kotakKiri yang berubah, tampilan kotakKanan tidak terpengaruh
  kotakKiri.width = 100;
</script>
```

# $derived di Dalam Class

Nilai yang dihitung dari field lain juga bisa jadi field. Bedanya dengan variabel
lepas, disini kita menyebut field-nya lewat `this`, karena nilainya diambil dari
instance yang sedang dibuat.

``` svelte
<script>
  class Box {
    width = $state(0);
    height = $state(0);

    // ikut berubah setiap kali width atau height berubah
    area = $derived(this.width * this.height);
  }

  const box = new Box();
</script>

<p>Box Area: {box.area}</p>
```

Karena `area` cuma turunan, kita tidak perlu menghitungnya ulang sendiri di setiap
tempat yang mengubah ukuranya. Itu persis masalah yang muncul kalau kita
menghitungnya manual.

``` svelte
<script>
  class Box {
    width = $state(0);
    height = $state(0);
    area = 0;

    setWidth(w) {
      this.width = w;
      // gampang kelewat: setiap setter harus ingat menghitung ulang
      this.area = this.width * this.height;
    }
  }
</script>
```

Kalau perhitunganya butuh beberapa baris, `$derived` punya bentuk `$derived.by()`
yang isinya function. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/$derived

``` svelte
<script>
  class Box {
    width = $state(0);
    height = $state(0);

    area = $derived.by(() => {
      const luas = this.width * this.height;
      return luas > 10000 ? 10000 : luas;
    });
  }
</script>
```

# Reaktifnya Menempel di Object, Bukan di Nilainya

Satu hal yang gampang menjebak: yang reaktif itu akses ke field-nya, bukan nilai
yang sudah kita keluarkan. Jadi begitu kita destructure atau menyalin field-nya ke
variabel biasa, hubunganya terputus dan tampilanya tidak ikut berubah lagi.

``` svelte
<script>
  const box = new Box();

  // TIDAK reaktif: width cuma salinan angka saat baris ini dijalankan
  const { width } = box;
</script>

<p>{width}</p>
```

Karena itu yang kita pegang dan kita kirim ke mana-mana sebaiknya object-nya, lalu
field-nya dibaca di tempat pemakaianya.

``` svelte
<!-- reaktif: box.width dibaca saat render, jadi perubahanya terlihat -->
<p>{box.width}</p>

<!-- kirim object-nya, bukan field-nya -->
<BoxView {box}/>
```

# Binding ke Field Class

Field class bisa langsung kita `bind:`, karena `bind:value` hanya butuh sesuatu yang
bisa dibaca dan ditulis. Jadi slider-nya menulis langsung ke `box.width`, dan
`box.area` ikut terhitung ulang dengan sendirinya.

``` svelte
<div>
  Width: <input type="range" min="0" max="500" bind:value={box.width}>
  Height: <input type="range" min="0" max="500" bind:value={box.height}>
</div>

<p>Box Area: {box.area}</p>
```

Yang menyelamatkan kita disini adalah Svelte otomatis mengubah nilainya jadi number
untuk input bertipe `range` dan `number`. Kalau tidak, `box.width * box.height` akan
bekerja dengan string dan hasilnya kacau.

``` svelte
<!-- nilainya number, jadi box.area beneran hasil kali -->
<input type="range" bind:value={box.width}>

<!-- tipe text tidak dikonversi: isinya string, dan "20" * "30" masih kebetulan jalan
     tapi "20" + "30" akan jadi "2030" -->
<input type="text" bind:value={box.width}>
```

# Ukuran Element dari State

Supaya perubahan itu kelihatan, ukuran kotaknya kita ambil dari state-nya. Nilai CSS
butuh satuan, jadi expression-nya kita gabung dengan `px` di dalam tanda kutip.

``` svelte
<!-- hasilnya width: 250px, bukan width: 250 -->
<div style:width="{box.width}px" style:height="{box.height}px">
  <p>Box Area: {box.area}</p>
</div>
```

Kalau satuanya lupa, browser akan mengabaikan nilainya dan kotaknya tidak pernah
berubah ukuran.

``` svelte
<!-- SALAH: width: 250 bukan nilai CSS yang sah -->
<div style:width={box.width}></div>
```

Untuk property yang nilainya tidak pernah berubah, lebih pas ditaruh di block
`<style>` saja, karena dia bukan bagian dari state.

``` svelte
<style>
  .box {
    background-color: blue;
  }
</style>

<!-- yang dinamis lewat style:, yang tetap lewat class -->
<div class="box" style:width="{box.width}px" style:height="{box.height}px"></div>
```

# Yang Perlu Dibenahi

- `box.html` belum didaftarkan di `vite.config.js`. Saat `npm run dev` halamanya
  tetap bisa dibuka, karena Vite melayani file HTML apa pun di root. Tapi saat
  `npm run build`, halaman ini tidak ikut ter-build, karena `build.rolldownOptions.input`
  baru berisi `index` dan `hello`.
- `style:background-color="blue"` di `src/lib/Box.svelte` nilainya tetap, jadi lebih
  pas ditaruh di block `<style>` ketimbang jadi style directive.
