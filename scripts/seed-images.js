import { pool } from '../lib/conectarDB.js';
import Scraper from 'images-scraper';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadDir = path.join(__dirname, '..', 'public', 'products');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const scraper = new Scraper({
  puppeteer: {
    headless: true,
  },
});

async function seedImages() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM produtos');

    for (const product of products) {
      try {
        const results = await scraper.scrape(product.nome, 1);

        if (results && results.length > 0) {
          const firstImage = results[0];
          const imageUrl = firstImage.url;
          const imageName = `${product.id}_${path.basename(new URL(imageUrl).pathname)}`;
          const imagePath = path.join(downloadDir, imageName);
          const publicPath = `/products/${imageName}`;

          const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream',
          });

          const writer = fs.createWriteStream(imagePath);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          await connection.query('UPDATE produtos SET imagem = ? WHERE id = ?', [
            publicPath,
            product.id,
          ]);

          console.log(`Imagem para ${product.nome} baixada e salva em ${publicPath}`);
        } else {
          console.log(`Nenhuma imagem encontrada para ${product.nome}, usando placeholder.`);
          await connection.query('UPDATE produtos SET imagem = ? WHERE id = ?', [
            '/products/placeholder.jpg',
            product.id,
          ]);
        }
      } catch (error) {
        console.error(`Erro ao processar o produto ${product.nome}:`, error);
        await connection.query('UPDATE produtos SET imagem = ? WHERE id = ?', [
          '/products/placeholder.jpg',
          product.id,
        ]);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
  } finally {
    if (connection) {
      connection.release();
    }
    pool.end();
  }
}

seedImages();
