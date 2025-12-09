import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  link?: string;
  icon?: string;
}

export default function ServiceCard({ title, description, link, icon }: ServiceCardProps) {
  const content = (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200">
      {icon && (
        <div className="text-4xl mb-4">{icon}</div>
      )}
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      {link && (
        <div className="mt-4 text-blue-600 font-semibold">
          بیشتر بخوانید ←
        </div>
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}
