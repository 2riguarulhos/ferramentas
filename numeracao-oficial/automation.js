// automation.js - Certidão de Numeração Oficial

(() => {
  const $ = (id) => document.getElementById(id);

  let API_BASE = "";

  function normalizeInscricao(value) {
    return (value || "").toString().replace(/\D/g, "").trim();
  }

  function setStatus(msg, type = "muted") {
    const el = $("status");
    if (!el) return;

    el.textContent = msg || "";

    el.classList.remove("status-muted", "status-ok", "status-err");
    if (type === "ok") el.classList.add("status-ok");
    else if (type === "err") el.classList.add("status-err");
    else el.classList.add("status-muted");
  }

  function setApiLabel() {
    const el = $("apiLabel");
    if (!el) return;

    const span = el.querySelector(".apiValue");
    if (!span) return;

    span.textContent = API_BASE || "(não configurada)";
  }

  async function postJSON(path, body) {
    const url = `${API_BASE}${path}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (_) {}

    if (!res.ok) {
      const msg = (data && (data.error || data.message)) || `Erro HTTP ${res.status}`;
      throw new Error(msg);
    }

    if (!data) {
      throw new Error("Resposta inválida da API (não veio JSON).");
    }

    return data;
  }

  function b64toBlob(base64, contentType = "application/pdf") {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    const sliceSize = 512;
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "certidao.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function emitirCertidao() {
    const inscricao = normalizeInscricao($("inscricao")?.value);
    const btnBaixar = $("btnBaixar");

    if (!API_BASE) {
      setStatus("API não configurada. Verifique o data-api no topo da página.", "err");
      return;
    }

    if (!inscricao) {
      setStatus("Informe uma inscrição cadastral válida.", "err");
      return;
    }

    if (btnBaixar) btnBaixar.disabled = true;
    window.__PDF_BASE64__ = null;
    window.__PDF_URL__ = null;

    setStatus("Emitindo certidão…", "muted");

    try {
      // 🔥 AJUSTE AQUI: a rota tem que ser a REAL (igual Valor Venal)
      const data = await postJSON("/api/numeracao-oficial", {
  inscricao: inscricao
      });

      if (data.ok === false) {
        throw new Error(data.message || "Não foi possível emitir a Certidão de Numeração Oficial.");
      }

      if (data.pdf_base64) {
        window.__PDF_BASE64__ = data.pdf_base64;
        window.__PDF_FILENAME__ = data.filename || `certidao_numeracao_${inscricao}.pdf`;
        if (btnBaixar) btnBaixar.disabled = false;
        setStatus("Certidão emitida com sucesso. Clique em “Baixar PDF”.", "ok");
        return;
      }

      if (data.pdf_url) {
        window.__PDF_URL__ = data.pdf_url;
        window.__PDF_FILENAME__ = data.filename || `certidao_numeracao_${inscricao}.pdf`;
        if (btnBaixar) btnBaixar.disabled = false;
        setStatus("Certidão emitida com sucesso. Clique em “Baixar PDF”.", "ok");
        return;
      }

      throw new Error("A API respondeu, mas não retornou PDF (base64/url).");
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Não foi possível emitir a Certidão de Numeração Oficial.", "err");
    }
  }

  async function baixarPDF() {
    const inscricao = normalizeInscricao($("inscricao")?.value);

    if (window.__PDF_BASE64__) {
      const blob = b64toBlob(window.__PDF_BASE64__, "application/pdf");
      downloadBlob(blob, window.__PDF_FILENAME__ || `certidao_numeracao_${inscricao}.pdf`);
      return;
    }

    if (window.__PDF_URL__) {
      window.open(window.__PDF_URL__, "_blank");
      return;
    }

    setStatus("Primeiro clique em “Emitir certidão”.", "err");
  }

  function limpar() {
    const input = $("inscricao");
    if (input) input.value = "";

    window.__PDF_BASE64__ = null;
    window.__PDF_URL__ = null;
    window.__PDF_FILENAME__ = null;

    const btnBaixar = $("btnBaixar");
    if (btnBaixar) btnBaixar.disabled = true;

    setStatus("Preencha a inscrição cadastral e clique em “Emitir certidão”.", "muted");
  }

  function init() {
    const apiEl = $("apiLabel");
    API_BASE = apiEl?.dataset?.api ? apiEl.dataset.api.trim() : "";

    setApiLabel();

    $("btnEmitir")?.addEventListener("click", emitirCertidao);
    $("btnBaixar")?.addEventListener("click", baixarPDF);
    $("btnLimpar")?.addEventListener("click", limpar);

    // Estado inicial
    const btnBaixar = $("btnBaixar");
    if (btnBaixar) btnBaixar.disabled = true;
    setStatus("Preencha a inscrição cadastral e clique em “Emitir certidão”.", "muted");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
