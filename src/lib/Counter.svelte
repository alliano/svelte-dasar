<script>
  let count = $state([]);

  // Jika pada kasus kita tidak bisa membuat expression untuk $derived(), maka kita bisa menggunakan membuat dalam bentuk function
  // Namun kita perlu menggunakan $deriverd.by(function)
   let total = $derived.by(() => {
    let total = 0;
    for(let i=0; i < count.length; i++) {
      total+=count[i];
    }
    return total;
  });
  

  function increment() {
    count.push(1);
  }
</script>



<h1>{count.join(" + ")} = {total}</h1>

<button type="button" class="counter" onclick={increment}>Add</button>
