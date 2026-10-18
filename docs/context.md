Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/context`,
19 Oktober 2026, memakai Svelte 5.57.

# Context

Kalau beberapa component perlu memakai data yang sama, pilihan pertama biasanya
mengirimkanya lewat props. Masalahnya muncul kalau component yang butuh data itu
letaknya jauh di dalam: datanya harus kita titipkan turun lewat setiap perantara,
padahal perantaranya sendiri tidak memakainya.

``` svelte
<!-- counter cuma dititipkan, tidak dipakai di Halaman maupun Panel -->
<Halaman {counter}>
  <Panel {counter}>
    <ContextCounter {counter}/>
  </Panel>
</Halaman>
```

Pilihan lainya adalah menaruh datanya di module sebagai global state, tapi dengan
begitu datanya jadi milik seluruh aplikasi. Jalan tengahnya adalah Context, yaitu
tempat menyimpan data yang hanya bisa dilihat oleh component yang menyimpanya dan
seluruh keturunanya. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/context

Parent menyimpan datanya dengan `setContext(key, value)`.

``` svelte
<script>
  import { setContext } from "svelte";
  import ContextCounter from "./ContextCounter.svelte";

  const counter = $state({ count: 0 });

  // disimpan dengan key "counter", bisa dibaca semua keturunan component ini
  setContext("counter", counter);
</script>

<ContextCounter/>
<ContextCounter/>
```

Lalu keturunanya mengambilnya dengan `getContext(key)`, tanpa perlu menerima props
apa pun.

``` svelte
<script>
  import { getContext } from "svelte";

  // tidak ada props sama sekali, datanya diambil dari context
  let counter = getContext("counter");

  function increment() {
    counter.count++;
  }
</script>

<button onclick={increment}>Increment: {counter.count}</button>
```

Karena yang disimpan satu object yang sama, keempat `<ContextCounter/>` itu membaca
dan menulis angka yang sama. Jadi tombol mana pun yang kita klik, semuanya ikut
berubah.

# Context Tidak Reaktif dengan Sendirinya

Ini bagian yang paling gampang menjebak. `setContext` cuma menyimpan nilai ke dalam
sebuah map, dia tidak menjadikan apa pun reaktif. Jadi kalau yang kita simpan angka
biasa, nilainya terkunci: child menerima salinan angka saat itu, dan perubahan di
parent tidak akan terlihat.

``` svelte
<script>
  // TIDAK reaktif: yang masuk context cuma angka 0, bukan state-nya
  let count = $state(0);
  setContext("counter", count);
</script>
```

Supaya reaktif, yang kita masukan ke context harus datanya yang memang reaktif,
yaitu object `$state`. Yang dibagikan jadi object-nya, dan karena `$state`
mengawasi object itu sampai ke dalam, perubahan `counter.count` terlihat di semua
yang membacanya.

``` svelte
<script>
  // reaktif: object $state-nya yang dibagikan
  const counter = $state({ count: 0 });
  setContext("counter", counter);
</script>
```

Konsekuensinya, child harus mengubah isi object-nya, bukan mengganti variabelnya.
Mengganti variabel hanya memutus hubunganya dengan object yang dibagikan.

``` svelte
<script>
  let counter = getContext("counter");

  function increment() {
    // BENAR: mengubah isi object yang dibagikan
    counter.count++;

    // SALAH: variabel lokalnya diganti, context-nya tidak ikut berubah
    counter = { count: counter.count + 1 };
  }
</script>
```

# Harus Dipanggil Saat Inisialisasi

`setContext` dan `getContext` hanya boleh dipanggil saat component sedang
diinisialisasi, yaitu langsung di dalam block `script`. Keduanya bersandar pada
"component mana yang sedang dibuat", dan informasi itu sudah tidak ada lagi begitu
kita masuk ke dalam event handler atau callback.

``` svelte
<script>
  // SALAH: dijalankan nanti, saat tidak ada component yang sedang dibuat
  function increment() {
    let counter = getContext("counter");
    counter.count++;
  }

  // BENAR: diambil sekali di awal, dipakai di dalam function
  let counter = getContext("counter");

  function increment2() {
    counter.count++;
  }
