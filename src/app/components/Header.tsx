import { Globe, Menu } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'media', label: 'Media Centers' },
    { id: 'collaboration', label: 'Collaborations' },
    { id: 'upload', label: 'Upload' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <header className="bg-[#0d3b66] text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={32} />
            <div>
              <h1 className="text-2xl">Cross-Border Media Centers</h1>
              <p className="text-sm text-gray-300">Global Collaboration Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`hover:text-gray-300 transition-colors pb-1 ${
                  currentPage === item.id ? 'border-b-2 border-white' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <button className="md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
