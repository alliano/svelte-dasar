Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/store`,
18 Oktober 2026, memakai Svelte 5.57.

# Store: State di Luar Component

State yang kita buat dengan `$state` hidup di dalam component, dan setiap instance
punya miliknya sendiri. Jadi kalau component yang sama kita pasang lima kali,
hitunganya pun jadi lima dan tidak saling tahu.

``` svelte
<script>
  // setiap StoreCounter punya count sendiri
  let count = $state(0);
</script>

<button onclick={() => count++}>Increment {count}</button>
```

Kalau yang kita mau justru satu nilai yang dipakai bersama, state-nya harus hidup di
luar component. Sebelum Svelte 5, caranya adalah Store, yaitu object dengan kontrak
`subscribe` yang disimpan di module tersendiri lalu di-import dari mana saja. Untuk
lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/svelte-store

``` js
// src/state/counter.js
import { writable } from "svelte/store";

// satu store, dipakai bersama oleh semua yang meng-import-nya
export const counter = writable(0);
```

Karena store-nya di-import dari module yang sama, kelima component itu membaca dan
menulis nilai yang sama.

``` svelte
<!-- kelimanya menampilkan angka yang sama, dan tombol mana pun menaikan semuanya -->
<StoreCounter/>
<StoreCounter/>
<StoreCounter/>
<StoreCounter/>
<StoreCounter/>
```

# Mengakses Store dengan $

Store itu bukan nilainya, melainkan wadah. Jadi kalau kita pakai langsung, yang
tampil adalah object store-nya, bukan angkanya. Cara panjangnya adalah membaca lewat
`subscribe()` dan menulis lewat `set()` atau `update()`.

``` svelte
<script>
  import { counter } from "../state/counter.js";

  let count = 0;
  counter.subscribe((nilai) => count = nilai);

  function increment() {
    counter.update((n) => n + 1);
  }
</script>
```

Namun, di dalam component kita tidak perlu melakukanya seperti contoh diatas. Cukup
tambahkan `$` di depan nama store-nya, dan Svelte akan mengurus subscribe-nya
sendiri — termasuk melepasnya saat component-nya dilepas.

``` svelte
<script>
  import { counter } from "../state/counter.js";

  function increment() {
    // menulis ke store, sama artinya dengan counter.update(n => n + 1)
    $counter++;
  }
</script>

<!-- $counter adalah nilainya, counter adalah store-nya -->
<button onclick={increment}>Increment {$counter}</button>
```

Yang perlu diingat, `$` ini fitur compiler Svelte, jadi dia hanya bisa dipakai di
dalam file `.svelte`. Di file `.js` biasa kita tetap harus memakai `get()` atau
`subscribe()`.

``` js
import { get } from "svelte/store";
import { counter } from "./state/counter.js";

// di file .js, $counter tidak ada
const sekarang = get(counter);
```

# Readable, Writable, dan Turunanya

Store ada dua jenis dasar. `writable()` menghasilkan store yang bisa dibaca dan
diubah dari luar, sedangkan `readable()` hanya bisa dibaca — nilainya ditentukan
dari dalam store itu sendiri lewat function yang kita berikan saat membuatnya.

``` js
import { readable, writable } from "svelte/store";

// bisa diubah dari mana saja
export const counter = writable(0);

// hanya bisa dibaca; nilainya diisi dari dalam
export const waktu = readable(new Date(), (set) => {
  const id = setInterval(() => set(new Date()), 1000);

  // dipanggil saat tidak ada lagi yang subscribe
  return () => clearInterval(id);
});
```

Selain keduanya, module `svelte/store` juga menyediakan `derived()` untuk store yang
nilainya dihitung dari store lain, dan `readonly()` untuk membungkus store writable
supaya tidak bisa diubah oleh pemakainya.

``` js
import { derived, readonly, writable } from "svelte/store";

const counter = writable(0);

// ikut berubah setiap kali counter berubah
export const genap = derived(counter, (n) => n % 2 === 0);

// versi counter yang tidak bisa di-set dari luar
export const counterPublik = readonly(counter);
```

# Subscribe Manual Harus Dilepas Sendiri

Subscribe lewat `$` dilepas otomatis oleh Svelte, tapi subscribe yang kita panggil
sendiri tidak. `subscribe()` mengembalikan function untuk berhenti berlangganan, dan
kalau function itu tidak pernah kita panggil, callback-nya akan terus jalan selama
halamanya hidup.

``` js
// callback ini jalan terus, tidak ada yang melepasnya
counter.subscribe((count) => console.log(count));
```

Yang benar adalah menyimpan hasilnya, lalu memanggilnya saat tidak dibutuhkan lagi.

``` js
const unsubscribe = counter.subscribe((count) => console.log(count));

// berhenti berlangganan
unsubscribe();
```

Di dalam component, subscribe manual biasanya kita taruh di `$effect` supaya
pelepasanya ikut siklus hidup element-nya.

``` svelte
<script>
  $effect(() => {
    const unsubscribe = counter.subscribe((n) => console.log(n));
    return unsubscribe;
  });
</script>
```

# Di Svelte 5, Rune Bisa Menggantikan Store

Store itu dulunya satu-satunya cara membuat state di luar component. Di Svelte 5
kita tidak lagi wajib memakainya, karena `$state` pun bisa hidup di sebuah module —
syaratnya nama file-nya memakai infix `.svelte.`, jadi `counter.svelte.js` dan bukan
`counter.js`. Hanya file dengan nama itu yang diproses compiler sebagai module
ber-Rune.

``` js
// src/state/counter.svelte.js
export const counter = $state({ count: 0 });
```

Lalu di component-nya kita pakai seperti object biasa, tanpa `$` dan tanpa subscribe.

``` svelte
<script>
  import { counter } from "../state/counter.svelte.js";
</script>

<button onclick={() => counter.count++}>Increment {counter.count}</button>
```

Kenapa dibungkus object, bukan angka langsung ?? Karena state yang di-export tidak
boleh di-assign ulang dari luar module-nya. Kalau kita mencoba, compiler menolaknya
dengan `state_invalid_export` dan menyarankan dua jalan keluar: mengubah properti
object-nya saja, atau meng-export function yang mengembalikan nilainya.

``` js
// ERROR: "Cannot export state from a module if it is reassigned"
export let count = $state(0);

export function increment() {
  count++;   // inilah assignment yang membuatnya ditolak
}
```

Jalan yang kedua adalah menyembunyikan state-nya dan membuka akses lewat function.

``` js
let count = $state(0);

export function getCount() {
  return count;
}

export function increment() {
  count++;
}
```

Kalau kita sedang di tengah-tengah memindahkan kode lama ke Rune, ada `toStore()`
dan `fromStore()` yang menjembatani keduanya, sehingga kode yang masih menunggu
store tetap bisa jalan.

``` js
import { fromStore, toStore } from "svelte/store";
import { counter } from "./state/counter.js";

// store lama dibaca sebagai object ber-Rune: pakai .current
const counterRune = fromStore(counter);

// sebaliknya, state Rune dibungkus jadi store
let count = $state(0);
export const counterStore = toStore(() => count, (n) => count = n);
```
