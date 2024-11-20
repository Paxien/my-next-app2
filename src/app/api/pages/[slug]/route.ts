import { NextResponse } from 'next/server';
import { readFile, writeFile, unlink, rm } from 'fs/promises';
import { join } from 'path';

// GET /api/pages/[slug]
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const pagePath = join(process.cwd(), 'src/app/(pages)', params.slug, 'page.tsx');
    const content = await readFile(pagePath, 'utf-8');
    
    // Extract title and content from the file
    const titleMatch = content.match(/h1[^>]*>([^<]+)</);
    const contentMatch = content.match(/prose[^>]*>([^<]+)</);
    
    return NextResponse.json({
      title: titleMatch ? titleMatch[1] : '',
      content: contentMatch ? contentMatch[1] : '',
    });
  } catch (error) {
    console.error('Error reading page:', error);
    return NextResponse.json(
      { error: 'Failed to read page' },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[slug]
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { title, content } = await request.json();
    const pagePath = join(process.cwd(), 'src/app/(pages)', params.slug, 'page.tsx');
    
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

    await writeFile(pagePath, pageContent);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[slug]
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const pageDir = join(process.cwd(), 'src/app/(pages)', params.slug);
    await rm(pageDir, { recursive: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
