interface MentorCardProps {
  name: string;
  title: string;
  expertise: string;
  bio: string;
  image?: string;
}

export default function MentorCard({ name, title, expertise, bio }: MentorCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {name.charAt(0)}
        </div>
        <div className="mr-4">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
      <div className="mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {expertise}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{bio}</p>
    </div>
  );
}
