import { ArrowLeftRight } from 'lucide-react';
// Note: Figma asset reference removed - not available at build time
// import architectureImage from 'figma:asset/7706405716452dd00e852ba67c915585f47ef04d.png';

export default function ArchitectureDiagram() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-3xl text-center mb-6 text-[#0d3b66]">N-Tier Architecture Model</h2>
      
      {/* Architecture Image - Figma asset not available at build time
      <div className="mb-8 flex justify-center">
        <img 
          src={architectureImage} 
          alt="N-Tier Architecture" 
          className="max-w-full h-auto rounded-lg shadow-md"
        />
      </div>
      */}

      {/* Interactive Architecture Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
        <ArchitectureLayer
          title="Client Layer"
          description="Web Browser"
          color="bg-blue-100"
          items={['React UI', 'User Interface', 'Media Upload']}
        />
        
        <div className="flex items-center justify-center">
          <ArrowLeftRight className="text-gray-400" size={32} />
        </div>
        
        <ArchitectureLayer
          title="Presentation Layer"
          description="API Gateway"
          color="bg-purple-100"
          items={['REST APIs', 'Authentication', 'Response Formatting']}
        />
        
        <div className="flex items-center justify-center">
          <ArrowLeftRight className="text-gray-400" size={32} />
        </div>
        
        <ArchitectureLayer
          title="Business Layer"
          description="Application Logic"
          color="bg-green-100"
          items={['Media Processing', 'Collaboration Rules', 'Workflow Engine']}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center">
          <ArrowLeftRight className="text-gray-400" size={32} />
        </div>
        
        <ArchitectureLayer
          title="Integration Layer"
          description="Service Integration"
          color="bg-yellow-100"
          items={['External APIs', 'Cross-border Services', 'Media Streaming']}
        />
        
        <div className="flex items-center justify-center">
          <ArrowLeftRight className="text-gray-400" size={32} />
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="w-full md:w-1/3">
          <ArchitectureLayer
            title="Data Layer"
            description="Database"
            color="bg-red-100"
            items={['Media Storage', 'User Data', 'Collaboration Logs']}
          />
        </div>
      </div>
    </div>
  );
}

interface ArchitectureLayerProps {
  title: string;
  description: string;
  color: string;
  items: string[];
}

function ArchitectureLayer({ title, description, color, items }: ArchitectureLayerProps) {
  return (
    <div className={`${color} rounded-lg p-4 border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow`}>
      <h3 className="text-lg mb-2 text-center">{title}</h3>
      <p className="text-sm text-gray-600 text-center mb-3">{description}</p>
      <ul className="text-xs space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
