<script>
  let {title, content, footer} = $props();
</script>

<h1>{title}</h1>
<p>{@render content()}</p>

<footer>{footer}</footer>
