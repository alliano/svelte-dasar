<script>
  let counter = $state(0);
  let interval = $state(1000);

  function increment() {
    interval += 1000;
  }


  // Effect
  // Saat state berubah UI yang menggunakan state tersebut akan secara otomatis bereakse atas perubahan state tersebut, hal ini kita sebut dengan effect
  // Pada beberapa kasus, mungkin kita ingin membuat effect sendiri, yangmana ketika terjadi perubahan state kita ingin menjalankan kode tertentu(effect)
  // hal ini bisa kita lakukan dengan menggunakan Rune $effect()
  $effect(() => {
    let id = setInterval(() => {
      counter += 1;
    }, interval);

    return () => clearInterval(id);
  });
</script>


<h1>Counter: {counter}</h1>

<button onclick={increment}>Increment interval: 1 second</button>
