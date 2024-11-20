import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    
    // Convert title to kebab case for the folder name
    const folderName = title.toLowerCase().replace(/\s+/g, '-');
    const pagesDir = join(process.cwd(), 'src/app/(pages)', folderName);
    
    // Create the page content
    const pageContent = `export default function ${title.replace(/\s+/g, '')}Page() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">${title}</h1>
        <div className="prose dark:prose-invert">
          ${content}
        </div>
      </div>
    </div>
  );
}`;

    // Create directory and file
    await mkdir(pagesDir, { recursive: true });
    await writeFile(join(pagesDir, 'page.tsx'), pageContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
