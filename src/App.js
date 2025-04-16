import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State for participant management
  const [participants, setParticipants] = useState([]);
  const [newParticipantName, setNewParticipantName] = useState("");

  // State for food and beverage selection
  const [selectedMeatTypes, setSelectedMeatTypes] = useState([]);
  const [selectedBeverageTypes, setSelectedBeverageTypes] = useState([]);
  const [selectedSideDishTypes, setSelectedSideDishTypes] = useState([]);

  // Predefined food and beverage options
  const meatOptions = [
    { value: "Sausages 🌭", label: "Sausages 🌭" },
    { value: "Wurstel 🍖", label: "Wurstel 🍖" },
    { value: "Ribs 🥩", label: "Ribs 🥩" },
    { value: "Chicken Wings 🍗", label: "Chicken Wings 🍗" },
    { value: "Burgers 🍔", label: "Burgers 🍔" }
  ];
  
  const beverageOptions = [
    { value: "Beer 🍺", label: "Beer 🍺" },
    { value: "Wine 🍷", label: "Wine 🍷" },
    { value: "Coca-Cola 🥤", label: "Coca-Cola 🥤" },
    { value: "Water 💧", label: "Water 💧" },
    { value: "Juice 🧃", label: "Juice 🧃" }
  ];
  
  const sideDishOptions = [
    { value: "Potatoes 🥔", label: "Potatoes 🥔" },
    { value: "Peppers 🌶️", label: "Peppers 🌶️" },
    { value: "Zucchini 🥒", label: "Zucchini 🥒" },
    { value: "Corn on the Cob 🌽", label: "Corn on the Cob 🌽" },
    { value: "Salad 🥗", label: "Salad 🥗" }
  ];

  // State for calculation results
  const [calculationResults, setCalculationResults] = useState(null);

  // Check URL for shared plan
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get("plan");

    if (planParam) {
      try {
        // Using decodeURIComponent instead of atob for proper handling of special characters
        const decodedPlan = JSON.parse(decodeURIComponent(planParam));
        if (decodedPlan.participants) setParticipants(decodedPlan.participants);
        if (decodedPlan.selectedMeatTypes) setSelectedMeatTypes(decodedPlan.selectedMeatTypes);
        if (decodedPlan.selectedBeverageTypes) setSelectedBeverageTypes(decodedPlan.selectedBeverageTypes);
        if (decodedPlan.selectedSideDishTypes) setSelectedSideDishTypes(decodedPlan.selectedSideDishTypes);
      } catch (error) {
        console.error("Error loading shared plan:", error);
      }
    }
  }, []);

  // Handle adding a new participant
  const handleAddParticipant = () => {
    if (newParticipantName.trim() === "") return;

    setParticipants([
      ...participants,
      {
        name: newParticipantName,
        isVegan: false,
      },
    ]);
    setNewParticipantName("");
  };

  // Handle removing a participant
  const handleRemoveParticipant = (index) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setParticipants(updatedParticipants);
  };

  // Handle toggling vegan status
  const handleToggleVegan = (index) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index].isVegan = !updatedParticipants[index].isVegan;
    setParticipants(updatedParticipants);
  };

  // Handle food selection checkboxes
  const handleMeatSelection = (value) => {
    setSelectedMeatTypes(prev => {
      if (prev.includes(value)) {
        return prev.filter(type => type !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleBeverageSelection = (value) => {
    setSelectedBeverageTypes(prev => {
      if (prev.includes(value)) {
        return prev.filter(type => type !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSideDishSelection = (value) => {
    setSelectedSideDishTypes(prev => {
      if (prev.includes(value)) {
        return prev.filter(type => type !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Calculate food and beverage needs
  const calculateNeeds = () => {
    if (
      participants.length === 0 ||
      selectedMeatTypes.length === 0 ||
      selectedBeverageTypes.length === 0 ||
      selectedSideDishTypes.length === 0
    ) {
      alert("Please add participants and select at least one option for each food/beverage category.");
      return;
    }

    const totalParticipants = participants.length;
    const veganParticipants = participants.filter((p) => p.isVegan).length;
    const nonVeganParticipants = totalParticipants - veganParticipants;

    // Calculate totals based on rules - 2 units per non-vegan for each meat type
    const meatTotals = {};
    selectedMeatTypes.forEach(meatType => {
      meatTotals[meatType] = Math.ceil(nonVeganParticipants * (2 / selectedMeatTypes.length));
    });

    // 1.5 units per person for each beverage type
    const beverageTotals = {};
    selectedBeverageTypes.forEach(bevType => {
      beverageTotals[bevType] = Math.ceil(totalParticipants * (1.5 / selectedBeverageTypes.length));
    });

    // 1 for non-vegan, 2 for vegan for each side dish
    const sideDishTotals = {};
    selectedSideDishTypes.forEach(sideType => {
      sideDishTotals[sideType] = Math.ceil(
        (nonVeganParticipants * 1 + veganParticipants * 2) / selectedSideDishTypes.length
      );
    });

    // Create a more intelligent distribution that assigns specific items to people
    const distribution = optimizeDistribution(
      participants,
      meatTotals,
      beverageTotals,
      sideDishTotals
    );

    setCalculationResults({
      totalParticipants,
      veganParticipants,
      meatTotals,
      beverageTotals,
      sideDishTotals,
      distribution,
    });
  };

  // Optimize distribution of food and beverages among participants
  const optimizeDistribution = (participants, meatTotals, beverageTotals, sideDishTotals) => {
    // Create a copy of participants to work with
    const distributionParticipants = [...participants];
    
    // Initialize distribution with empty assignments
    const distribution = distributionParticipants.map(p => ({
      name: p.name,
      isVegan: p.isVegan,
      items: []
    }));
    
    // Distribute meat types - only to non-vegans
    const nonVeganIndices = distributionParticipants
      .map((p, i) => p.isVegan ? -1 : i)
      .filter(i => i !== -1);
    
    // Distribute meat - try to keep each type with one person if possible
    let meatTypeIndex = 0;
    Object.entries(meatTotals).forEach(([meatType, quantity]) => {
      // Find the best person to assign this meat type to
      const personIndex = nonVeganIndices[meatTypeIndex % nonVeganIndices.length];
      
      // Add the meat item
      distribution[personIndex].items.push({
        type: meatType,
        quantity: quantity
      });
      
      meatTypeIndex++;
    });

    // Distribute beverages - to everyone
    let beverageTypeIndex = 0;
    Object.entries(beverageTotals).forEach(([beverageType, quantity]) => {
      // Try to distribute evenly
      const personIndex = beverageTypeIndex % participants.length;
      
      // Add the beverage item
      distribution[personIndex].items.push({
        type: beverageType,
        quantity: quantity
      });
      
      beverageTypeIndex++;
    });

    // Distribute side dishes - more to vegans
    let sideTypeIndex = 0;
    Object.entries(sideDishTotals).forEach(([sideType, quantity]) => {
      // Prefer giving side dishes to vegans first
      const veganIndices = distributionParticipants
        .map((p, i) => p.isVegan ? i : -1)
        .filter(i => i !== -1);
      
      if (veganIndices.length > 0) {
        const personIndex = veganIndices[sideTypeIndex % veganIndices.length];
        distribution[personIndex].items.push({
          type: sideType,
          quantity: quantity
        });
      } else {
        // If no vegans, distribute to anyone
        const personIndex = sideTypeIndex % participants.length;
        distribution[personIndex].items.push({
          type: sideType,
          quantity: quantity
        });
      }
      
      sideTypeIndex++;
    });
    
    // Balance the load a bit - check if some participants have nothing assigned
    const unassignedParticipants = distribution.filter(p => p.items.length === 0);
    
    if (unassignedParticipants.length > 0) {
      // Find participants with more than one item
      const overloadedParticipants = distribution
        .map((p, index) => ({ index, itemCount: p.items.length }))
        .filter(p => p.itemCount > 1)
        .sort((a, b) => b.itemCount - a.itemCount);
      
      // Redistribute items from overloaded to unassigned participants
      unassignedParticipants.forEach((unassigned, unassignedIndex) => {
        if (overloadedParticipants.length > unassignedIndex) {
          const donorIndex = overloadedParticipants[unassignedIndex].index;
          const itemToMove = distribution[donorIndex].items.pop();
          
          const recipientIndex = distribution.findIndex(p => p.name === unassigned.name);
          if (recipientIndex >= 0 && itemToMove) {
            distribution[recipientIndex].items.push(itemToMove);
          }
        }
      });
    }
    
    return distribution;
  };

  // Generate export text for group chat
  const generateExportText = () => {
    if (!calculationResults) return "";

    const {
      totalParticipants,
      veganParticipants,
      meatTotals,
      beverageTotals,
      sideDishTotals,
      distribution,
    } = calculationResults;

    let exportText = `BBQ Plan! ☀️\n\n`;
    
    exportText += `We need:\n`;
    
    // Add meat totals
    exportText += `Meat:\n`;
    Object.entries(meatTotals).forEach(([meatType, quantity]) => {
      exportText += `- ${meatType} (Total: ${quantity})\n`;
    });
    
    // Add beverage totals
    exportText += `\nBeverages:\n`;
    Object.entries(beverageTotals).forEach(([beverageType, quantity]) => {
      exportText += `- ${beverageType} (Total: ${quantity})\n`;
    });
    
    // Add side dish totals
    exportText += `\nSides:\n`;
    Object.entries(sideDishTotals).forEach(([sideType, quantity]) => {
      exportText += `- ${sideType} (Total: ${quantity})\n`;
    });

    exportText += `\nParticipants (${totalParticipants} total, ${veganParticipants} Vegan${
      veganParticipants !== 1 ? "s" : ""
    }):\n`;
    
    participants.forEach((p) => {
      exportText += `- ${p.name}${p.isVegan ? " (Vegan)" : ""}\n`;
    });

    exportText += `\nSuggested Contributions:\n`;
    distribution.forEach((p) => {
      exportText += `- ${p.name}${p.isVegan ? " (Vegan)" : ""}: `;
      
      if (p.items.length > 0) {
        const itemsText = p.items.map(item => `${item.quantity} ${item.type}`).join(', ');
        exportText += itemsText;
      } else {
        exportText += "Nothing assigned (please coordinate with group)";
      }
      
      exportText += '\n';
    });

    exportText += `\n(Note: This is just a suggestion for splitting items!)`;

    return exportText;
  };

  // Handle export for group chat
  const handleExport = () => {
    const exportText = generateExportText();

    // Create a textarea element to copy text
    const textArea = document.createElement("textarea");
    textArea.value = exportText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    alert("BBQ plan copied to clipboard!");
  };

  // Generate share URL
  const generateShareURL = () => {
    const planData = {
      participants,
      selectedMeatTypes,
      selectedBeverageTypes,
      selectedSideDishTypes,
    };

    try {
      // Using encodeURIComponent instead of btoa to handle non-Latin1 characters like emojis
      const encodedData = encodeURIComponent(JSON.stringify(planData));
      const shareURL = `${window.location.origin}${window.location.pathname}?plan=${encodedData}`;
      
      // Create a textarea element to copy URL
      const textArea = document.createElement("textarea");
      textArea.value = shareURL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      
      alert("Share link copied to clipboard!");
    } catch (error) {
      console.error("Error generating share URL:", error);
      alert("Failed to generate share link. Please try again.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>BBQ Organizer 🍖🔥</h1>
      </header>
      <main className="App-main">
        <section className="food-selection">
          <h2>1. Select Food & Beverages</h2>

          {/* Meat Selection */}
          <div className="selector">
            <label>Select Meat Types (choose multiple):</label>
            <div className="checkbox-container">
              {meatOptions.map((option) => (
                <label key={option.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedMeatTypes.includes(option.value)}
                    onChange={() => handleMeatSelection(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Beverage Selection */}
          <div className="selector">
            <label>Select Beverage Types (choose multiple):</label>
            <div className="checkbox-container">
              {beverageOptions.map((option) => (
                <label key={option.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedBeverageTypes.includes(option.value)}
                    onChange={() => handleBeverageSelection(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Side Dish Selection */}
          <div className="selector">
            <label>Select Side Dishes (choose multiple):</label>
            <div className="checkbox-container">
              {sideDishOptions.map((option) => (
                <label key={option.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedSideDishTypes.includes(option.value)}
                    onChange={() => handleSideDishSelection(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="participant-management">
          <h2>2. Manage Participants</h2>
          <div className="add-participant">
            <input
              type="text"
              placeholder="Enter participant name"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddParticipant()}
            />
            <button onClick={handleAddParticipant}>Add Participant</button>
          </div>

          <div className="participants-list">
            <h3>Participants:</h3>
            {participants.length === 0 ? (
              <p>No participants added yet.</p>
            ) : (
              <ul>
                {participants.map((participant, index) => (
                  <li key={index}>
                    <div className="participant-item">
                      <span>{participant.name}</span>
                      <div className="vegan-toggle">
                        <label>
                          <input
                            type="checkbox"
                            checked={participant.isVegan}
                            onChange={() => handleToggleVegan(index)}
                          />
                          Vegan
                        </label>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveParticipant(index)}
                      >
                        ✖
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="calculation">
          <h2>3. Calculate & View Results</h2>
          <button
            className="calculate-btn"
            onClick={calculateNeeds}
            disabled={
              participants.length === 0 ||
              selectedMeatTypes.length === 0 ||
              selectedBeverageTypes.length === 0 ||
              selectedSideDishTypes.length === 0
            }
          >
            Calculate Needs
          </button>

          {calculationResults && (
            <div className="results">
              <h3>Results:</h3>
              <div className="totals">
                <p>
                  Total Participants: {calculationResults.totalParticipants} (
                  {calculationResults.veganParticipants} Vegan)
                </p>
                
                <div className="totals-section">
                  <h4>Meat:</h4>
                  <ul>
                    {Object.entries(calculationResults.meatTotals).map(([meatType, quantity]) => (
                      <li key={meatType}>
                        {meatType} - Total: {quantity} units
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="totals-section">
                  <h4>Beverages:</h4>
                  <ul>
                    {Object.entries(calculationResults.beverageTotals).map(([bevType, quantity]) => (
                      <li key={bevType}>
                        {bevType} - Total: {quantity} units
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="totals-section">
                  <h4>Side Dishes:</h4>
                  <ul>
                    {Object.entries(calculationResults.sideDishTotals).map(([sideType, quantity]) => (
                      <li key={sideType}>
                        {sideType} - Total: {quantity} units
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="distribution">
                <h4>Suggested Distribution:</h4>
                <ul>
                  {calculationResults.distribution.map((person, index) => (
                    <li key={index}>
                      <strong>
                        {person.name}
                        {person.isVegan ? " (Vegan)" : ""}:
                      </strong>{" "}
                      {person.items.length > 0 
                        ? person.items.map((item, i) => (
                            <span key={i}>
                              {i > 0 && ", "}
                              {item.quantity} {item.type}
                            </span>
                          ))
                        : "Nothing assigned"
                      }
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="share-export">
                <button onClick={handleExport}>Export for Group Chat</button>
                <button onClick={generateShareURL}>Share Plan</button>
              </div>
            </div>
          )}
        </section>
      </main>
      <footer className="App-footer">
        <p>BBQ Organizer App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
