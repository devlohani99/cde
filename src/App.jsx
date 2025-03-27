import { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch, FiX, FiPlus, FiAlertTriangle, FiInfo } from "react-icons/fi";
import { GiMedicinePills } from "react-icons/gi";
import { FaFemale, FaBaby, FaHeart } from "react-icons/fa";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState({ search: false, check: false });
  const [error, setError] = useState(null);
  const [lifeStage, setLifeStage] = useState(null); // New women-centric feature
  const searchInputRef = useRef(null);

  // Women's life stages
  const lifeStages = [
    { id: "general", label: "General Adult" },
    { id: "pregnancy", label: "Pregnancy", icon: <FaBaby className="mr-2" /> },
    { id: "breastfeeding", label: "Breastfeeding", icon: <FaFemale className="mr-2" /> },
    { id: "menopause", label: "Menopause", icon: <FaHeart className="mr-2" /> }
  ];

  // Mock API call for medicine search with women-centric data
  const fetchSuggestions = useCallback(async (term) => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(prev => ({ ...prev, search: true }));
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Enhanced mock data with women's health considerations
      const mockResults = [
        { 
          rxcui: "1", 
          name: "Paracetamol", 
          type: "analgesic",
          pregnancySafe: "Generally safe", 
          breastfeedingSafe: true
        },
        { 
          rxcui: "2", 
          name: "Ibuprofen", 
          type: "NSAID",
          pregnancySafe: "Avoid in third trimester", 
          breastfeedingSafe: true
        },
        { 
          rxcui: "3", 
          name: "Amoxicillin", 
          type: "antibiotic",
          pregnancySafe: "Generally safe", 
          breastfeedingSafe: true
        },
        { 
          rxcui: "4", 
          name: "Lisinopril", 
          type: "ACE inhibitor",
          pregnancySafe: "Contraindicated", 
          breastfeedingSafe: false
        },
        { 
          rxcui: "5", 
          name: "Prenatal Vitamins", 
          type: "supplement",
          pregnancySafe: "Recommended", 
          breastfeedingSafe: true
        },
        { 
          rxcui: "6", 
          name: "Fluoxetine", 
          type: "SSRI",
          pregnancySafe: "Caution advised", 
          breastfeedingSafe: true
        },
      ].filter(med => 
        med.name.toLowerCase().includes(term.toLowerCase())
      );

      setSuggestions(mockResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search medicines. Please try again.');
      setSuggestions([]);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  }, []);

  // Check medicine interactions with women's health considerations
  const checkInteractions = async () => {
    if (medicines.length < 1) return;

    setLoading(prev => ({ ...prev, check: true }));
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Enhanced mock interaction data with women's health info
      const mockInteractions = [
        {
          severity: "severe",
          description: "Combining Paracetamol and Alcohol may cause liver damage.",
          medicines: ["Paracetamol", "Alcohol"],
          pregnancyWarning: "Alcohol is strictly contraindicated during pregnancy"
        },
        {
          severity: "moderate",
          description: "Ibuprofen may reduce the effectiveness of Lisinopril.",
          medicines: ["Ibuprofen", "Lisinopril"],
          pregnancyWarning: "Both medications should be avoided during pregnancy"
        },
        {
          severity: "moderate",
          description: "Fluoxetine may interact with certain migraine medications.",
          medicines: ["Fluoxetine", "Sumatriptan"],
          pregnancyWarning: "SSRIs require careful monitoring during pregnancy"
        }
      ].filter(interaction => 
        interaction.medicines.some(med => 
          medicines.some(m => m.name === med)
        )
      );

      // Enhanced side effects data with women's considerations
      const mockSideEffects = {
        'Paracetamol': [
          'Nausea', 
          'Liver damage (in high doses)',
          lifeStage === 'pregnancy' ? 'Safe for short-term use in pregnancy' : null
        ].filter(Boolean),
        'Ibuprofen': [
          'Stomach pain', 
          'Heartburn', 
          'Dizziness',
          lifeStage === 'pregnancy' ? 'Avoid after 30 weeks of pregnancy' : null
        ].filter(Boolean),
        'Amoxicillin': [
          'Diarrhea', 
          'Rash', 
          'Allergic reactions',
          lifeStage === 'breastfeeding' ? 'May cause infant diarrhea' : null
        ].filter(Boolean),
        'Lisinopril': [
          'Dry cough', 
          'Dizziness', 
          'Headache',
          lifeStage === 'pregnancy' ? 'Contraindicated - can harm fetus' : null
        ].filter(Boolean),
        'Prenatal Vitamins': [
          'Constipation',
          'Nausea',
          'Metallic taste',
          lifeStage === 'pregnancy' ? 'Recommended for all pregnant women' : null
        ].filter(Boolean),
        'Fluoxetine': [
          'Insomnia',
          'Decreased libido',
          'Dry mouth',
          lifeStage === 'breastfeeding' ? 'Small amounts pass into breast milk' : null
        ].filter(Boolean)
      };

      setResults({
        interactions: mockInteractions,
        sideEffects: medicines.reduce((acc, med) => {
          acc[med.name] = mockSideEffects[med.name] || ['No common side effects recorded'];
          return acc;
        }, {}),
        alternatives: {
          'Paracetamol': 'Acetaminophen (same active ingredient)',
          'Ibuprofen': lifeStage === 'pregnancy' ? 'Acetaminophen (safer in pregnancy)' : 'Naproxen (similar but longer-lasting)',
          'Lisinopril': lifeStage === 'pregnancy' ? 'Methyldopa (pregnancy-safe alternative)' : 'Losartan'
        },
        pregnancyConsiderations: medicines.filter(med => med.pregnancySafe !== "Generally safe"),
        breastfeedingConsiderations: medicines.filter(med => !med.breastfeedingSafe)
      });
    } catch (err) {
      console.error('Interaction check error:', err);
      setError('Failed to check interactions. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, check: false }));
    }
  };

  // Add medicine to list
  const addMedicine = (medicine) => {
    if (!medicines.some(m => m.rxcui === medicine.rxcui)) {
      setMedicines([...medicines, medicine]);
      setSearchTerm("");
      setSuggestions([]);
    }
  };

  // Remove medicine from list
  const removeMedicine = (rxcui) => {
    setMedicines(medicines.filter(m => m.rxcui !== rxcui));
  };

  // Reset the checker
  const resetChecker = () => {
    setMedicines([]);
    setResults(null);
    setLifeStage(null);
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 1) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchSuggestions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="bg-pink-100 p-3 rounded-full mr-4">
            <GiMedicinePills className="text-pink-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">HerMedicine Checker</h1>
            <p className="text-pink-600">Designed with women's health in mind</p>
          </div>
        </div>

        {!results ? (
          <>
            {!lifeStage && (
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                  <FaFemale className="text-pink-500 mr-2" />
                  Select your life stage for personalized advice
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {lifeStages.map(stage => (
                    <button
                      key={stage.id}
                      onClick={() => setLifeStage(stage.id)}
                      className={`p-4 rounded-lg border-2 flex items-center justify-center ${
                        lifeStage === stage.id 
                          ? 'border-pink-500 bg-pink-50 text-pink-700' 
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {stage.icon || <FiInfo className="mr-2" />}
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lifeStage && (
              <>
                <div className="relative mb-6">
                  <div className="flex items-center px-4 py-3 border-2 border-pink-200 rounded-lg bg-white">
                    <FiSearch className="text-pink-400 mr-2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`Search medicines (e.g., ${lifeStage === 'pregnancy' ? 'Prenatal Vitamins' : 'Ibuprofen'})...`}
                      className="w-full outline-none placeholder-pink-300 text-gray-700"
                    />
                    {loading.search && (
                      <div className="ml-2 h-5 w-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>

                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border-2 border-pink-100">
                      {suggestions.map(med => (
                        <div
                          key={med.rxcui}
                          onClick={() => addMedicine(med)}
                          className="flex items-start p-3 hover:bg-pink-50 cursor-pointer border-b border-pink-50 last:border-0"
                        >
                          <div className={`p-2 rounded-full mr-3 ${
                            med.pregnancySafe === "Contraindicated" && lifeStage === "pregnancy" 
                              ? "bg-red-100 text-red-500" 
                              : "bg-pink-100 text-pink-500"
                          }`}>
                            <GiMedicinePills />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{med.name}</p>
                            <p className="text-sm text-gray-500">{med.type}</p>
                            {lifeStage === "pregnancy" && (
                              <p className={`text-xs mt-1 ${
                                med.pregnancySafe === "Contraindicated" 
                                  ? "text-red-600 font-semibold" 
                                  : "text-gray-600"
                              }`}>
                                Pregnancy: {med.pregnancySafe}
                              </p>
                            )}
                            {lifeStage === "breastfeeding" && (
                              <p className={`text-xs mt-1 ${
                                !med.breastfeedingSafe 
                                  ? "text-red-600 font-semibold" 
                                  : "text-gray-600"
                              }`}>
                                Breastfeeding: {med.breastfeedingSafe ? "Compatible" : "Not recommended"}
                              </p>
                            )}
                          </div>
                          <button className="p-1 text-pink-400 hover:text-pink-600">
                            <FiPlus />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
                    {error}
                  </div>
                )}

                {medicines.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                      <FaFemale className="text-pink-500 mr-2" />
                      Your Medicine List
                    </h2>
                    <div className="space-y-2">
                      {medicines.map(med => (
                        <div key={med.rxcui} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-100">
                          <div className="flex items-center">
                            <div className="p-2 bg-white rounded-full mr-3">
                              <GiMedicinePills className="text-pink-500" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{med.name}</span>
                              {lifeStage === "pregnancy" && med.pregnancySafe !== "Generally safe" && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                                  Pregnancy Caution
                                </span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => removeMedicine(med.rxcui)}
                            className="p-1 text-pink-400 hover:text-pink-600"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={checkInteractions}
                  disabled={loading.check || medicines.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    loading.check || medicines.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md'
                  }`}
                >
                  {loading.check ? (
                    <span className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Analyzing for {lifeStage === 'pregnancy' ? 'Pregnancy Safety' : 'Interactions'}...
                    </span>
                  ) : (
                    `Check ${medicines.length} Medicine${medicines.length !== 1 ? 's' : ''}`
                  )}
                </button>
              </>
            )}
          </>
        ) : (
          <div className="results-section">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {lifeStage === 'pregnancy' ? 'Pregnancy Safety Report' : 
                 lifeStage === 'breastfeeding' ? 'Breastfeeding Safety Report' : 
                 'Medication Analysis'}
              </h2>
              <button 
                onClick={resetChecker}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 shadow-md"
              >
                Start New Check
              </button>
            </div>

            {lifeStage && (
              <div className={`mb-6 p-4 rounded-lg ${
                lifeStage === 'pregnancy' ? 'bg-pink-50 border-l-4 border-pink-500' :
                lifeStage === 'breastfeeding' ? 'bg-blue-50 border-l-4 border-blue-500' :
                'bg-purple-50 border-l-4 border-purple-500'
              }`}>
                <div className="flex items-center">
                  {lifeStage === 'pregnancy' && <FaBaby className="text-pink-500 mr-3 text-xl" />}
                  {lifeStage === 'breastfeeding' && <FaFemale className="text-blue-500 mr-3 text-xl" />}
                  {lifeStage === 'menopause' && <FaHeart className="text-purple-500 mr-3 text-xl" />}
                  <p className="font-medium">
                    {lifeStage === 'pregnancy' ? 'Pregnancy-Specific Considerations' :
                     lifeStage === 'breastfeeding' ? 'Breastfeeding-Specific Considerations' :
                     'Women\'s Health Considerations'}
                  </p>
                </div>
                
                {results.pregnancyConsiderations?.length > 0 && lifeStage === 'pregnancy' && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Medications requiring caution:</p>
                    <ul className="space-y-2">
                      {results.pregnancyConsiderations.map((med, i) => (
                        <li key={i} className="flex items-start">
                          <FiAlertTriangle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            <span className="font-medium">{med.name}</span>: {med.pregnancySafe}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.breastfeedingConsiderations?.length > 0 && lifeStage === 'breastfeeding' && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Medications requiring caution:</p>
                    <ul className="space-y-2">
                      {results.breastfeedingConsiderations.map((med, i) => (
                        <li key={i} className="flex items-start">
                          <FiAlertTriangle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            <span className="font-medium">{med.name}</span>: Not recommended while breastfeeding
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lifeStage === 'menopause' && (
                  <p className="text-sm mt-2">
                    Some medications may affect bone density or interact with hormone therapy. 
                    Consult your doctor about long-term use of these medications.
                  </p>
                )}
              </div>
            )}

            {results.interactions.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                  <FiAlertTriangle className="text-red-500 mr-2" />
                  Potential Drug Interactions
                </h3>
                {results.interactions.map((interaction, index) => (
                  <div 
                    key={index} 
                    className={`p-4 mb-3 rounded-lg border-l-4 ${
                      interaction.severity === 'severe' 
                        ? 'bg-red-50 border-red-500' 
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <FiAlertTriangle className={`mt-1 mr-3 flex-shrink-0 ${
                        interaction.severity === 'severe' 
                          ? 'text-red-500' 
                          : 'text-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-800">
                          {interaction.medicines.join(' + ')}
                          {interaction.severity === 'severe' && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-red-500 text-white rounded-full">
                              Severe
                            </span>
                          )}
                        </p>
                        <p className="text-gray-700">{interaction.description}</p>
                        {interaction.pregnancyWarning && lifeStage === 'pregnancy' && (
                          <p className="mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded">
                            <span className="font-medium">Pregnancy Note:</span> {interaction.pregnancyWarning}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center">
                  <FiInfo className="text-green-500 mr-2" />
                  <p className="font-medium text-gray-700">No harmful interactions found between these medicines.</p>
                </div>
                {lifeStage && (
                  <p className="mt-2 text-sm text-gray-600">
                    {lifeStage === 'pregnancy' 
                      ? 'However, always consult your OB-GYN before taking any medication during pregnancy.' 
                      : 'Continue to monitor for any unexpected side effects.'}
                  </p>
                )}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                <FiInfo className="text-purple-500 mr-2" />
                Side Effects & Considerations
              </h3>
              <div className="space-y-4">
                {Object.entries(results.sideEffects).map(([name, effects]) => (
                  <div key={name} className="bg-gradient-to-br from-white to-pink-50 p-4 rounded-lg border border-pink-100 shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                      <GiMedicinePills className="text-pink-500 mr-2" />
                      {name}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {effects.map((effect, i) => (
                        <li 
                          key={i} 
                          className={`text-gray-700 ${
                            effect.includes('Contraindicated') || effect.includes('Avoid') 
                              ? 'text-red-600 font-medium' 
                              : ''
                          }`}
                        >
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(results.alternatives).length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                  <FiInfo className="text-blue-500 mr-2" />
                  Potential Alternatives
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(results.alternatives).map(([name, alt]) => (
                    <div key={name} className="bg-white p-3 rounded-lg border border-blue-100">
                      <p className="font-medium text-gray-800">{name}</p>
                      <p className="text-sm text-gray-600 mt-1">{alt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-pink-100 text-center text-sm text-gray-500">
          <p>This tool provides general information only and is not a substitute for professional medical advice.</p>
          <p className="mt-1">Always consult your healthcare provider about medications, especially during pregnancy or breastfeeding.</p>
        </div>
      </div>
    </div>
  );
};

export default App;