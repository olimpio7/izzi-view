const btn = document.getElementById("theme-toggle");
const body = document.body;

btn.addEventListener("click", () => {
  body.classList.toggle("dark");          // alterna a classe dark
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
  
  // atualiza rodapé (caso você tenha a função no main.js)
  if (typeof applyDarkModeFooter === "function") applyDarkModeFooter();
});
