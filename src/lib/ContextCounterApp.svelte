<script>
  import ContextCounter from "./ContextCounter.svelte";
  import {setContext} from "svelte";
  const counter = $state({count: 0});

  setContext("counter", counter);
</script>


<ContextCounter/>
<ContextCounter/>
<ContextCounter/>
<ContextCounter/>
