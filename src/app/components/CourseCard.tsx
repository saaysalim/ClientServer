interface CourseCardProps {
  title: string;
  description: string;
}

export default function CourseCard({ title, description }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-6 max-w-4xl mx-auto">
      <h2 className="text-2xl text-[#2196F3] text-center mb-3">{title}</h2>
      <p className="text-gray-600 text-center mb-6">{description}</p>
      <div className="flex justify-center">
        <button className="bg-[#0d3b66] text-white px-6 py-2 rounded hover:bg-[#1a5080] transition-colors">
          View Course
        </button>
      </div>
    </div>
  );
}
