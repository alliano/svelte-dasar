<script>
  let count = $state([]);
  // $driveed() ini akan berekasi ketika $state bereaksi. jadi $derived ini beraksi ketika reaktive yang ditunjuk bereksi, contohnya disini count. ketika count berekasi maka $derived() akan ter teriger dan bereaksi
  let total = $derived(count.reduce((a, b) => a + b, 0));

  function increment() {
    count.push(1);
  }
</script>



<h1>{count.join(" + ")} = {total}</h1>

<button type="button" class="counter" onclick={increment}>Add</button>