</script>
```

Ada dua aturan turunan dari sini yang perlu kita ingat. Pertama, `getContext` hanya
melihat context yang sudah di-`setContext` sebelumnya, jadi di component yang sama
urutan penulisanya berpengaruh. Kedua, kalau ada beberapa leluhur yang memakai key
yang sama, yang terbaca adalah milik leluhur yang paling dekat.

``` svelte
<script>
  // mengambil dulu, baru menyimpan: yang terbaca masih punya leluhur
  let dariLuar = getContext("counter");

  setContext("counter", $state({ count: 10 }));
</script>
```

# hasContext dan createContext

Kalau sebuah component boleh dipakai di dalam maupun di luar parent-nya, kita bisa
memeriksa dulu dengan `hasContext(key)` ketimbang menebak.

``` svelte
<script>
  import { getContext, hasContext } from "svelte";

  // $state harus jadi pengisi deklarasi variabel, tidak boleh diselipkan di ternary
  let lokal = $state({ count: 0 });

  // dipakai sendirian pun tidak error, dia jatuh ke state lokal
  let counter = hasContext("counter") ? getContext("counter") : lokal;
</script>
```

Kalau `$state`-nya kita selipkan langsung di dalam ternary, compiler menolaknya
dengan `state_invalid_placement`.

``` svelte
<script>
  // ERROR: $state hanya boleh jadi pengisi deklarasi variabel atau field class
  let counter = hasContext("counter") ? getContext("counter") : $state({ count: 0 });
</script>
```

Memakai string sebagai key punya kelemahan: salah tulis `"conter"` tidak akan
ditegur siapa pun, hasilnya cuma `undefined` saat dijalankan. Karena itu Svelte
menyediakan `createContext()` yang membuatkan key-nya sendiri, lalu mengembalikan
tiga function siap pakai dalam bentuk array: pengambil, penyimpan, dan pemeriksa.

``` js
// src/state/counter-context.js
import { createContext } from "svelte";

// urutanya: [get, set, has]
export const [getCounter, setCounter, hasCounter] = createContext();
```

Dengan begitu parent dan child cukup meng-import function-nya, dan tidak ada lagi
string yang bisa salah tulis.

``` svelte
<script>
  // di parent
  import { setCounter } from "../state/counter-context.js";
  setCounter($state({ count: 0 }));
</script>

<script>
  // di child
  import { getCounter } from "../state/counter-context.js";
  const counter = getCounter();
</script>
```

Bedanya dengan `getContext` biasa, pengambil dari `createContext()` akan melempar
error kalau context-nya memang belum pernah di-set, bukan diam-diam memberi
`undefined`.

# Yang Perlu Dibenahi

- Nama file di `vite.config.js` salah tulis: entry-nya menunjuk ke
  `comtext-counter.html`, padahal file-nya `context-counter.html`. Saat
  `npm run dev` halamanya masih bisa dibuka karena Vite melayani file HTML di root
  apa adanya, tapi `npm run build` akan gagal mencari file yang tidak ada itu.
- Key context `"counter"` ditulis sebagai string di dua file terpisah
  (`ContextCounterApp.svelte` dan `ContextCounter.svelte`). Kalau salah satu salah
  tulis, `getContext` akan mengembalikan `undefined` tanpa peringatan apa pun.
  `createContext()` menghilangkan risiko itu.
- `$inspect(counter)` di `src/lib/ContextCounter.svelte` dipasang di keempat
  instance-nya, jadi satu klik mencetak empat baris log yang sama.
- Komentar di `src/lib/ContextCounter.svelte` ada yang kurang kata: "hanya component
  tersebut dan child nya saja yang bisa data state tersebut" — kurang kata "membaca".
  Kata `reaktive` dan `reactive` juga dipakai bergantian di kalimat yang sama.
