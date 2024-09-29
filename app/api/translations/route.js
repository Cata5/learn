import fs from 'fs';
import path from 'path';

export async function GET() {
  const directoryPath = path.join(process.cwd(), 'public', 'test');

  try {
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));
    const fileNames = files.map(file => file.replace('.json', ''));
    
    return new Response(JSON.stringify(fileNames), { status: 200 });
  } catch (error) {
    return new Response('Error reading directory', { status: 500 });
  }
}
