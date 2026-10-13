<script>

  import {counter} from "../state/counter.svelte.js"

  function increment() {
    counter.count++;
  }
</script>


<button onclick={increment}>Increment : {counter.count}</button>
