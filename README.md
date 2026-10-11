# 🎓 EduQuiz — Online E-Learning Quiz Platform

An interactive, responsive, and beginner-friendly **E-Learning Quiz Web Application** designed for students and educators. Built using **only standard HTML, CSS, and Vanilla JavaScript**, it runs completely client-side without requiring Python, Node.js, Express, MongoDB, or any external backend setup.

---

## 📌 Project Overview
EduQuiz allows users to test and expand their knowledge across various subjects. It connects to **free, real-time public trivia APIs** with cache-busting to serve **new, randomized questions on every attempt**. It also features an offline backup bank, custom question creation, real-time timer countdowns, a 50:50 lifeline, interactive scorecards, and persistent local storage history.

---

## 🛠️ Technology Stack
| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic elements, accessible form controls, and clean layout structures |
| **Styling** | Vanilla CSS3 | Modern flexbox & grid design, responsive layouts, color variables, zero external UI libraries |
| **Logic & Engine** | Vanilla JavaScript (ES6+) | Asynchronous `fetch` calls, timer intervals, array manipulation, and DOM manipulation |
| **Data Persistence** | Browser `localStorage` API | Persists recent quiz scores, accuracy percentages, and user-created custom questions |
| **Question APIs** | [The Trivia API](https://the-trivia-api.com/) & [OpenTDB](https://opentdb.com/) | 100% free, keyless public trivia databases delivering thousands of diverse questions |
| **Execution Environment** | VS Code Live Server | Runs locally on `http://127.0.0.1:5500` or direct browser execution |

---

## ✨ Key Features & Functionality

### 1. 🎲 Dynamic & Randomized Questions
- **Surprise Me! Mode**: Fetches random questions across multiple categories for a unique challenge every round.
- **Topic Selection**:
  - 🔬 **Science & Nature**
  - 🧠 **General Knowledge**
  - 📜 **History**
  - 🌍 **Geography & World**
  - 🎵 **Music & Entertainment**
  - 🎬 **Movies & TV**
  - ⚽ **Sports & Games**
  - 💻 **Computer Science & IT**
  - 🌐 **Web Development** *(Offline built-in questions)*
  - 📝 **My Custom Saved Questions**
- **Cache-Busting Mechanism**: Every API request includes a dynamic timestamp query (`_t=${Date.now()}`), guaranteeing fresh questions without browser caching.

### 2. ⚡ Quiz Mechanics
- **Configurable Countdown Timer**: Choose between 15s (fast-paced), 30s (standard), 60s (relaxed), or 0s (untimed study mode).
- **50:50 Lifeline**: Eliminates two incorrect options to assist the user on difficult questions.
- **Visual Progress Bar**: Real-time progress tracker showing the current question number and total count.
- **Immediate Feedback**: Instant visual cues (green for correct, red for incorrect) upon selecting an answer.

### 3. 📊 Scorecard & Performance Review
- **Summary Metrics**: Displays accuracy percentage, correct count, incorrect count, points, and total time taken.
- **Detailed Question Review**: Review each question alongside your submitted choice and the verified correct answer.

### 4. 🏆 Leaderboard & History
- Saves your last 10 quiz attempts in your browser's `localStorage`.
- Tracks date, category, score, time taken, and accuracy percentage.

### 5. ➕ Custom Question Creator
- Add your own custom multiple-choice questions via an intuitive modal.
- Saved directly to `localStorage` for personalized testing or revision.

---

## 📂 Project Structure
```text
e-learning quiz platform/
├── index.html        # Main HTML structure, quiz interface, and modals
├── style.css         # Clean, readable CSS design system and responsive styles
├── script.js         # Complete quiz engine, API fetch logic, timer, and storage
└── README.md         # Comprehensive project documentation
```

---

## 🚀 How to Run the Project

### Option A: Using VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Make sure the **Live Server** extension (by Ritwick Dey) is installed.
3. Right-click on [index.html](file:///c:/AMAR%20SINGH%20KATIYAR%201/3%20rd%20year%20all%20coding%20and%20development/github/College%20Project/e-learning%20quiz%20platform/index.html).
4. Select **"Open with Live Server"** (or click **Go Live** on the bottom right status bar).
5. The application will launch in your browser at:
   ```text
   http://127.0.0.1:5500/index.html
   ```

### Option B: Direct Browser Launch (No tools required)
- Double-click [index.html](file:///c:/AMAR%20SINGH%20KATIYAR%201/3%20rd%20year%20all%20coding%20and%20development/github/College%20Project/e-learning%20quiz%20platform/index.html) in your Windows File Explorer to open it in Chrome, Edge, or Firefox.

---

## 🎓 College Viva & Presentation Talking Points

When presenting this project to evaluators:
1. **Zero-Backend Client-Side Architecture**: Emphasize how modern web standards allow building fully functional, interactive applications using only HTML5, CSS3, and JavaScript.
2. **Asynchronous JavaScript**: Explain how `async/await` and the `fetch()` API communicate with public REST endpoints asynchronously without page reloads.
3. **Resilience & Fallback Strategy**: Highlight that if an external API is down or the computer is offline, the platform automatically falls back to the internal question bank without crashing.
4. **Data Persistence**: Describe how `localStorage.setItem()` and `localStorage.getItem()` handle user history and custom questions across page refreshes.
