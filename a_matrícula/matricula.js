const url = 'a_matricula.pdf';
let pdfDoc = null;
let pageText = [];

pdfjsLib.getDocument(url).promise.then(pdf => {
  pdfDoc = pdf;
  renderAllPages();
});

async function renderAllPages() {
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.4 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    document.getElementById('viewer').appendChild(canvas);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const text = await page.getTextContent();
    pageText[i] = text.items.map(item => item.str).join(' ');
  }
}

function buscar() {
  const termo = document.getElementById('searchInput').value.toLowerCase();
  if (!termo) return;

  for (let i = 1; i < pageText.length; i++) {
    if (pageText[i] && pageText[i].toLowerCase().includes(termo)) {
      alert(`Encontrado na página ${i}`);
      break;
    }
  }
}
