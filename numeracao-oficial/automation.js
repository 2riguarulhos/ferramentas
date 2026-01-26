// automation.js - Certidão de Numeração Oficial (PDF direto via Flask send_file)
// ✅ Mostra erro real (details) pra diagnosticar rápido

(() => {
  const $ = (id) => document.getElementById(id);

  let API_BASE = (window.API_BASE || "").trim();

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
      setStatus("API_BASE não configurada.", "err");
      return;
    }

    if (!inscricao) {
      setStatus("Informe uma inscrição cadastral válida.", "err");
      return;
    }

    window.__PDF_BLOB__ = null;
    window.__PDF_FILENAME__ = null;
    if (btnBaixar) btnBaixar.disabled = true;

    setStatus("Emitindo certidão…", "muted");

    try {
      const url = `${API_BASE}/api/numeracao-oficial`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inscricao })
      });

      if (!res.ok) {
        let msg = `Erro HTTP ${res.status}`;

        // tenta ler json de erro (seu server.py manda)
        try {
          const err = await res.json();
          const error = err.error || err.message;
          const details = err.details || "";

          if (error && details) msg = `${error}\n\nDetalhes: ${details}`;
          else if (error) msg = error;
        } catch (_) {}

        throw new Error(msg);
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/pdf")) {
        throw new Error("A resposta não veio como PDF. Verifique o backend.");
      }

      const blob = await res.blob();

      window.__PDF_BLOB__ = blob;
      window.__PDF_FILENAME__ = `certidao_numeracao_${inscricao}.pdf`;

      if (btnBaixar) btnBaixar.disabled = false;

      setStatus("Certidão emitida com sucesso. Clique em “Baixar PDF”.", "ok");
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Não foi possível emitir a Certidão de Numeração Oficial.", "err");
    }
  }

  function baixarPDF() {
    const inscricao = normalizeInscricao($("inscricao")?.value);

    if (!window.__PDF_BLOB__) {
      setStatus("Primeiro clique em “Emitir certidão”.", "err");
      return;
    }

    downloadBlob(window.__PDF_BLOB__, window.__PDF_FILENAME__ || `certidao_numeracao_${inscricao}.pdf`);
  }

  function limpar() {
    const input = $("inscricao");
    if (input) input.value = "";

    window.__PDF_BLOB__ = null;
    window.__PDF_FILENAME__ = null;

    const btnBaixar = $("btnBaixar");
    if (btnBaixar) btnBaixar.disabled = true;

    setStatus("Preencha a inscrição cadastral e clique em “Emitir certidão”.", "muted");
  }

  function init() {
    $("btnEmitir")?.addEventListener("click", emitirCertidao);
    $("btnBaixar")?.addEventListener("click", baixarPDF);
    $("btnLimpar")?.addEventListener("click", limpar);

    const btnBaixar = $("btnBaixar");
    if (btnBaixar) btnBaixar.disabled = true;

    setStatus("Preencha a inscrição cadastral e clique em “Emitir certidão”.", "muted");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
