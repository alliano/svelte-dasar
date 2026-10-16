<script>
  let {id, done, name} = $props();
</script>

<!-- Cara membuat branching di Svelte -->
{#if done}
  <strike>{id} - {name}</strike>

{:else}
  {id} - {name}

{/if}
