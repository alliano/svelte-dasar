<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>



<h1>Counter: {count}</h1>

<button type="button" class="counter" onclick={increment}>increment</button>
