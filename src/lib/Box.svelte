<script>
  class Box {
    width = $state(0);
    height = $state(0);
    area = $derived(this.width * this.height);
  }

  const box = new Box();
</script>

<div>
  Width: <input type="range" min="0" max="500" bind:value={box.width}>
  Height: <input type="range" min="0" max="500" bind:value={box.height}>
</div>

<div style:width="{box.width}px" style:height="{box.height}px" style:background-color="blue">
  <p>Box Area: {box.area}</p>
</div>
