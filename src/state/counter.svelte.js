// Global State atau universal state
// jika kita pernah beljar Reac atau Vue, State biasanya hanya bisa digunakna di component sebagai local state
// Namun Svelte berbeda, di svelte kita bisa menggunakan State diluar component dan bisa digunakan oleh lebih dari 1 component
// hal ini menjadikan state di Svelte menjadi global state
// Keuntunganya adalah kita tidak perlu lagi menggunakan global state management seperti di Reac atau Vue
// Namun perlu kamu ingat bahwa Rune hanya bisa digunakan di file svelte, jadi kita bisa buat dengan svelte.js
export const counter = $state({
 count: 0
});
