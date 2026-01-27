(() => {
  const $ = (id) => document.getElementById(id);

  let pdfBlob = null;
  let pdfFilename = null;

  function normalizar(valor) {
    return (valor || "").replace(/\D/g, "");
  }

  function setStatus(msg, tipo = "muted") {
    const el = $("status");
    el.textContent = msg;
    el.className = `status ${tipo}`;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function emitir() {
    const inscricao = normalizar($("inscricao").value);

    if (!inscricao) {
      setStatus("Informe uma inscrição cadastral válida.", "err");
      return;
    }

    setStatus("Emitindo certidão…", "muted");
    $("btnBaixar").disabled = true;
    pdfBlob = null;

    try {
      const res = await fetch("/api/numeracao-oficial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inscricao })
      });

      if (!res.ok) {
        let msg = `Erro HTTP ${res.status}`;
        try {
          const j = await res.json();
          msg = j.error || j.message || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/pdf")) {
        throw new Error("Resposta não é PDF.");
      }

      pdfBlob = await res.blob();
      pdfFilename = `certidao_numeracao_${inscricao}.pdf`;

      $("btnBaixar").disabled = false;
      setStatus("Certidão emitida com sucesso. Clique em “Baixar PDF”.", "ok");

    } catch (e) {
      setStatus(`Não foi possível emitir a Certidão de Numeração Oficial.\n\n${e.message}`, "err");
    }
  }

  function baixar() {
    if (!pdfBlob) {
      setStatus("Primeiro emita a certidão.", "err");
      return;
    }
    downloadBlob(pdfBlob, pdfFilename);
  }

  function limpar() {
    $("inscricao").value = "";
    pdfBlob = null;
    pdfFilename = null;
    $("btnBaixar").disabled = true;
    setStatus("Preencha a inscrição cadastral e clique em “Emitir certidão”.", "muted");
  }

  function init() {
    $("btnEmitir").addEventListener("click", emitir);
    $("btnBaixar").addEventListener("click", baixar);
    $("btnLimpar").addEventListener("click", limpar);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
