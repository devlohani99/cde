import { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch, FiX, FiPlus, FiAlertTriangle, FiInfo } from "react-icons/fi";
import { GiMedicinePills } from "react-icons/gi";
import { FaFemale, FaBaby, FaHeart, FaFlask } from "react-icons/fa";
import { BsDroplet, BsHeartPulse } from "react-icons/bs";
import Navbar from "./components/Navbar";


const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState({ search: false, check: false });
  const [error, setError] = useState(null);
  const [lifeStage, setLifeStage] = useState(null);
  const searchInputRef = useRef(null);

  // Women's life stages with enhanced styling
  const lifeStages = [
    { id: "general", label: "General Adult", color: "bg-purple-100 text-purple-800" },
    { id: "pregnancy", label: "Pregnancy", icon: <FaBaby className="mr-2" />, color: "bg-pink-100 text-pink-800" },
    { id: "breastfeeding", label: "Breastfeeding", icon: <FaFemale className="mr-2" />, color: "bg-blue-100 text-blue-800" },
    { id: "menopause", label: "Menopause", icon: <FaHeart className="mr-2" />, color: "bg-red-100 text-red-800" }
  ];

  // Expanded mock data with 50 medicines including women's health considerations
  const medicineDatabase = [
    { rxcui: "1", name: "Paracetamol", type: "analgesic", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "2", name: "Ibuprofen", type: "NSAID", pregnancySafe: "Avoid in third trimester", breastfeedingSafe: true },
    { rxcui: "3", name: "Amoxicillin", type: "antibiotic", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "4", name: "Lisinopril", type: "ACE inhibitor", pregnancySafe: "Contraindicated", breastfeedingSafe: false },
    { rxcui: "5", name: "Prenatal Vitamins", type: "supplement", pregnancySafe: "Recommended", breastfeedingSafe: true },
    { rxcui: "6", name: "Fluoxetine", type: "SSRI", pregnancySafe: "Caution advised", breastfeedingSafe: true },
    { rxcui: "7", name: "Sertraline", type: "SSRI", pregnancySafe: "Preferred SSRI in pregnancy", breastfeedingSafe: true },
    { rxcui: "8", name: "Metformin", type: "antidiabetic", pregnancySafe: "Category B", breastfeedingSafe: true },
    { rxcui: "9", name: "Levothyroxine", type: "thyroid hormone", pregnancySafe: "Dose may need adjustment", breastfeedingSafe: true },
    { rxcui: "10", name: "Albuterol", type: "bronchodilator", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "11", name: "Omeprazole", type: "PPI", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "12", name: "Atorvastatin", type: "statin", pregnancySafe: "Contraindicated", breastfeedingSafe: false },
    { rxcui: "13", name: "Warfarin", type: "anticoagulant", pregnancySafe: "Contraindicated (use heparin)", breastfeedingSafe: true },
    { rxcui: "14", name: "Folic Acid", type: "supplement", pregnancySafe: "Highly recommended", breastfeedingSafe: true },
    { rxcui: "15", name: "Iron Supplements", type: "supplement", pregnancySafe: "Often needed", breastfeedingSafe: true },
    { rxcui: "16", name: "Calcium Carbonate", type: "supplement", pregnancySafe: "Recommended", breastfeedingSafe: true },
    { rxcui: "17", name: "Vitamin D", type: "supplement", pregnancySafe: "Recommended", breastfeedingSafe: true },
    { rxcui: "18", name: "Diazepam", type: "benzodiazepine", pregnancySafe: "Avoid unless essential", breastfeedingSafe: false },
    { rxcui: "19", name: "Hydrochlorothiazide", type: "diuretic", pregnancySafe: "Caution advised", breastfeedingSafe: false },
    { rxcui: "20", name: "Propranolol", type: "beta blocker", pregnancySafe: "Caution advised", breastfeedingSafe: true },
    { rxcui: "21", name: "Sumatriptan", type: "migraine", pregnancySafe: "Limited data", breastfeedingSafe: true },
    { rxcui: "22", name: "Zolpidem", type: "sedative", pregnancySafe: "Avoid unless essential", breastfeedingSafe: false },
    { rxcui: "23", name: "Cetirizine", type: "antihistamine", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "24", name: "Loratadine", type: "antihistamine", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "25", name: "Doxycycline", type: "antibiotic", pregnancySafe: "Avoid after 15 weeks", breastfeedingSafe: false },
    { rxcui: "26", name: "Ciprofloxacin", type: "antibiotic", pregnancySafe: "Avoid unless essential", breastfeedingSafe: false },
    { rxcui: "27", name: "Azithromycin", type: "antibiotic", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "28", name: "Clindamycin", type: "antibiotic", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "29", name: "Methyldopa", type: "antihypertensive", pregnancySafe: "First-line for hypertension", breastfeedingSafe: true },
    { rxcui: "30", name: "Nifedipine", type: "calcium channel blocker", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "31", name: "Labetalol", type: "beta blocker", pregnancySafe: "First-line for hypertension", breastfeedingSafe: true },
    { rxcui: "32", name: "Insulin", type: "antidiabetic", pregnancySafe: "Treatment of choice", breastfeedingSafe: true },
    { rxcui: "33", name: "Metronidazole", type: "antibiotic", pregnancySafe: "Avoid in first trimester", breastfeedingSafe: false },
    { rxcui: "34", name: "Prednisone", type: "steroid", pregnancySafe: "Low dose may be used", breastfeedingSafe: true },
    { rxcui: "35", name: "Ranitidine", type: "H2 blocker", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "36", name: "Famotidine", type: "H2 blocker", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "37", name: "Magnesium Sulfate", type: "mineral", pregnancySafe: "For eclampsia", breastfeedingSafe: true },
    { rxcui: "38", name: "Morphine", type: "opioid", pregnancySafe: "Short-term use only", breastfeedingSafe: false },
    { rxcui: "39", name: "Codeine", type: "opioid", pregnancySafe: "Avoid prolonged use", breastfeedingSafe: false },
    { rxcui: "40", name: "Tramadol", type: "opioid", pregnancySafe: "Avoid unless essential", breastfeedingSafe: false },
    { rxcui: "41", name: "Gabapentin", type: "anticonvulsant", pregnancySafe: "Caution advised", breastfeedingSafe: true },
    { rxcui: "42", name: "Topiramate", type: "anticonvulsant", pregnancySafe: "High risk of birth defects", breastfeedingSafe: false },
    { rxcui: "43", name: "Valproate", type: "anticonvulsant", pregnancySafe: "Contraindicated", breastfeedingSafe: false },
    { rxcui: "44", name: "Lamotrigine", type: "anticonvulsant", pregnancySafe: "Generally safe", breastfeedingSafe: true },
    { rxcui: "45", name: "Escitalopram", type: "SSRI", pregnancySafe: "Caution advised", breastfeedingSafe: true },
    { rxcui: "46", name: "Venlafaxine", type: "SNRI", pregnancySafe: "Caution advised", breastfeedingSafe: true },
    { rxcui: "47", name: "Duloxetine", type: "SNRI", pregnancySafe: "Caution advised", breastfeedingSafe: true },
    { rxcui: "48", name: "Trazodone", type: "antidepressant", pregnancySafe: "Limited data", breastfeedingSafe: false },
    { rxcui: "49", name: "Mirtazapine", type: "antidepressant", pregnancySafe: "Limited data", breastfeedingSafe: true },
    { rxcui: "50", name: "Buspirone", type: "anxiolytic", pregnancySafe: "Limited data", breastfeedingSafe: false }
  ];

  // Mock API call for medicine search
  const fetchSuggestions = useCallback(async (term) => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(prev => ({ ...prev, search: true }));
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults = medicineDatabase.filter(med => 
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

  // Check medicine interactions
  const checkInteractions = async () => {
    if (medicines.length < 1) return;

    setLoading(prev => ({ ...prev, check: true }));
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Enhanced mock interaction data
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
        },
        {
          severity: "severe",
          description: "Valproate can cause serious birth defects and should be avoided in pregnancy.",
          medicines: ["Valproate"],
          pregnancyWarning: "Absolute contraindication in pregnancy"
        },
        {
          severity: "moderate",
          description: "Warfarin can cause fetal abnormalities - switch to heparin if pregnant.",
          medicines: ["Warfarin"],
          pregnancyWarning: "Contraindicated in pregnancy"
        }
      ].filter(interaction => 
        interaction.medicines.some(med => 
          medicines.some(m => m.name === med)
        )
      );

      // Enhanced side effects data
      const mockSideEffects = medicineDatabase.reduce((acc, med) => {
        const baseEffects = [
          'Nausea',
          'Headache',
          'Dizziness',
          'Fatigue'
        ].slice(0, Math.floor(Math.random() * 3) + 1);
        
        let specificEffects = [];
        
        if (med.type === "antibiotic") {
          specificEffects.push('Diarrhea', 'Yeast infection');
        }
        if (med.type === "SSRI") {
          specificEffects.push('Insomnia', 'Decreased libido');
        }
        if (med.type === "opioid") {
          specificEffects.push('Constipation', 'Drowsiness');
        }
        
        // Add pregnancy/breastfeeding considerations
        if (lifeStage === 'pregnancy' && med.pregnancySafe !== "Generally safe") {
          specificEffects.push(`Pregnancy: ${med.pregnancySafe}`);
        }
        if (lifeStage === 'breastfeeding' && !med.breastfeedingSafe) {
          specificEffects.push('Not recommended while breastfeeding');
        }
        
        acc[med.name] = [...baseEffects, ...specificEffects];
        return acc;
      }, {});

      setResults({
        interactions: mockInteractions,
        sideEffects: medicines.reduce((acc, med) => {
          acc[med.name] = mockSideEffects[med.name] || ['No common side effects recorded'];
          return acc;
        }, {}),
        alternatives: {
          'Paracetamol': 'Acetaminophen (same active ingredient)',
          'Ibuprofen': lifeStage === 'pregnancy' ? 'Acetaminophen (safer in pregnancy)' : 'Naproxen (similar but longer-lasting)',
          'Lisinopril': lifeStage === 'pregnancy' ? 'Methyldopa (pregnancy-safe alternative)' : 'Losartan',
          'Valproate': 'Lamotrigine (safer for pregnancy)',
          'Warfarin': 'Heparin (pregnancy-safe anticoagulant)'
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
      searchInputRef.current.focus();
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
    setSearchTerm("");
    searchInputRef.current.focus();
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

  // Get medicine icon based on type
  const getMedicineIcon = (type) => {
    switch(type) {
      case 'antibiotic':
        return <FaFlask className="text-blue-500" />;
      case 'SSRI':
      case 'SNRI':
      case 'antidepressant':
        return <BsHeartPulse className="text-green-500" />;
      case 'supplement':
        return <BsDroplet className="text-yellow-500" />;
      default:
        return <GiMedicinePills className="text-pink-500" />;
    }
  };

  return (
    <>
    <Navbar/>

       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with animated gradient */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4 backdrop-blur-sm">
              <GiMedicinePills className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">HerMedicine Checker</h1>
              <p className="text-pink-100">Designed with women's health in mind</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!results ? (
            <>
              {!lifeStage && (
                <div className="mb-8 animate-fadeIn">
                  <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                    <FaFemale className="text-pink-500 mr-2" />
                    Select your life stage for personalized advice
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {lifeStages.map(stage => (
                      <button
                        key={stage.id}
                        onClick={() => setLifeStage(stage.id)}
                        className={`p-4 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-[1.02] ${stage.color} ${
                          lifeStage === stage.id 
                            ? 'border-white shadow-md ring-2 ring-white ring-opacity-50' 
                            : 'border-transparent hover:border-white'
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
                  <div className="relative mb-6 animate-fadeIn">
                    <div className="flex items-center px-4 py-3 border-2 border-pink-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                      <FiSearch className="text-pink-400 mr-2" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search medicines (e.g., ${lifeStage === 'pregnancy' ? 'Prenatal Vitamins' : 'Ibuprofen'})...`}
                        className="w-full outline-none placeholder-pink-300 text-gray-700 bg-transparent"
                        autoFocus
                      />
                      {loading.search && (
                        <div className="ml-2 h-5 w-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>

                    {suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white shadow-xl rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                        {suggestions.map(med => (
                          <div
                            key={med.rxcui}
                            onClick={() => addMedicine(med)}
                            className="flex items-start p-3 hover:bg-pink-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                          >
                            <div className={`p-2 rounded-full mr-3 ${
                              med.pregnancySafe === "Contraindicated" && lifeStage === "pregnancy" 
                                ? "bg-red-100" 
                                : "bg-pink-100"
                            }`}>
                              {getMedicineIcon(med.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-800">{med.name}</p>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{med.type}</span>
                              </div>
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
                            <button className="p-1 text-pink-400 hover:text-pink-600 transition-colors">
                              <FiPlus />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500 flex items-start">
                      <FiAlertTriangle className="mt-1 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {medicines.length > 0 && (
                    <div className="mb-6 animate-fadeIn">
                      <h2 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                        <FaFemale className="text-pink-500 mr-2" />
                        Your Medicine List
                        <span className="ml-auto text-sm font-normal bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                          {medicines.length} added
                        </span>
                      </h2>
                      <div className="space-y-2">
                        {medicines.map(med => (
                          <div key={med.rxcui} className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center">
                              <div className="p-2 bg-white rounded-full mr-3 shadow-sm">
                                {getMedicineIcon(med.type)}
                              </div>
                              <div>
                                <span className="font-medium text-gray-800">{med.name}</span>
                                {lifeStage === "pregnancy" && med.pregnancySafe !== "Generally safe" && (
                                  <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                                    Pregnancy Caution
                                  </span>
                                )}
                                {lifeStage === "breastfeeding" && !med.breastfeedingSafe && (
                                  <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                    Breastfeeding Caution
                                  </span>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={() => removeMedicine(med.rxcui)}
                              className="p-1 text-pink-400 hover:text-pink-600 transition-colors"
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
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                      loading.check || medicines.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]'
                    }`}
                  >
                    {loading.check ? (
                      <span className="flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing for {lifeStage === 'pregnancy' ? 'Pregnancy Safety' : 'Interactions'}...
                      </span>
                    ) : (
                      <span>
                        {medicines.length > 0 
                          ? `Check ${medicines.length} Medicine${medicines.length !== 1 ? 's' : ''}` 
                          : 'Add medicines to check'}
                      </span>
                    )}
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="results-section animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {lifeStage === 'pregnancy' ? 'Pregnancy Safety Report' : 
                   lifeStage === 'breastfeeding' ? 'Breastfeeding Safety Report' : 
                   'Medication Analysis'}
                </h2>
                <button 
                  onClick={resetChecker}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all flex items-center"
                >
                  <FiPlus className="mr-1 transform rotate-45" />
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
                  <div className="space-y-3">
                    {results.interactions.map((interaction, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border-l-4 shadow-sm ${
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
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-gray-800">
                                {interaction.medicines.join(' + ')}
                              </p>
                              {interaction.severity === 'severe' && (
                                <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full">
                                  Severe
                                </span>
                              )}
                              {interaction.severity === 'moderate' && (
                                <span className="text-xs px-2 py-0.5 bg-yellow-500 text-white rounded-full">
                                  Moderate
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mt-1">{interaction.description}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results.sideEffects).map(([name, effects]) => (
                    <div key={name} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        {getMedicineIcon(medicines.find(m => m.name === name)?.type)}
                        <span className="ml-2">{name}</span>
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
                      <div key={name} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
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
    </div>
    </>
    
 
  );
};

export default App;

// Add custom animations to your CSS or Tailwind config
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }