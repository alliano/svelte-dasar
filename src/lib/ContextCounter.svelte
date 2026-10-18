<script>
  import {getContext} from "svelte";


  // Context
  // Alternative lain jikalau kita tidak ingin menggunakan global state adalah dengan menggunakan Context
  // Context adalah tempat kita menyimpan data. Saat kita menyimpan data di Context maka hanya component tersebut dan child nya saja yang bisa data state tersebut
  // Context itu tidak reaktive , sehingga jikalau kita ingin membuatnya reactive maka kita harus memasukan data reactive kedalam Context
  // https://svelte.dev/docs/svelte/context
  let counter = getContext("counter");
  function increment() {
    counter.count++;
  }

  $inspect(counter).with((k, v) => console.log(k, v));
</script>

<button onclick={increment}>Increment: {counter.count}</button>
