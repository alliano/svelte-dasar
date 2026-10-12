import SayHello from "./lib/SayHello.svelte";
import "./app.css";
import { mount } from "svelte";


const app = mount(SayHello, {
 target: document.getElementById("app")
});

export default app;
