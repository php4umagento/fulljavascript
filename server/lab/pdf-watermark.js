const HummusRecipe = require('hummus-recipe');

function createNewPdf(name) {
  const pdfDoc = new HummusRecipe('new', name, {
    version: 1.6,
    author: 'John Doe',
    title: 'Hummus Recipe',
    subject: 'A brand new PDF',
  });

  // pdfDoc
  //   .createPage('letter-size')
  //   .endPage()
  //   .endPDF();

  pdfDoc
  // 1st Page
    .createPage('letter-size')
    .circle('center', 100, 30, { stroke: '#3b7721', fill: '#eee000' })
    .polygon([[50, 250], [100, 200], [512, 200], [562, 250], [512, 300], [100, 300], [50, 250]], {
      color: [153, 143, 32],
      stroke: [0, 0, 140],
      fill: [153, 143, 32],
      lineWidth: 5,
    })
    .rectangle(240, 400, 50, 50, {
      stroke: '#3b7721',
      fill: '#eee000',
      lineWidth: 6,
      opacity: 0.3,
    })
    .moveTo(200, 600)
    .lineTo('center', 650)
    .lineTo(412, 600)
    .text('Welcome to Hummus-Recipe', 'center', 250, {
      color: '066099',
      fontSize: 30,
      bold: true,
      font: 'Helvatica',
      align: 'center center',
      opacity: 0.8,
      rotation: 180,
    })
    .text('some text box', 450, 400, {
      color: '066099',
      fontSize: 20,
      font: 'Courier New',
      strikeOut: true,
      highlight: {
        color: [255, 0, 0],
      },
      textBox: {
        width: 150,
        lineHeight: 16,
        padding: [5, 15],
        style: {
          lineWidth: 1,
          stroke: '#00ff00',
          fill: '#ff0000',
          dash: [20, 20],
          opacity: 0.1,
        },
      },
    })
    .comment('Feel free to open issues to help us!', 'center', 100)
    .endPage()
  // 2nd page
    .createPage('A4', 90)
    .circle(150, 150, 300)
    .endPage()
  // end and save
    .endPDF(() => { /* done! */ });
}

/*
 * Adds watermark on page 1 and half book
 */
function modifyPdf(input, output) {
  const email = 'adriansky@gmail.com';
  const opacity = 0.4;
  const color = '#919191';

  const pdfDoc = new HummusRecipe(input, output);
  // console.log();
  const { metadata } = pdfDoc;
  const pages = Object.keys(metadata).length;
  const middle = Math.floor(pages / 2);
  const { width, height } = metadata['1'];

  const x = width - 170;
  const y = 30;
  const x1 = 20;
  const y1 = height - 70;

  console.log({
    pages, middle, width, height,
  });
  // { pages: 182, middle: 91, width: 595.28, height: 841.89 }

  pdfDoc
    // edit 1st page
    .editPage(1)
    // .text('Add some texts to an existing pdf file', 150, 300)
    // .rectangle(20, 20, 40, 100)
    // .comment('Add 1st comment annotaion', 200, 300)
    .image('../dist/logo.png', x, y, {
      align: 'left center',
      width: 30,
      keepAspectRatio: true,
      opacity: opacity - 0.1,
      // link: 'https://adrianmejia.com', // not implemented: https://github.com/chunyenHuang/hummusRecipe/issues/37
    })
    .text('Sold to', x, y + 35, {
      bold: true,
      align: 'left center',
      color,
      opacity,
    })
    .text(email, x, y + 50, {
      align: 'left center',
      color,
      opacity,
    })
    .endPage()
    // 4th page
    .editPage(middle)
    .text('Sold to', x1, y1 + 50, {
      bold: true,
      align: 'left center',
      color,
      opacity,
    })
    .text(email, x1, y1 + 65, {
      align: 'left center',
      color,
      opacity,
    })
    .endPage()
    // end and save
    .endPDF();
}

// createNewPdf('input.pdf');
// modifyPdf('input.pdf', 'output.pdf');
// modifyPdf('../../dist/book.pdf', '../../output.pdf');
