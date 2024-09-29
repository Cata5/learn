import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  const { filename } = params;

  // Construct the path to the JSON file
  const filePath = path.join(process.cwd(), 'public', 'test', `${filename}.json`);

  try {
    // Read the JSON file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response('File not found', { status: 404 });
  }
}
