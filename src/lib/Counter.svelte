<script>
  let count = 0;

  function increment() {
    count++;
    document.getElementById("counter").innerText = `Counter : ${count}`;
  }
</script>



<h1 id="counter" >Counter: 0</h1>

<button type="button" class="counter" onclick={increment}>increment</button>
