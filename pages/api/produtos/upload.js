import path from 'path';
import formidable from 'formidable';
import mv from 'mv';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error processing file upload.' });
    }

    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const oldPath = files.file[0].filepath;
    const productName = fields.productName ? fields.productName[0] : 'produto';
    const fileSize = files.file[0].size;
    const fileExt = path.extname(files.file[0].originalFilename);

    // Sanitize the product name to create a URL-friendly slug
    const slug = productName
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text

    const newFilename = `${slug}-${fileSize}${fileExt}`;
    const newPath = path.join(process.cwd(), 'public', 'products', newFilename);

    mv(oldPath, newPath, { mkdirp: true }, err => {
      if (err) {
        console.error('Error moving file:', err);
        return res.status(500).json({ error: 'Failed to save the file.' });
      }
      const imageUrl = `/products/${newFilename}`;
      res.status(200).json({ message: 'File uploaded successfully.', imageUrl });
    });
  });
}
