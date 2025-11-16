const btn = document.getElementById("theme-toggle");
const body = document.body;

btn.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
  
  // atualiza rodapé
  if (typeof applyDarkModeFooter === "function") applyDarkModeFooter();
});
