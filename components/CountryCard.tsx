import Link from 'next/link';

interface CountryCardProps {
  name: string;
  flag: string;
  description: string;
  link: string;
  highlights?: string[];
}

export default function CountryCard({ name, flag, description, link, highlights }: CountryCardProps) {
  return (
    <Link href={link}>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-200 h-full hover:scale-105">
        <div className="text-5xl mb-4 text-center">{flag}</div>
        <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center">{name}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        {highlights && highlights.length > 0 && (
          <ul className="space-y-2">
            {highlights.map((highlight, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-green-600 ml-2">✓</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-blue-600 font-semibold text-center">
          اطلاعات بیشتر ←
        </div>
      </div>
    </Link>
  );
}
