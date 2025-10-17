import React from "react";

// Habits Data
const habits = [
  { id: 1, name: "Meditating", completed: true },
  { id: 2, name: "Read Philosophy", completed: true },
  { id: 3, name: "Journaling", completed: false }
];

function HomePage() {
  const completed = habits.filter(h => h.completed).length;
  const total = habits.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#faf8f7",
      fontFamily: "'Poppins', Arial, sans-serif"
    }}>
      {/* Top Navigation Bar */}
      <header style={{
        width: "100%",
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        padding: "16px 0",
        marginBottom: 32,
        textAlign: "center"
      }}>
        <h1 style={{
          fontWeight: 700, fontSize: 26, letterSpacing: "-1px",
          color: "#FB9930"
        }}>
          Habit Tracker
        </h1>
      </header>

      <main style={{
        maxWidth: 420,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 18,
        padding: 28,
        boxShadow: "0 3px 16px rgba(200,150,90,0.09)"
      }}>
        {/* Greeting and Date */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>
            Sun, 1 March 2022
          </div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>
            Hello, <span style={{ color: "#FB9930" }}>Susy!</span>
          </div>
        </div>
        
        {/* Progress Card */}
        <section style={{
          background: "linear-gradient(90deg, #FF822E 60%, #FB9930 100%)",
          borderRadius: 16,
          padding: "22px 28px 18px 20px",
          margin: "22px 0",
          color: "#fff",
          position: "relative"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Circular Progress */}
            <div style={{ position: "relative", width: 75, height: 75 }}>
              <svg width="75" height="75">
                <circle
                  cx="37.5" cy="37.5" r="32"
                  stroke="#fff" strokeWidth="7"
                  fill="none"
                  opacity="0.20"
                />
                <circle
                  cx="37.5" cy="37.5" r="32"
                  stroke="#fff" strokeWidth="7"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - percent/100)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s" }}
                />
              </svg>
              <div style={{
                position: "absolute", left: 0, top: 0,
                width: "75px", height: "75px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700
              }}>
                {percent}%
              </div>
            </div>
            <div style={{ marginLeft: 26 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {completed} of {total} habits
              </div>
              <div style={{ fontSize: 15, opacity: 0.87 }}>completed today!</div>
            </div>
          </div>
        </section>

        {/* Today's Habits List */}
        <section>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8
          }}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>
              Today Habit
            </div>
            <a href="#" style={{ color: "#FB9930", fontSize: 13, textDecoration: "none" }}>See all</a>
          </div>
          <div style={{}}>
            {habits.map(habit => (
              <div key={habit.id} style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #f3efee",
                padding: "12px 0"
              }}>
                <span style={{
                  fontSize: 16,
                  flex: 1,
                  color: habit.completed ? "#15b798" : "#222",
                  opacity: habit.completed ? 0.7 : 1
                }}>{habit.name}</span>
                {habit.completed
                  ? <span style={{
                      width: 26, height: 26,
                      background: "#E8F8F3", borderRadius: 8,
                      display: "inline-flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <svg width="16" height="16" fill="#15b798"><path d="M13.6 5.7l-5.1 6.3c-.3.3-.8.4-1.1.1l-3.2-3.1c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.6 4.7-5.7c.3-.3.8-.4 1.1-.1.4.3.5.8.1 1.1z"/></svg>
                    </span>
                  : <input type="checkbox" style={{ width: 21, height: 21, accentColor: "#FB9930" }}/>
                }
              </div>
            ))}
          </div>
        </section>

        {/* Goals area */}
        <section style={{
          background: "#F7F7F6",
          borderRadius: 14,
          padding: "16px 13px",
          margin: "28px 0 10px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            Your Goals
          </div>
          <button style={{
            width: 36, height: 36,
            background: "#15b798",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            fontSize: 24,
            fontWeight: 700,
            cursor: "pointer"
          }}>+</button>
        </section>
      </main>
      {/* Footer */}
      <footer style={{
        width: "100%",
        textAlign: "center",
        marginTop: 68,
        color: "#bbb",
        fontSize: 14
      }}>
        &copy; 2025 Habit Tracker Web
      </footer>
    </div>
  );
}

export default HomePage;
