# Project Requirements: BBQ Organizer React App

## 1. Project Goal

Create a simple, client-side single-page application (SPA) using React.js to help users organize BBQs with friends. The app will allow users to list participants, select food and beverage types, calculate the total amount needed, suggest an equal distribution of items for participants to bring, and share the plan via a link.

**No database or backend services are required.** All state management and data handling will occur client-side.

## 2. Core Requirements

### 2.1. Starting Environment

- The development will start from a standard React project setup (e.g., created via `create-react-app` or Vite with React template).
- Assume an `index.js` (or `main.jsx`) file that renders the main `App.js` (or `App.jsx`) component. All development should happen within `App.js` and its child components.

### 2.2. Responsiveness

- The application **must** be fully responsive and usable on various screen sizes, especially mobile phones.
- Utilize modern CSS techniques like Flexbox or Grid for layout.

### 2.3. Participant Management

- **Add Participant:**
  - An input field (`type="text"`) for entering a participant's name.
  - An "Add Participant" button.
  - Clicking the button adds the name from the input field to a list of participants displayed on the page. Clear the input field after adding.
- **Vegan Status:**
  - Next to each participant's name in the list, display a checkbox or a simple toggle switch (using Flexbox for layout as requested: `display: flex; align-items: center;`).
  - This toggle indicates whether the participant is vegan (default to non-vegan).
  - The state (vegan/non-vegan) for each participant must be stored.
- **Display List:**
  - Show the current list of participants with their names and vegan status indicator.
- **(Optional but Recommended):** Add a way to remove a participant from the list (e.g., a small 'X' button next to each name).

### 2.4. Food & Beverage Selection

- Display three dropdown menus (`<select>`) at the top of the page (before the participant list).
- **Dropdown 1: Meat Selection:**
  - Label: "Select Meat Type"
  - Options (include relevant emojis):
    - Sausages 🌭
    - Wurstel 🍖
    - Ribs 🥩
    - Chicken Wings 🍗
    - Burgers 🍔
    - (Add a default "Select..." option)
  - The user selects **one** primary meat type for the calculation.
- **Dropdown 2: Beverage Selection:**
  - Label: "Select Beverage Type"
  - Options (include relevant emojis):
    - Beer 🍺
    - Wine 🍷
    - Coca-Cola 🥤
    - Water 💧
    - Juice 🧃
    - (Add a default "Select..." option)
  - The user selects **one** primary beverage type.
- **Dropdown 3: Non-Meat Food Selection:**
  - Label: "Select Side Dish"
  - Options (include relevant emojis):
    - Potatoes 🥔
    - Peppers 🌶️
    - Zucchini 🥒
    - Corn on the Cob 🌽
    - Salad 🥗
    - (Add a default "Select..." option)
  - The user selects **one** primary non-meat food item.

### 2.5. Calculation Logic & Display

- **"Calculate Needs" Button:**
  - A button placed after the participant list and selection dropdowns.
  - When clicked, it triggers the calculation based on the participant list (including vegan status) and the selected food/beverage items.
- **Calculation Rules:**
  - **Define Base Quantities (Example - use these or similar):**
    - Meat: 2 units per non-vegan person (e.g., 2 sausages).
    - Beverage: 1.5 units per person (e.g., 1.5 beers - maybe round up totals).
    - Non-Meat Food: 1 unit per non-vegan person, 2 units per vegan person.
  - **Vegan Consideration:** Vegans do not consume meat. Adjust non-meat food quantities for them as defined above.
  - **Total Calculation:** Calculate the _total_ amount needed for each selected item category based on the number of participants and their vegan status.
