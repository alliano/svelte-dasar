<script>
  const {title, content, footer} = $props();
</script>

<h1>{title}</h1>

<div>
  {@render content()}
</div>

<footer>{footer}</footer>
