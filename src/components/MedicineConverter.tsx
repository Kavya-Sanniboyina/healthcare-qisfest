import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Leaf, Zap, Shield } from 'lucide-react';
import { medicineDatabase, getMedicineData, MedicineEntry } from '@/data/medicineDatabase';
import './MedicineConverter.css';

interface ConversionResult {
  medicine: MedicineEntry | null;
  userSeverity: 'mild' | 'moderate' | 'severe' | null;
}

const MedicineConverter = () => {
  const [searchInput, setSearchInput] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [userReportedSeverity, setUserReportedSeverity] = useState<'mild' | 'moderate' | 'severe' | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      const medicine = getMedicineData(searchInput);
      setResult({
        medicine,
        userSeverity: userReportedSeverity
      });
      setIsSearching(false);
    }, 500);
  };

  const determineSeverityLevel = (): 'mild' | 'moderate' | 'severe' => {
    // Priority: User-reported severity > Medicine's inherent severity
    if (userReportedSeverity) return userReportedSeverity;
    if (result?.medicine) return result.medicine.severity;
    return 'mild';
  };

  const severityLevel = result ? determineSeverityLevel() : null;

  return (
    <div className="medicine-converter-container">
      {/* Animated Background */}
      <div className="converter-background">
        <div className="ayurvedic-pattern-1"></div>
        <div className="ayurvedic-pattern-2"></div>
        <div className="glowing-orb-1"></div>
        <div className="glowing-orb-2"></div>
      </div>

      {/* Main Content */}
      <div className="converter-content">
        {/* Header Section */}
        <div className="converter-header">
          <div className="header-icon">🌿</div>
          <h1 className="converter-title">English Medicine to Ayurvedic Converter</h1>
          <p className="converter-subtitle">
            Discover safe Ayurvedic alternatives with intelligent safety controls
          </p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Enter medicine name... e.g., Paracetamol, Cetirizine, Savlon"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className={`search-button ${isSearching ? 'loading' : ''}`}
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Severity Selector */}
          <div className="severity-selector">
            <p className="severity-label">How severe is your condition?</p>
            <div className="severity-options">
              <button
                className={`severity-btn mild ${userReportedSeverity === 'mild' ? 'active' : ''}`}
                onClick={() => setUserReportedSeverity('mild')}
              >
                <span className="severity-dot mild"></span>
                Mild
              </button>
              <button
                className={`severity-btn moderate ${userReportedSeverity === 'moderate' ? 'active' : ''}`}
                onClick={() => setUserReportedSeverity('moderate')}
              >
                <span className="severity-dot moderate"></span>
                Moderate
              </button>
              <button
                className={`severity-btn severe ${userReportedSeverity === 'severe' ? 'active' : ''}`}
                onClick={() => setUserReportedSeverity('severe')}
              >
                <span className="severity-dot severe"></span>
                Severe
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result?.medicine ? (
          <div className="results-container">
            {/* Medicine Category Detection */}
            <div className={`result-card category-card severity-${severityLevel}`}>
              <div className="card-header">
                <Leaf className="card-icon" size={24} />
                <h2>Detected Category</h2>
              </div>
              <p className="category-name">{result.medicine.category}</p>
              <p className="medicine-name">Medicine: {result.medicine.englishName}</p>
            </div>

            {/* Common Uses */}
            <div className="result-card uses-card">
              <div className="card-header">
                <CheckCircle className="card-icon" size={24} />
                <h2>Common Uses</h2>
              </div>
              <p className="uses-text">{result.medicine.commonUses}</p>
            </div>

            {/* Safety Logic: Show different content based on severity */}
            {severityLevel === 'severe' ? (
              // SEVERE CASE: Block all alternatives
              <div className="result-card critical-safety-card">
                <div className="critical-header">
                  <AlertTriangle className="critical-icon" size={32} />
                  <h2>⚠️ Critical Safety Notice</h2>
                </div>
                <div className="critical-message">
                  {result.medicine.disclaimer || (
                    <>
                      <p><strong>Your condition may require proper medical treatment.</strong></p>
                      <p>
                        Based on the medicine type and severity level, Ayurvedic alternatives are 
                        <strong> NOT recommended at this stage.</strong>
                      </p>
                      <p className="critical-action">
                        ✓ Please follow the prescribed medication<br />
                        ✓ Consult a healthcare professional<br />
                        ✓ Do not self-medicate with herbal alternatives
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : severityLevel === 'moderate' ? (
              // MODERATE CASE: Show limited alternatives with caution
              <div className="result-card alternatives-card moderate-level">
                <div className="card-header">
                  <Zap className="card-icon yellow" size={24} />
                  <h2>Suggested Ayurvedic Alternatives (Use with Caution)</h2>
                </div>
                <div className="moderate-disclaimer">
                  ⚠️ These are temporary relief options only. Monitor your condition closely. 
                  If symptoms persist, consult a healthcare professional.
                </div>
                {result.medicine.ayurvedicAlternatives && (
                  <div className="alternatives-grid">
                    {result.medicine.ayurvedicAlternatives.slice(0, 2).map((alt, index) => (
                      <div key={index} className="alternative-card">
                        <h3>{alt.name}</h3>
                        <p className="benefit">{alt.benefit}</p>
                        <p className="usage"><strong>Usage:</strong> {alt.usage}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // MILD CASE: Show full alternatives
              <div className="result-card alternatives-card mild-level">
                <div className="card-header">
                  <Leaf className="card-icon green" size={24} />
                  <h2>Suggested Ayurvedic / Natural Alternatives</h2>
                </div>
                <div className="mild-disclaimer">
                  ✓ Your reported symptoms seem mild. These safe, common alternatives may help.
                </div>
                {result.medicine.ayurvedicAlternatives && (
                  <div className="alternatives-grid">
                    {result.medicine.ayurvedicAlternatives.map((alt, index) => (
                      <div key={index} className="alternative-card">
                        <div className="alt-header">
                          <h3>{alt.name}</h3>
                          <span className="alt-number">#{index + 1}</span>
                        </div>
                        <p className="benefit">💚 {alt.benefit}</p>
                        <p className="usage"><strong>📋 Usage:</strong> {alt.usage}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Warnings Section */}
            {result.medicine.warnings && result.medicine.warnings.length > 0 && (
              <div className="result-card warnings-card">
                <div className="card-header">
                  <Shield className="card-icon red" size={24} />
                  <h2>Important Warnings</h2>
                </div>
                <ul className="warnings-list">
                  {result.medicine.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : searchInput && !isSearching ? (
          <div className="no-results">
            <AlertTriangle size={48} />
            <h3>Medicine Not Found</h3>
            <p>The medicine you searched for is not in our database.</p>
            <p className="helper-text">Try searching with a generic name or common brand name.</p>
          </div>
        ) : !searchInput ? (
          <div className="welcome-section">
            <div className="welcome-content">
              <p className="welcome-text">
                🌿 <strong>How to Use This Tool:</strong>
              </p>
              <ol className="instructions">
                <li>Enter the name of an English/allopathic medicine</li>
                <li>Select your condition's severity level</li>
                <li>Get intelligent recommendations based on safety rules</li>
              </ol>
              <p className="safety-note">
                💡 <strong>Safety First:</strong> Severe conditions will not show herbal suggestions 
                to protect your health.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MedicineConverter;
