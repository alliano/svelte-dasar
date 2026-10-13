# Global State
Kalau kita pernah belajar React atau Vue, state biasanya cuma bisa dipakai didalam komponenya sendiri sebagai local state. Begitu ada dua komponen yang butuh data yang sama, kita langsung butuh state management seperti Redux, Zustand, atau Pinia.

Di Svelte beda ceritanya. Rune `$state` bisa kita taruh **diluar** komponen, lalu di-import oleh komponen manapun yang membutuhkanya. Jadi untuk kebutuhan global state, kita nga perlu lagi library tambahan.

Tapi ada syaratnya : Rune cuma bisa dipakai di file yang diproses oleh compiler Svelte. Kalau kita taruh di file `.js` biasa, runenya nga bakal dikenali. Makanya file-nya harus dikasih akhiran `.svelte.js`. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/svelte-js-files
``` js
// src/state/counter.svelte.js
export const counter = $state({
 count: 0
});
```

Setelah itu tinggal kita import seperti module JavaScript biasa :
``` svelte
<!-- src/lib/GlobalCounter.svelte -->
<script>
  import { counter } from "../state/counter.svelte.js"

  function increment() {
    // mengubah state yang dipakai bareng-bareng
    counter.count++;
  }
</script>

<button onclick={increment}>Increment : {counter.count}</button>
```

Karena module di JavaScript itu singleton (cuma dieksekusi sekali walaupun di-import berkali-kali), semua komponen yang meng-import file tadi bakal dapat object `counter` yang sama persis. Jadi kalau kita render komponenya enam kali, keenamnya berbagi satu state :
``` svelte
<!-- src/lib/GlobalCounterApp.svelte -->
<script>
  import GlobalCounter from "./GlobalCounter.svelte";
</script>

<GlobalCounter/>
<GlobalCounter/>
<GlobalCounter/>
<GlobalCounter/>
<GlobalCounter/>
<GlobalCounter/>
```

Hasilnya, kita klik tombol yang mana aja, angka di keenam tombolnya ikut naik bareng :
```
awal                      : 0 | 0 | 0 | 0 | 0 | 0
setelah klik tombol ke-1  : 1 | 1 | 1 | 1 | 1 | 1
setelah klik ke-4 dan ke-6: 3 | 3 | 3 | 3 | 3 | 3
```

# Kenapa State-nya Harus Object ?
Perhatikan kalau state diatas dibungkus object `{ count: 0 }`, bukan langsung angka. Ini bukan kebetulan.

Lalu kenapa nga langsung `export let count = $state(0)` aja ??

Karena kalau state-nya kita ganti dengan penugasan ulang (`count++` itu termasuk penugasan ulang), Svelte bakal nolak pas compile :
``` js
// ERROR state_invalid_export
export let count = $state(0);
export function inc() { count++; }
```
```
Cannot export state from a module if it is reassigned.
Either export a function returning the state value or only mutate
the state value's properties
```

Penyebabnya ada di cara kerja `import`/`export` di JavaScript. Yang kita export itu nilainya pada saat itu, jadi kalau variabelnya ditugaskan ulang didalam module, komponen yang sudah meng-import nga bakal ikut keganti.

Seperti yang disebut di pesan errornya, ada dua jalan keluar. Yang pertama adalah cara yang dipakai disini : bungkus pakai object, lalu yang diubah **property**-nya, bukan variabelnya. Object-nya sendiri nga pernah diganti, jadi referensinya tetap sama :
``` js
export const counter = $state({ count: 0 });

export function inc() {
  // mutasi property, bukan menugaskan ulang counter
  counter.count++;
}
```

Cara kedua, state-nya kita simpan privat didalam module, lalu yang di-export cuma function-nya :
``` js
let count = $state(0);

export function inc() { count++; }
export function get() { return count; }
```
