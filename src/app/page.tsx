import Link from 'next/link';

async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/categories`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Spirare</h1>
          <p className="text-xl text-gray-600">
            Escolha uma categoria para iniciar sua jornada de meditação
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nenhuma categoria disponível no momento.</p>
            <p className="text-sm text-gray-500">
              Por favor, popule o banco de dados através do painel administrativo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category: { category: string; title: string; description: string }) => (
              <Link
                key={category.category}
                href={`/${category.category}`}
                className="group block p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {category.title}
                </h2>
                {category.description && (
                  <p className="text-gray-600 line-clamp-3">
                    {category.description}
                  </p>
                )}
                <div className="mt-4 flex items-center text-indigo-600 font-medium">
                  <span>Explorar</span>
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/admin"
            className="inline-block text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Painel Administrativo
          </Link>
        </div>
      </div>
    </div>
  );
}