const PDF_URL = 'a_matricula.pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');
const searchInput = document.getElementById('searchInput');
const btnTop = document.getElementById('btnTop');

let pdfDoc = null;
let currentPage = 1;
let scale = 1.4;
let textContentGlobal = '';

async function loadPDF() {
  pdfDoc = await pdfjsLib.getDocument(PDF_URL).promise;
  renderPage(currentPage);
}

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: ctx,
    viewport
  }).promise;

  const textContent = await page.getTextContent();
  textContentGlobal = textContent.items.map(i => i.str).join(' ');
}

searchInput.addEventListener('input', () => {
  const termo = searchInput.value.trim();
  if (!termo) {
    renderPage(currentPage);
    return;
  }
  highlightText(termo);
});

function highlightText(termo) {
  renderPage(currentPage).then(() => {
    ctx.fillStyle = 'rgba(255, 245, 157, 0.6)';
    ctx.font = '16px serif';

    const regex = new RegExp(termo, 'gi');
    let match;
    let y = 40;

    while ((match = regex.exec(textContentGlobal)) !== null) {
      ctx.fillRect(20, y, canvas.width - 40, 22);
      y += 26;
    }
  });
}

window.addEventListener('scroll', () => {
  btnTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});

btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

loadPDF();
