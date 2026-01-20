const TEMAS = [
  { label: "Alienação Fiduciária", file: "alienacao_fiduciaria.html" },
  { label: "Anticrese", file: "anticrese.html" },
  { label: "Área de Reserva Legal e Área de Preservação Permanente", file: "area_reserva_legal_app.html" },
  { label: "Averbação Premonitórias", file: "averbacao_premonitorias.html" },
  { label: "Cartas de Arrematação, de Adjudicação, de Adjudicação e de Homologação de Sentença Estrangeira", file: "cartas_arrematacao_adjudicacao_sentenca_estrangeira.html" },
  { label: "Cédulas de Crédito", file: "cedulas_credito.html" },
  { label: "Citações em Ações Reais e Ações Pessoais Reipersecutórias", file: "citacoes_acoes_reais_reipersecutorias.html" },
  { label: "Compromisso de Compra e Venda", file: "compromisso_compra_venda.html" },
  { label: "Compra e Venda", file: "compra_venda.html" },
  { label: "Constrições Judiciais: Penhora, Arresto e Sequestro", file: "constricoes_judiciais_penhora_arresto_sequestro.html" },
  { label: "Contrato de Locação de Prédios com Cláusula de Vigência", file: "contrato_locacao_vigencia.html" },
  { label: "Dação em Pagamento", file: "dacao_pagamento.html" },
  { label: "Doação", file: "doacao.html" },
  { label: "Enfiteuse", file: "enfiteuse.html" },
  { label: "Hipoteca", file: "hipoteca.html" },
  { label: "Imissão Provisória na Posse", file: "imissao_provisoria_posse.html" },
  { label: "Incorporações, Instituições e Convenções Condominiais", file: "incorporacoes_condominio.html" },
  { label: "Parcelamento do Solo (loteamento e desmembramento)", file: "parcelamento_solo_loteamento_desmembramento.html" },
  { label: "Penhor de Máquina e Aparelhos", file: "penhor_maquina_aparelhos.html" },
  { label: "Penhor Rural", file: "penhor_rural.html" },
  { label: "Permuta", file: "permuta.html" },
  { label: "Procedimento de Dúvida Imobiliária (Cap. XX, das NSCGJSP).", file: "procedimento_duvida_imobiliaria.html" },
  { label: "Servidões Prediais", file: "servidoes_prediais.html" },
  { label: "Títulos Judiciais", file: "titulos_judiciais.html" },
  { label: "Títulos oriundos de Inventários ou Arrolamentos", file: "titulos_inventarios_arrolamentos.html" },
  { label: "Tombamento", file: "tombamento.html" },
  { label: "Usucapião", file: "usucapiao.html" },
  { label: "Usufruto, Uso e Habitação", file: "usufruto_uso_habitacao.html" }
];

function el(id){
  return document.getElementById(id);
}

async function carregarTema(file, label){
  const content = el("topicContent");

  content.innerHTML = `
    <div class="topic-box">
      <h2 class="topic-title">${label}</h2>
      <div class="topic-text">Carregando conteúdo...</div>
    </div>
  `;

  try{
    const res = await fetch(`topics/${file}`);
    if(!res.ok){
      throw new Error("Arquivo do tema não encontrado (topics/).");
    }

    const html = await res.text();

    content.innerHTML = `
      <div class="topic-box">
        <h2 class="topic-title">${label}</h2>
        <div class="topic-text">
          <div class="book">
            ${html}
          </div>
        </div>
      </div>
    `;
  }catch(err){
    content.innerHTML = `
      <div class="topic-box">
        <h2 class="topic-title">${label}</h2>
        <div class="topic-text">
          Não foi possível carregar o conteúdo deste tema.<br><br>
          <span style="color:#6b6b6b;">Detalhe: ${err.message}</span>
        </div>
      </div>
    `;
  }
}

function preencherSelect(){
  const select = el("temaSelect");

  TEMAS.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.file;
    opt.textContent = t.label;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const file = select.value;

    if(!file){
      el("topicContent").innerHTML = `
        <div class="placeholder">
          <p class="placeholder-title">Selecione um tema para visualizar o conteúdo</p>
          <p class="placeholder-subtitle">
            A navegação está organizada por tópicos em ordem alfabética para facilitar a consulta.
          </p>
        </div>
      `;
      return;
    }

    const tema = TEMAS.find(x => x.file === file);
    carregarTema(tema.file, tema.label);
  });
}

function bindBotoes(){
  el("btnLimpar").addEventListener("click", () => {
    el("temaSelect").value = "";

    el("topicContent").innerHTML = `
      <div class="placeholder">
        <p class="placeholder-title">Selecione um tema para visualizar o conteúdo</p>
        <p class="placeholder-subtitle">
          A navegação está organizada por tópicos em ordem alfabética para facilitar a consulta.
        </p>
      </div>
    `;
  });

  el("btnTopo").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  preencherSelect();
  bindBotoes();
});
