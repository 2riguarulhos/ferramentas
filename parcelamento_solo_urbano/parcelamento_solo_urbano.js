const topics = [
  { id: "introducao", title: "Introdução" },
  { id: "conceitos_basicos", title: "Terreno, Gleba e Lote" },
  { id: "modificacoes_imovel", title: "Modificações do Imóvel" },
  { id: "parcelamento_estrutura", title: "Estrutura do Parcelamento" },
  { id: "decreto_lei_58", title: "Decreto-Lei 58/1937" },
  { id: "decreto_lei_271", title: "Decreto-Lei 271/1967" },
  { id: "lei_6766", title: "Lei 6.766/1979" },
  { id: "modalidades", title: "Modalidades" },
  { id: "registro_loteamento", title: "Registro do Loteamento" },
  { id: "competencia_circunscricao", title: "Circunscrição" },
  { id: "controle_registral_aprovacoes", title: "Controle Registral" },
  { id: "loteamento_acesso_controlado", title: "Acesso Controlado" },
  { id: "desmembramento_desdobro", title: "Desmembramento / Desdobro" },
  { id: "certidoes_historico_vintenario", title: "Histórico Vintenário" },
  { id: "certidoes_impeditivas", title: "Certidões Impeditivas" },
  { id: "certidoes_nao_impeditivas", title: "Certidões Não Impeditivas" },
  { id: "conclusao", title: "Conclusão" },
  { id: "resumo_pratico", title: "Resumo Prático" }
];

const accordion = document.getElementById("accordion");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

// CRIA ACCORDION
topics.forEach(topic => {
  const item = document.createElement("div");
  item.className = "accordion-item";
  item.id = topic.id;

  item.innerHTML = `
    <div class="accordion-header">
      <span>${topic.title}</span>
      <span class="arrow">▶</span>
    </div>
    <div class="accordion-content" data-loaded="false"></div>
  `;

  accordion.appendChild(item);
});

// ABRIR / FECHAR
accordion.addEventListener("click", async e => {
  const header = e.target.closest(".accordion-header");
  if (!header) return;

  const item = header.parentElement;
  const content = item.querySelector(".accordion-content");

  item.classList.toggle("open");

  if (item.classList.contains("open") && content.dataset.loaded === "false") {
    const res = await fetch(`topics/${item.id}.html`);
    const html = await res.text();

    content.innerHTML = html;
    content.dataset.original = html; // 🔑 salva o original
    content.dataset.loaded = "true";
  }
});

// BUSCA
searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();

  document.querySelectorAll(".accordion-item").forEach(item => {
    const content = item.querySelector(".accordion-content");

    if (content.dataset.loaded !== "true") return;

    // sempre restaura o texto original
    content.innerHTML = content.dataset.original;

    if (!term) return;

    const text = content.textContent.toLowerCase();
    if (text.includes(term)) {
      item.classList.add("open");
      highlight(content, term);
    }
  });
});

// LIMPAR BUSCA
clearSearch.addEventListener("click", () => {
  searchInput.value = "";

  document.querySelectorAll(".accordion-content").forEach(content => {
    if (content.dataset.loaded === "true") {
      content.innerHTML = content.dataset.original;
    }
  });
});

// HIGHLIGHT SEGURO
function highlight(container, term) {
  const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");

  container.innerHTML = container.innerHTML.replace(
    regex,
    `<span class="highlight">$1</span>`
  );
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
