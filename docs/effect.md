# Effect
Selama ini kita udah liat kalau UI otomatis bereaksi setiap kali state-nya berubah. Reaksi otomatis inilah yang disebut dengan effect, dan selama ini effect-nya dibuatkan sendiri oleh Svelte untuk meng-update DOM.

Namun pada beberapa kasus, kita pengen bikin effect sendiri. Misalnya pas state berubah kita mau nyalain timer, manggil API, atau nyambungin library pihak ketiga. Untuk itu kita bisa menggunakan Rune `$effect()`. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/$effect
``` svelte
<script>
  let counter = $state(0);
  let interval = $state(1000);

  function increment() {
    interval += 1000;
  }

  $effect(() => {
    let id = setInterval(() => {
      counter += 1;
    }, interval);

    // dijalankan sebelum effect diulang, dan saat komponen dibongkar
    return () => clearInterval(id);
  });
</script>

<h1>Counter: {counter}</h1>

<button onclick={increment}>Increment interval: 1 second</button>
```

Function didalam `$effect()` dijalankan setelah komponenya ter-mount, lalu dijalankan ulang setiap kali state yang dia pakai berubah. Jadi `$effect` bukan buat menghitung nilai — kalau cuma mau bikin nilai dari state lain, yang lebih tepat itu `$derived`, bukan `$effect`.

# Cleanup Function
Perhatikan ada `return` didalam effect diatas. Nilai yang di-return itu harus berupa function, dan function itulah yang dipanggil Svelte buat beberes.

Kenapa penting ?? Karena setiap kali effect-nya jalan ulang, `setInterval` yang baru bakal dibuat lagi. Kalau yang lama nga kita matiin, timer-nya bakal numpuk dan counter-nya jadi lompat-lompat :
``` js
// BOCOR: timer lama nga pernah dimatiin, tiap effect jalan ulang numpuk satu
$effect(() => {
  setInterval(() => {
    counter += 1;
  }, interval);
});
```

Cleanup function ini dipanggil di dua kesempatan : sesaat sebelum effect-nya dijalankan ulang, dan sekali lagi pas komponenya dibongkar dari halaman. Yang kedua ini yang bikin timer-nya berhenti pas kita pindah halaman, jadi nga jalan terus dibelakang layar.

# Dependency yang Terlacak
Nah ini bagian yang gampang bikin salah paham. Svelte cuma melacak state yang dibaca **secara langsung** saat effect-nya dijalankan. Yang dibaca didalam callback yang jalanya belakangan — kayak `setInterval`, `setTimeout`, atau `await` — nga ikut terlacak.

Coba liat lagi effect diatas. `interval` dibaca langsung pas effect jalan, jadi dia jadi dependency. Sedangkan `counter` cuma disentuh didalam callback `setInterval`, yang jalanya nanti-nanti :
``` js
$effect(() => {
  // interval dibaca disini juga, jadi TERLACAK
  let id = setInterval(() => {
    // counter disentuh disini, tapi TIDAK terlacak
    counter += 1;
  }, interval);

  return () => clearInterval(id);
});
```

Ini yang bikin kodenya nga looping. Coba bayangin kalau `counter` ikut terlacak : setiap detik counter naik, effect jalan ulang, timer dibikin lagi, dan seterusnya sampai nga karuan.

Kalau kita hitung beneran, effect-nya cuma jalan **sekali** walaupun counter udah naik berkali-kali. Dia baru jalan ulang pas tombolnya diklik, yaitu pas `interval` berubah, dan cleanup-nya dipanggil duluan :
```
counter udah naik 6x   -> effect jalan: 1 kali, cleanup: 0
klik tombol (interval) -> effect jalan: 2 kali, cleanup: 1
komponen dibongkar     -> cleanup: 2
```

Jadi aturan yang perlu diinget : jangan mengubah state yang dibaca langsung oleh effect-nya sendiri, karena itu yang bikin loop nga berujung.
