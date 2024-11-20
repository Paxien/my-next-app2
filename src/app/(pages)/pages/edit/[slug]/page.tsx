import EditPageForm from './EditPageForm';
import { headers } from 'next/headers';

interface PageParams {
  params: {
    slug: string;
  };
}

async function getPageData(slug: string) {
  const headersList = headers();
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const host = headersList.get('host') || '';
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/api/pages/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch page data');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching page:', error);
    return {
      title: '',
      content: ''
    };
  }
}

export default async function EditPage({ params }: PageParams) {
  const pageData = await getPageData(params.slug);
  return <EditPageForm slug={params.slug} initialData={pageData} baseUrl="" />;
}
