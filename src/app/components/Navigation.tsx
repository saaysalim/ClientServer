export default function Navigation() {
  return (
    <nav className="bg-[#0d3b66] text-white">
      <div className="px-6 py-4">
        <div className="flex gap-6 mb-3">
          <a href="#" className="hover:text-gray-300 transition-colors">Home</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Courses</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Feedback</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Video</a>
        </div>
        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:text-gray-300 transition-colors">English</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Arabic</a>
          <a href="#" className="hover:text-gray-300 transition-colors">French</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Farsi</a>
        </div>
      </div>
    </nav>
  );
}
