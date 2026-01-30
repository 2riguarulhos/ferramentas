const article = document.getElementById("article");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

// guarda o texto original inteiro
const originalHTML = article.innerHTML;

// BUSCA
searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim();

  article.innerHTML = originalHTML;

  if (!term) return;

  const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");
  article.innerHTML = article.innerHTML.replace(
    regex,
    `<span class="highlight">$1</span>`
  );
});

// LIMPAR BUSCA
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  article.innerHTML = originalHTML;
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
