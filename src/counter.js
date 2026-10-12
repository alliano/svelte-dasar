import { mount }  from "svelte";
import Counter from "./lib/Counter.svelte";
import "./app.css";


const app = mount(Counter, {
  target: document.getElementById("app")
})

export default app;
