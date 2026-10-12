
// Di Svelte kode script hanya akan di render 1x yang selalu dirender ulang itu hanya element html nya aja. berbeda dengan vue atau reac
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


  // Kadang saat membuat applikasi, kita sering melakukan log perubahan yang terjadi di state
  // Biasanya, kita akan menggunakna console.log(state)
  // Namun, karena state itu sebenarnya adalah Proxy Object, maka akan terjadi warning ketika kita melakukan itu
  // Diasarankan jikalau kita ingin melakukan debug/log kita menggunakan Rune $inspect(state) jika kita ingin pendeteksian perubahanya yang terjadi pada state
  // Misalnya, ketika terjadi perubahan, kita ingin melakukan log datanya, kita bisa menggunakan $inspect(state).with((type, value) => ...)
  $inspect(count).with((type, values) => console.log(type, values));
</script>



<h1>{count.join(" + ")} = {total}</h1>

<button type="button" class="counter" onclick={increment}>Add</button>