- **Display Results:**
  - After clicking "Calculate Needs", display a section showing:
    - Total number of participants.
    - Number of vegan participants.
    - The selected Meat, Beverage, and Non-Meat items (with emojis).
    - The **total calculated quantity** needed for each selected item.
    - A **suggested distribution** of what each person needs to bring. Divide the total quantities as evenly as possible among _all_ participants, respecting vegan constraints (vegans don't bring meat).

### 2.6. Export Results

- **"Export for Group Chat" Button:**
  - A button near the results section.
  - When clicked, generate a simple, pre-formatted plain text summary of the BBQ plan.
- **Export Format (Example):**

  ```text
  BBQ Plan! ☀️

  We need:
  - Meat: Sausages 🌭 (Total: 10)
  - Drink: Beer 🍺 (Total: 8)
  - Side: Potatoes 🥔 (Total: 7)

  Participants (6 total, 1 Vegan):
  - Alice
  - Bob (Vegan)
  - Charlie
  - David
  - Eve
  - Frank

  Suggested Contributions:
  - Alice: 2 Sausages 🌭, 1 Beer 🍺, 1 Potato 🥔
  - Bob (Vegan): 2 Beers 🍺, 2 Potatoes 🥔
  - Charlie: 2 Sausages 🌭, 1 Beer 🍺, 1 Potato 🥔
  - David: 2 Sausages 🌭, 1 Beer 🍺, 1 Potato 🥔
  - Eve: 2 Sausages 🌭, 1 Beer 🍺, 1 Potato 🥔
  - Frank: 2 Sausages 🌭, 2 Beers 🍺, 1 Potato 🥔

  (Note: This is just a suggestion for splitting items!)
  ```

- **Display Export Text:** Show the generated text in a modal window or a `<textarea>` so the user can easily copy and paste it (e.g., into WhatsApp).

### 2.7. Share Functionality

- **"Share Plan" Button:**
  - A button, perhaps near the export button.
- **Generate Link:**
  - When clicked, capture the current state:
    - List of participants (names and vegan status).
    - Selected meat, beverage, and non-meat item.
  - Serialize this state into a JSON string.
  - Encode the JSON string using Base64 (or `encodeURIComponent` for URL safety).
  - Generate a URL containing this encoded state as a query parameter (e.g., `https://your-bbq-app-url.com/?plan=BASE64_ENCODED_STRING`).
  - Display this generated link to the user (e.g., in a prompt or read-only input field) so they can copy it.
- **Load from Link:**
  - On application load (`useEffect` hook in `App.js`), check if the URL contains the `plan` query parameter.
  - If found:
    - Decode the parameter value (Base64 or `decodeURIComponent`).
    - Parse the JSON string back into an object.
    - Use this object to **pre-populate** the application's state (participant list, dropdown selections).

## 3. Technical Requirements

- **Framework:** React.js (using functional components and Hooks: `useState`, `useEffect`, potentially `useReducer` or `useContext` if state complexity warrants it, but start simple).
- **Styling:** Use standard CSS, CSS Modules, or a simple CSS-in-JS solution like Styled Components (optional). Focus on clean, modern aesthetics. Use emojis as requested.
- **State Management:** Primarily use component state (`useState`). Avoid complex state management libraries unless necessary.
- **No External Dependencies (beyond React/Build Tool):** Do not integrate databases, backend APIs, or cloud services.
- **Code Structure:** Organize code into logical components (e.g., `ParticipantList`, `ParticipantItem`, `FoodSelector`, `ResultsDisplay`).

## 4. UI/UX Requirements

- **Modern Style:** Clean layout, good spacing, readable fonts.
- **Intuitive Flow:** Easy for a user to understand the steps: add people -> select items -> calculate -> view/share/export.
- **Clear Feedback:** Indicate when participants are added, results are calculated, or links are generated.
- **Error Handling (Basic):** Prevent calculation if no participants are added or if essential items aren't selected. Display simple user-friendly messages.

## 5. Calculation & Distribution Algorithm Details

- **Total Calculation:** Sum quantities based on rules in 2.5. Ensure floating point numbers for averages (like 1.5 beverages) are handled reasonably (e.g., calculate total, then round final total _up_ to nearest whole number).
- **Distribution Algorithm:**
  1.  Calculate total items needed (e.g., 10 sausages, 8 beers, 7 potatoes).
  2.  Iterate through the participants list.
  3.  Assign items one by one, ensuring vegans do not get assigned meat. Try to distribute as evenly as possible. This might involve keeping track of how much each person is already assigned.
  4.  _Simpler approach for the output text:_ Calculate totals. For the "Who Brings What" suggestion, simply list each participant and _suggest_ an even share (e.g., `Total Meat / Num Non-Vegans`), acknowledging it might not be perfect whole numbers and vegans bring extra non-meat/drinks. The primary goal is the _total calculation_ and the _export text format_. The exact distribution logic can be basic.
