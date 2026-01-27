const topics = [
  { id: "introducao", title: "Introdução e Finalidade do Registro de Imóveis" },
  { id: "conceitos_basicos", title: "Terreno, Gleba e Lote" },
  { id: "modificacoes_imovel", title: "Modificações na Conformação do Imóvel" },
  { id: "parcelamento_estrutura", title: "Estrutura do Parcelamento do Solo" },
  { id: "decreto_lei_58", title: "Decreto-Lei 58 de 1937" },
  { id: "decreto_lei_271", title: "Decreto-Lei 271 de 1967" },
  { id: "lei_6766", title: "Lei 6.766/1979" },
  { id: "modalidades", title: "Modalidades de Parcelamento" },
  { id: "registro_loteamento", title: "Registro do Loteamento" },
  { id: "loteamento_acesso_controlado", title: "Loteamento de Acesso Controlado" },
  { id: "desmembramento_desdobro", title: "Desmembramento e Desdobro" },
  { id: "certidoes", title: "Certidões e Histórico Vintenário" },
  { id: "conclusao", title: "Conclusão" }
];

const accordion = document.getElementById("accordion");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const backToTop = document.getElementById("backToTop");

topics.forEach(topic => {
  const item = document.createElement("div");
  item.className = "accordion-item";
  item.dataset.topic = topic.id;

  item.innerHTML = `
    <div class="accordion-header">
      <span>${topic.title}</span>
      <span class="arrow">▶</span>
    </div>
    <div class="accordion-content" data-loaded="false"></div>
  `;

  accordion.appendChild(item);
});

accordion.addEventListener("click", async e => {
  const header = e.target.closest(".accordion-header");
  if (!header) return;

  const item = header.parentElement;
  const content = item.querySelector(".accordion-content");

  item.classList.toggle("open");

  if (content.dataset.loaded === "false") {
    const topicId = item.dataset.topic;
    const response = await fetch(`topics/${topicId}.html`);
    content.innerHTML = await response.text();
    content.dataset.loaded = "true";
  }
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();

  document.querySelectorAll(".accordion-item").forEach(item => {
    const content = item.querySelector(".accordion-content");

    if (term && content.dataset.loaded === "true") {
      const text = content.textContent.toLowerCase();
      if (text.includes(term)) {
        item.classList.add("open");
        highlight(content, term);
      }
    }
  });

  if (!term) removeHighlights();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  removeHighlights();
});

function highlight(element, term) {
  const regex = new RegExp(`(${term})`, "gi");
  element.innerHTML = element.innerHTML.replace(regex, `<span class="highlight">$1</span>`);
}

function removeHighlights() {
  document.querySelectorAll(".highlight").forEach(span => {
    span.replaceWith(span.textContent);
  });
}

window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
