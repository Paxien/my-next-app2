
"use client"
// src/app/pages/ce-2/page.tsx
import Head from 'next/head';
import React from 'react';


const Ce2Page = () => {
  const [selectedResource, setSelectedResource] = React.useState(null);
  const resources = [
    { id: 1, name: 'Resource 1', description: 'Description 1' },
    { id: 2, name: 'Resource 2', description: 'Description 2' },
  ];

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
  };

  return (
    <div className="min-h-screen p-8">
      <Head>
        <title>ce 2</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md p-4">
        <h1 className="text-4xl font-bold mb-4">ce 2</h1>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-md mb-4">
          <h2 className="text-2xl font-bold mb-2">Summary</h2>
          <p className="prose dark:prose-invert">c2 e</p>
        </div>
        <div className="bg-white dark:bg-gray-600 p-4 rounded shadow-md mb-4">
          <h2 className="text-2xl font-bold mb-2">Key Takeaways</h2>
          <ul className="list-disc ml-4">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-md mb-4">
          <h2 className="text-2xl font-bold mb-2">Additional Resources</h2>
          <ul className="list-disc ml-4">
            {resources.map((resource) => (
              <li key={resource.id}>
                <a
                  href="#"
                  onClick={() => handleResourceClick(resource)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  {resource.name}
                </a>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-600 p-4 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-2">Downloadable Assets</h2>
          <ul className="list-none p-0 m-0">
            {resources.map((resource) => (
              <li key={resource.id}>
                <button
                  onClick={() => console.log(`Downloaded ${resource.name}`)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 font-bold py-2 px-4 rounded"
                >
                  {resource.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {selectedResource && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Selected Resource:</h2>
            <p className="text-lg font-bold">{selectedResource.name}</p>
            <p className="text-sm text-gray-600">{selectedResource.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ce2Page;
