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

function renderPage(pageNumber) {
  pdfDoc.getPage(pageNumber).then(page => {
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    container.appendChild(canvas);

    page.render({ canvasContext: context, viewport });

    page.getTextContent().then(textContent => {
      const textDiv = document.createElement('div');
      textDiv.style.display = 'none';

      textContent.items.forEach(item => {
        const span = document.createElement('span');
        span.textContent = item.str;
        textDiv.appendChild(span);
      });

      textLayers.push(textDiv);
    });
  });
}

/* Busca com highlight */
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();

  textLayers.forEach(layer => {
    layer.querySelectorAll('span').forEach(span => {
      span.classList.remove('highlight');
      if (term && span.textContent.toLowerCase().includes(term)) {
        span.classList.add('highlight');
      }
    });
  });
});

/* Botão subir */
window.addEventListener('scroll', () => {
  btnTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});

btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
