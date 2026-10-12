<script>
  let count = 0;
  function counter() {
    count++;
    document.getElementById("counter").innerHTML = `Counter: ${count}`;
  }
</script>

<style>
  h1 {
    color: green;
  }
</style>

<h1 id = "counter">Counter: 0</h1>

<button onclick={counter}>increment</button>
