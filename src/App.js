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
  const [selectedExtrasTypes, setSelectedExtrasTypes] = useState([]);

  // Predefined food and beverage options
  const meatOptions = [
    { value: "Sausages 🌭", label: "Sausages 🌭" },
    { value: "Wurstel 🍖", label: "Wurstel 🍖" },
    { value: "Ribs 🥩", label: "Ribs 🥩" },
    { value: "Chicken Wings 🍗", label: "Chicken Wings 🍗" },
    { value: "Burgers 🍔", label: "Burgers 🍔" },
  ];

  const beverageOptions = [
    { value: "Beer 🍺", label: "Beer 🍺" },
    { value: "Wine 🍷", label: "Wine 🍷" },
    { value: "Coca-Cola 🥤", label: "Coca-Cola 🥤" },
    { value: "Water 💧", label: "Water 💧" },
    { value: "Juice 🧃", label: "Juice 🧃" },
  ];

  const sideDishOptions = [
    { value: "Potatoes 🥔", label: "Potatoes 🥔" },
    { value: "Peppers 🌶️", label: "Peppers 🌶️" },
    { value: "Zucchini 🥒", label: "Zucchini 🥒" },
    { value: "Corn on the Cob 🌽", label: "Corn on the Cob 🌽" },
    { value: "Salad 🥗", label: "Salad 🥗" },
  ];

  // New extras options
  const extrasOptions = [
    { value: "Bread 🍞", label: "Bread 🍞" },
    { value: "Forks & Dishes & Napkins 🍽️", label: "Forks & Dishes & Napkins 🍽️" },
    { value: "Ketchup 🍅", label: "Ketchup 🍅" },
    { value: "BBQ Sauce 🥫", label: "BBQ Sauce 🥫" },
    { value: "Mayonnaise 🥚", label: "Mayonnaise 🥚" },
    { value: "Mustard 🟡", label: "Mustard 🟡" },
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
        if (decodedPlan.selectedMeatTypes)
          setSelectedMeatTypes(decodedPlan.selectedMeatTypes);
        if (decodedPlan.selectedBeverageTypes)
          setSelectedBeverageTypes(decodedPlan.selectedBeverageTypes);
        if (decodedPlan.selectedSideDishTypes)
          setSelectedSideDishTypes(decodedPlan.selectedSideDishTypes);
        if (decodedPlan.selectedExtrasTypes)
          setSelectedExtrasTypes(decodedPlan.selectedExtrasTypes);
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
        hungerLevel: 3, // Default hunger level (middle of 1-5 scale)
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

  // Handle hunger level change
  const handleHungerLevelChange = (index, level) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index].hungerLevel = level;
    setParticipants(updatedParticipants);
  };

  // Get hunger emoji based on level
  const getHungerEmoji = (level) => {
    switch (parseInt(level)) {
      case 1:
        return "😐 Not hungry";
      case 2:
        return "🙂 Slightly hungry";
      case 3:
        return "😋 Hungry";
      case 4:
        return "😮 Very hungry";
      case 5:
        return "🤤 Starving";
      default:
        return "😋 Hungry";
    }
  };

  // Handle food selection checkboxes
  const handleMeatSelection = (value) => {
    setSelectedMeatTypes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((type) => type !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleBeverageSelection = (value) => {
    setSelectedBeverageTypes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((type) => type !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSideDishSelection = (value) => {
    setSelectedSideDishTypes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((type) => type !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Handle extras selection
  const handleExtrasSelection = (value) => {
    setSelectedExtrasTypes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((type) => type !== value);
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
      alert(
        "Please add participants and select at least one option for each food/beverage category."
      );
      return;
    }

    const totalParticipants = participants.length;
    const veganParticipants = participants.filter((p) => p.isVegan).length;
    const nonVeganParticipants = totalParticipants - veganParticipants;

    // Calculate totals based on rules and hunger levels
    const meatTotals = {};
    selectedMeatTypes.forEach((meatType) => {
      let total = 0;
      participants.forEach((participant) => {
        if (!participant.isVegan) {
          const hungerFactor = 0.5 + participant.hungerLevel * 0.25;
          total += (2 * hungerFactor) / selectedMeatTypes.length;
        }
      });
      meatTotals[meatType] = Math.ceil(total);
    });

    const beverageTotals = {};
    selectedBeverageTypes.forEach((bevType) => {
      let total = 0;
      participants.forEach((participant) => {
        const hungerFactor = 0.75 + participant.hungerLevel * 0.15;
        total += (1.5 * hungerFactor) / selectedBeverageTypes.length;
      });
      beverageTotals[bevType] = Math.ceil(total);
    });

    const sideDishTotals = {};
    selectedSideDishTypes.forEach((sideType) => {
      let total = 0;
      participants.forEach((participant) => {
        const hungerFactor = 0.5 + participant.hungerLevel * 0.25;
        const baseAmount = participant.isVegan ? 2 : 1;
        total += (baseAmount * hungerFactor) / selectedSideDishTypes.length;
      });
      sideDishTotals[sideType] = Math.ceil(total);
    });

    const extrasTotals = {};
    selectedExtrasTypes.forEach((extraType) => {
      const total = Math.max(1, Math.ceil(totalParticipants / 4));
      extrasTotals[extraType] = total;
    });

    const distribution = optimizeDistribution(
      participants,
      meatTotals,
      beverageTotals,
      sideDishTotals,
      extrasTotals
    );

    setCalculationResults({
      totalParticipants,
      veganParticipants,
      meatTotals,
      beverageTotals,
      sideDishTotals,
      extrasTotals,
      distribution,
    });
  };

  const optimizeDistribution = (
    participants,
    meatTotals,
    beverageTotals,
    sideDishTotals,
    extrasTotals
  ) => {
    const distributionParticipants = [...participants];

    const distribution = distributionParticipants.map((p) => ({
      name: p.name,
      isVegan: p.isVegan,
      hungerLevel: p.hungerLevel,
      items: [],
    }));

    const nonVeganParticipants = distributionParticipants
      .map((p, i) =>
        p.isVegan ? null : { index: i, hungerLevel: p.hungerLevel }
      )
      .filter((p) => p !== null)
      .sort((a, b) => b.hungerLevel - a.hungerLevel);

    let meatTypeIndex = 0;
    Object.entries(meatTotals).forEach(([meatType, quantity]) => {
      const personIndex =
        nonVeganParticipants[meatTypeIndex % nonVeganParticipants.length].index;

      distribution[personIndex].items.push({
        type: meatType,
        quantity: quantity,
      });

      meatTypeIndex++;
    });

    const sortedParticipants = distributionParticipants
      .map((p, i) => ({ index: i, hungerLevel: p.hungerLevel }))
      .sort((a, b) => b.hungerLevel - a.hungerLevel);

    let beverageTypeIndex = 0;
    Object.entries(beverageTotals).forEach(([beverageType, quantity]) => {
      const personIndex =
        sortedParticipants[beverageTypeIndex % sortedParticipants.length].index;

      distribution[personIndex].items.push({
        type: beverageType,
        quantity: quantity,
      });

      beverageTypeIndex++;
    });

    const veganParticipants = distributionParticipants
      .map((p, i) =>
        p.isVegan ? { index: i, hungerLevel: p.hungerLevel } : null
      )
      .filter((p) => p !== null)
      .sort((a, b) => b.hungerLevel - a.hungerLevel);

    let sideTypeIndex = 0;
    Object.entries(sideDishTotals).forEach(([sideType, quantity]) => {
      if (veganParticipants.length > 0) {
        const personIndex =
          veganParticipants[sideTypeIndex % veganParticipants.length].index;
        distribution[personIndex].items.push({
          type: sideType,
          quantity: quantity,
        });
      } else {
        const personIndex =
          sortedParticipants[sideTypeIndex % sortedParticipants.length].index;
        distribution[personIndex].items.push({
          type: sideType,
          quantity: quantity,
        });
      }

      sideTypeIndex++;
    });

    let extrasTypeIndex = 0;
    Object.entries(extrasTotals).forEach(([extraType, quantity]) => {
      const participantsByItemCount = [...distribution]
        .map((p, index) => ({ index, itemCount: p.items.length }))
        .sort((a, b) => a.itemCount - b.itemCount);

      const personIndex =
        participantsByItemCount[extrasTypeIndex % participantsByItemCount.length].index;
      distribution[personIndex].items.push({
        type: extraType,
        quantity: quantity,
      });

      extrasTypeIndex++;
    });

    const unassignedParticipants = distribution.filter(
      (p) => p.items.length === 0
    );

    if (unassignedParticipants.length > 0) {
      const overloadedParticipants = distribution
        .map((p, index) => ({ index, itemCount: p.items.length }))
        .filter((p) => p.itemCount > 1)
        .sort((a, b) => b.itemCount - a.itemCount);

      unassignedParticipants.forEach((unassigned, unassignedIndex) => {
        if (overloadedParticipants.length > unassignedIndex) {
          const donorIndex = overloadedParticipants[unassignedIndex].index;
          const itemToMove = distribution[donorIndex].items.pop();

          const recipientIndex = distribution.findIndex(
            (p) => p.name === unassigned.name
          );
          if (recipientIndex >= 0 && itemToMove) {
            distribution[recipientIndex].items.push(itemToMove);
          }
        }
      });
    }

    return distribution;
  };

  const generateExportText = () => {
    if (!calculationResults) return "";

    const {
      totalParticipants,
      veganParticipants,
      meatTotals,
      beverageTotals,
      sideDishTotals,
      extrasTotals,
      distribution,
    } = calculationResults;

    let exportText = `BBQ Plan! ☀️\n\n`;

    exportText += `We need:\n`;

    exportText += `Meat:\n`;
    Object.entries(meatTotals).forEach(([meatType, quantity]) => {
      exportText += `- ${meatType} (Total: ${quantity})\n`;
    });

    exportText += `\nBeverages:\n`;
    Object.entries(beverageTotals).forEach(([beverageType, quantity]) => {
      exportText += `- ${beverageType} (Total: ${quantity})\n`;
    });

    exportText += `\nSides:\n`;
    Object.entries(sideDishTotals).forEach(([sideType, quantity]) => {
      exportText += `- ${sideType} (Total: ${quantity})\n`;
    });

    if (Object.keys(extrasTotals).length > 0) {
      exportText += `\nExtras:\n`;
      Object.entries(extrasTotals).forEach(([extraType, quantity]) => {
        exportText += `- ${extraType} (Total: ${quantity})\n`;
      });
    }

    exportText += `\nParticipants (${totalParticipants} total, ${veganParticipants} Vegan${
      veganParticipants !== 1 ? "s" : ""
    }):\n`;

    participants.forEach((p) => {
      exportText += `- ${p.name}${
        p.isVegan ? " (Vegan)" : ""
      } - ${getHungerEmoji(p.hungerLevel)}\n`;
    });

    exportText += `\nSuggested Contributions:\n`;
    distribution.forEach((p) => {
      exportText += `- ${p.name}${
        p.isVegan ? " (Vegan)" : ""
      } (${getHungerEmoji(p.hungerLevel)}): `;

      if (p.items.length > 0) {
        const itemsText = p.items
          .map((item) => `${item.quantity} ${item.type}`)
          .join(", ");
        exportText += itemsText;
      } else {
        exportText += "Nothing assigned (please coordinate with group)";
      }

      exportText += "\n";
    });

    exportText += `\n(Note: This is just a suggestion for splitting items!)`;

    return exportText;
  };

  const handleExport = () => {
    const exportText = generateExportText();

    const textArea = document.createElement("textarea");
    textArea.value = exportText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    alert("BBQ plan copied to clipboard!");
  };

  const generateShareURL = () => {
    const planData = {
      participants,
      selectedMeatTypes,
      selectedBeverageTypes,
      selectedSideDishTypes,
      selectedExtrasTypes,
    };

    try {
      const encodedData = encodeURIComponent(JSON.stringify(planData));
      const shareURL = `${window.location.origin}${window.location.pathname}?plan=${encodedData}`;

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

          <div className="selector">
            <label>Select Extras (choose multiple):</label>
            <div className="checkbox-container">
              {extrasOptions.map((option) => (
                <label key={option.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedExtrasTypes.includes(option.value)}
                    onChange={() => handleExtrasSelection(option.value)}
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
                      <div className="participant-info">
                        <span className="participant-name">
                          {participant.name}
                        </span>
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
                      </div>

                      <div className="hunger-slider">
                        <label>
                          How hungry?{" "}
                          {getHungerEmoji(participant.hungerLevel || 3)}
                        </label>
                        <div className="slider-container">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={participant.hungerLevel || 3}
                            onChange={(e) =>
                              handleHungerLevelChange(
                                index,
                                parseInt(e.target.value)
                              )
                            }
                            className="hunger-range"
                          />
                          <div className="hunger-scale">
                            <span>😐</span>
                            <span>🙂</span>
                            <span>😋</span>
                            <span>😮</span>
                            <span>🤤</span>
                          </div>
                        </div>
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
                    {Object.entries(calculationResults.meatTotals).map(
                      ([meatType, quantity]) => (
                        <li key={meatType}>
                          {meatType} - Total: {quantity} units
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="totals-section">
                  <h4>Beverages:</h4>
                  <ul>
                    {Object.entries(calculationResults.beverageTotals).map(
                      ([bevType, quantity]) => (
                        <li key={bevType}>
                          {bevType} - Total: {quantity} units
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="totals-section">
                  <h4>Side Dishes:</h4>
                  <ul>
                    {Object.entries(calculationResults.sideDishTotals).map(
                      ([sideType, quantity]) => (
                        <li key={sideType}>
                          {sideType} - Total: {quantity} units
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {calculationResults.extrasTotals &&
                  Object.keys(calculationResults.extrasTotals).length > 0 && (
                    <div className="totals-section">
                      <h4>Extras:</h4>
                      <ul>
                        {Object.entries(calculationResults.extrasTotals).map(
                          ([extraType, quantity]) => (
                            <li key={extraType}>
                              {extraType} - Total: {quantity} units
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>

              <div className="distribution">
                <h4>Suggested Distribution:</h4>
                <ul>
                  {calculationResults.distribution.map((person, index) => (
                    <li key={index}>
                      <strong>
                        {person.name}
                        {person.isVegan ? " (Vegan)" : ""} (
                        {getHungerEmoji(person.hungerLevel)}):
                      </strong>{" "}
                      {person.items.length > 0
                        ? person.items.map((item, i) => (
                            <span key={i}>
                              {i > 0 && ", "}
                              {item.quantity} {item.type}
                            </span>
                          ))
                        : "Nothing assigned"}
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
