import { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import MediaCentersPage from './components/MediaCentersPage';
import CollaborationPage from './components/CollaborationPage';
import UploadPage from './components/UploadPage';
import AnalyticsPage from './components/AnalyticsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'media':
        return <MediaCentersPage />;
      case 'collaboration':
        return <CollaborationPage />;
      case 'upload':
        return <UploadPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
    </div>
  );
}
