(() => {
  const API_BASE = "http://192.168.0.37:5002";

  const $ = (id) => document.getElementById(id);

  let pdfBlob = null;
  let pdfName = null;

  function setStatus(msg) {
    $("status").textContent = msg;
  }

  function normalize(v) {
    return (v || "").replace(/\D/g, "");
  }

  async function emitir() {
    const inscricao = normalize($("inscricao").value);

    if (!inscricao) {
      setStatus("Inscrição inválida.");
      return;
    }

    setStatus("Emitindo certidão...");
    $("btnBaixar").disabled = true;

    try {
      const res = await fetch(`${API_BASE}/api/numeracao-oficial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inscricao })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro desconhecido");
      }

      pdfBlob = await res.blob();
      pdfName = `certidao_numeracao_${inscricao}.pdf`;

      $("btnBaixar").disabled = false;
      setStatus("Certidão emitida com sucesso.");

    } catch (e) {
      setStatus("Erro: " + e.message);
    }
  }

  function baixar() {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function limpar() {
    $("inscricao").value = "";
    $("btnBaixar").disabled = true;
    pdfBlob = null;
    setStatus("Preencha a inscrição e clique em Emitir.");
  }

  function init() {
    $("btnEmitir").onclick = emitir;
    $("btnBaixar").onclick = baixar;
    $("btnLimpar").onclick = limpar;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
