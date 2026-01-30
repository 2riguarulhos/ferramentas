const url = 'a_matricula.pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const container = document.getElementById('pdf-container');
const searchInput = document.getElementById('searchInput');
const btnTop = document.getElementById('btnTop');

let pdfDoc = null;
let textLayers = [];

pdfjsLib.getDocument(url).promise.then(pdf => {
  pdfDoc = pdf;

  for (let i = 1; i <= pdf.numPages; i++) {
    renderPage(i);
  }
});

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const scale = 1.4;
    const viewport = page.getViewport({ scale });

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    wrapper.appendChild(canvas);
    container.appendChild(wrapper);

    page.render({
      canvasContext: ctx,
      viewport
    });

    page.getTextContent().then(textContent => {
      const textLayer = document.createElement('div');
      textLayer.className = 'textLayer';
      textLayer.style.width = canvas.width + 'px';
      textLayer.style.height = canvas.height + 'px';

      wrapper.appendChild(textLayer);

      pdfjsLib.renderTextLayer({
        textContent,
        container: textLayer,
        viewport,
        textDivs: []
      });

      textLayers.push(textLayer);
    });
  });
}

/* BUSCA COM HIGHLIGHT */
searchInput.addEventListener('input', () => {
  const termo = searchInput.value.toLowerCase();

  textLayers.forEach(layer => {
    layer.querySelectorAll('span').forEach(span => {
      span.classList.remove('highlight');

      if (termo && span.textContent.toLowerCase().includes(termo)) {
        span.classList.add('highlight');
      }
    });
  });
});

/* BOTÃO SUBIR */
window.addEventListener('scroll', () => {
  btnTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});

btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
