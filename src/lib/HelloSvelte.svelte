<!--
  Scoped Style
  Selain menggunakan attribute style, kita juga bisa menggunakan tag style pada template untuk membuat style pada komponen yang kita buat
  Namun perlu diketahui, bahwa style yang kita buat dalam komponen hanya bisa digunakan pada komponen tersebut saja.
  Artinya kita bisa membuat nama CSS class yang sama pada komponen yang berbeda tanpa harus takut jadi bentrok namanya.
 -->

<style>
  .btn {
    background-color: aquamarine;
    width: 10%;
    color: black;
  }

</style>



<!--
  Style
  Saat membuat element, kadang kita perlu menambahkan CSS Style pada element tersebut
  Kita bisa menggunakan attribute style pada Element

  style:<css property> = value
 -->
<h1 style:color="green">
  Hello Asu
</h1>

<button class="btn">Click me</button>
