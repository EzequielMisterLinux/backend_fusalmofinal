import ProductModel from '../../models/product/productModel.js';
import puppeteer from 'puppeteer';
import dotenv from "dotenv";
dotenv.config();

let URL = process.env.HOST

const generarReporte = async (req, res) => {
  const { categoria, subcategoria, stock } = req.query;
  try {
    const query = {};
    if (categoria) {
      query.categoryId = categoria;
    }
    if (subcategoria) {
      query.subCategoryId = subcategoria;
    }
    if (stock) {
      query.stock = { $gte: Number(stock) };
    }

    const productos = await ProductModel.find(query).populate('categoryId').populate('subCategoryId');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de productos</title>
      </head>
      <body>
        <h1>Reporte de productos</h1>
        <p>Categoría: ${categoria || 'Todas'}</p>
        <p>Subcategoría: ${subcategoria || 'Todas'}</p>
        <p>Nivel mínimo de stock: ${stock || 'N/A'}</p>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Categoría</th>
              <th>Subcategoría</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map(producto => `
              
              <tr>
                <td>${producto.name}</td>
                <td>${producto.description}</td>
                <td>${producto.brand}</td>
                <td>${producto.price.toFixed(2)}</td>
                <td>
  ${producto.image ? `<img src="http://localhost:3000${producto.image}" alt="${producto.name}" width="50" height="50"/>` : 'No image'}
</td>
                <td>${producto.categoryId?.category}</td>
                <td>${producto.subCategoryId?.subcategory}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const pdfFilename = `reporte-${timestamp}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${pdfFilename}`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar el reporte:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export default generarReporte;
