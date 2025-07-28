import React, { useState } from 'react';
import { X, Ruler, User, Calculator, Phone, MessageCircle } from 'lucide-react';

interface SizeGuideModalProps {
  onClose: () => void;
  productType?: 'suit' | 'shirt' | 'general';
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ onClose, productType = 'suit' }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'calculator' | 'video'>('chart');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    height: '',
    weight: '',
  });
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  
  const calculateSize = () => {
    const chest = parseFloat(measurements.chest);
    const height = parseFloat(measurements.height);
    
    if (!chest || !height) return;
    
    // Simple size calculation logic
    let baseSize = '';
    if (chest <= 36) baseSize = '36';
    else if (chest <= 38) baseSize = '38';
    else if (chest <= 40) baseSize = '40';
    else if (chest <= 42) baseSize = '42';
    else if (chest <= 44) baseSize = '44';
    else if (chest <= 46) baseSize = '46';
    else if (chest <= 48) baseSize = '48';
    else if (chest <= 50) baseSize = '50';
    else baseSize = '52';
    
    // Determine length
    let length = '';
    if (height <= 67) length = 'S'; // 5ft7in and under
    else if (height <= 73) length = 'R'; // 5ft8in to 6ft1in
    else length = 'L'; // 6ft2in and over
    
    setRecommendedSize(`${baseSize}${length}`);
  };

  const modalContentStyle = {
    maxHeight: 'calc(90vh - 200px)'
  };
  
  const modalStyle = {
    maxHeight: '90vh'
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full overflow-hidden" style={modalStyle}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Find Your Perfect Size</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('chart')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'chart'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Ruler className="inline-block w-4 h-4 mr-2" />
              Size Chart
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'calculator'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="inline-block w-4 h-4 mr-2" />
              Size Calculator
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'video'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="inline-block w-4 h-4 mr-2" />
              How to Measure
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto" style={modalContentStyle}>
          {activeTab === 'chart' && (
            <div className="space-y-8">
              {/* Suit Measurements */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Suit Jacket Measurements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-medium">US Size</th>
                        <th className="text-left p-3 font-medium">EU Size</th>
                        <th className="text-left p-3 font-medium">UK Size</th>
                        <th className="text-left p-3 font-medium">Chest (in)</th>
                        <th className="text-left p-3 font-medium">Waist (in)</th>
                        <th className="text-left p-3 font-medium">Shoulder (in)</th>
                        <th className="text-left p-3 font-medium">Sleeve (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { us: '34', eu: '44', uk: '34', chest: '34', waist: '28', shoulder: '16.5', sleeve: '31' },
                        { us: '36', eu: '46', uk: '36', chest: '36', waist: '30', shoulder: '17', sleeve: '32' },
                        { us: '38', eu: '48', uk: '38', chest: '38', waist: '32', shoulder: '17.5', sleeve: '33' },
                        { us: '40', eu: '50', uk: '40', chest: '40', waist: '34', shoulder: '18', sleeve: '34' },
                        { us: '42', eu: '52', uk: '42', chest: '42', waist: '36', shoulder: '18.5', sleeve: '35' },
                        { us: '44', eu: '54', uk: '44', chest: '44', waist: '38', shoulder: '19', sleeve: '36' },
                        { us: '46', eu: '56', uk: '46', chest: '46', waist: '40', shoulder: '19.5', sleeve: '37' },
                        { us: '48', eu: '58', uk: '48', chest: '48', waist: '42', shoulder: '20', sleeve: '38' },
                        { us: '50', eu: '60', uk: '50', chest: '50', waist: '44', shoulder: '20.5', sleeve: '39' },
                        { us: '52', eu: '62', uk: '52', chest: '52', waist: '46', shoulder: '21', sleeve: '40' },
                      ].map((size) => (
                        <tr key={size.us} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{size.us}</td>
                          <td className="p-3">{size.eu}</td>
                          <td className="p-3">{size.uk}</td>
                          <td className="p-3">{size.chest}</td>
                          <td className="p-3">{size.waist}</td>
                          <td className="p-3">{size.shoulder}</td>
                          <td className="p-3">{size.sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Length Guide */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Suit Length Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Short (S)</h4>
                    <p className="text-sm text-gray-600">Height: 5ft4in - 5ft7in</p>
                    <p className="text-sm text-gray-600">Jacket Length: -2 inches</p>
                    <p className="text-sm text-gray-600">Sleeve Length: -1 inch</p>
                  </div>
                  <div className="border rounded-lg p-4 border-black">
                    <h4 className="font-medium mb-2">Regular (R)</h4>
                    <p className="text-sm text-gray-600">Height: 5ft8in - 6ft1in</p>
                    <p className="text-sm text-gray-600">Jacket Length: Standard</p>
                    <p className="text-sm text-gray-600">Sleeve Length: Standard</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Long (L)</h4>
                    <p className="text-sm text-gray-600">Height: 6ft2in and above</p>
                    <p className="text-sm text-gray-600">Jacket Length: +2 inches</p>
                    <p className="text-sm text-gray-600">Sleeve Length: +1 inch</p>
                  </div>
                </div>
              </div>
              
              {/* Fit Guide */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Fit Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Modern Fit</h4>
                    <p className="text-sm text-gray-600 mb-2">Our signature fit - tailored but not tight</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Slightly tapered through the body</li>
                      <li>• Natural shoulder construction</li>
                      <li>• Moderate lapel width</li>
                      <li>• Comfortable mobility</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Classic Fit</h4>
                    <p className="text-sm text-gray-600 mb-2">Traditional cut with more room</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Relaxed through chest and waist</li>
                      <li>• Fuller cut in the body</li>
                      <li>• Traditional lapel width</li>
                      <li>• Maximum comfort</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'calculator' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-6">Enter Your Measurements</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chest (inches)</label>
                    <input
                      type="number"
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Waist (inches)</label>
                    <input
                      type="number"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 34"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (inches)</label>
                    <input
                      type="number"
                      value={measurements.height}
                      onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 70 (5ft10in)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
                    <input
                      type="number"
                      value={measurements.weight}
                      onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 180"
                    />
                  </div>
                </div>
                
                <button
                  onClick={calculateSize}
                  className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Calculate My Size
                </button>
                
                {recommendedSize && (
                  <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Your Recommended Size</h4>
                    <p className="text-2xl font-bold text-green-900 mb-2">{recommendedSize}</p>
                    <p className="text-sm text-green-700">
                      Based on your measurements, we recommend size {recommendedSize}. 
                      This size should provide a comfortable modern fit.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Pro Tip:</strong> If you're between sizes, we recommend sizing up for comfort. 
                  Remember, we offer free alterations to ensure your perfect fit!
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'video' && (
            <div className="space-y-8">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Video: How to Take Your Measurements</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">How to Measure Chest</h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Stand up straight with arms relaxed at your sides</li>
                    <li>2. Wrap the measuring tape around the fullest part of your chest</li>
                    <li>3. Keep the tape level and parallel to the floor</li>
                    <li>4. Don't pull too tight - you should be able to fit a finger under the tape</li>
                    <li>5. Record the measurement in inches</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">How to Measure Waist</h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Find your natural waistline (usually at belly button level)</li>
                    <li>2. Stand relaxed, don't suck in your stomach</li>
                    <li>3. Wrap the tape around your waist</li>
                    <li>4. Keep the tape snug but not tight</li>
                    <li>5. Record the measurement in inches</li>
                  </ol>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Need Personal Assistance?</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Style Expert
                  </button>
                  <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;