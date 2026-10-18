import { mount } from "svelte";
import "./app.css";
import ContextCounter from "./lib/ContextCounterApp.svelte";

const app = mount(ContextCounter, {
 target: document.getElementById("app")
});

export default app;
