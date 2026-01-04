import { useState } from "react";

export default function Result(){
  const [roll, setRoll] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  async function show(){
    setError("");
    setStudent(null);
    const x = await fetch(`/api/marks/${roll}`);
    const s = await x.json();
    if(s.error){ setError("Not Found"); return; }
    setStudent(s);
  }

  return(
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "3rem",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        maxWidth: "500px",
        width: "100%"
      }}>
        <h1 style={{ color: "#667eea", marginTop: 0, marginBottom: "1.5rem" }}>📊 Student Result Portal</h1>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
          <input 
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "10px",
              fontSize: "1em",
              transition: "border-color 0.3s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            placeholder="Enter Roll No"
            value={roll} 
            onChange={e=>setRoll(e.target.value)}
          />
          <button 
            style={{
              padding: "12px 24px",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#764ba2";
              e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#667eea";
              e.target.style.boxShadow = "none";
            }}
            onClick={show}
          >
            Search
          </button>
        </div>

        {error && <p style={{ 
          color: "#e74c3c", 
          fontSize: "1.1em",
          fontWeight: "600",
          textAlign: "center",
          marginTop: "1rem"
        }}>❌ {error}</p>}

        {student && (
          <div style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "2rem",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)"
          }}>
            <h2 style={{ marginTop: 0, fontSize: "1.8em", marginBottom: "1.5rem" }}>{student.name}</h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem"
            }}>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                padding: "1rem",
                borderRadius: "10px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.9em", opacity: 0.9 }}>Math</div>
                <div style={{ fontSize: "1.8em", fontWeight: "bold" }}>{student.math}</div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                padding: "1rem",
                borderRadius: "10px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.9em", opacity: 0.9 }}>Physics</div>
                <div style={{ fontSize: "1.8em", fontWeight: "bold" }}>{student.phy}</div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                padding: "1rem",
                borderRadius: "10px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.9em", opacity: 0.9 }}>Chemistry</div>
                <div style={{ fontSize: "1.8em", fontWeight: "bold" }}>{student.chem}</div>
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "1rem",
              borderRadius: "10px",
              marginBottom: "1rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.1em", marginBottom: "0.5rem" }}>Average Score</div>
              <div style={{ fontSize: "2em", fontWeight: "bold" }}>
                {((student.math+student.phy+student.chem)/3).toFixed(2)}%
              </div>
            </div>

            <div style={{
              background: ((student.math+student.phy+student.chem)/3)>=40 ? "rgba(46, 204, 113, 0.3)" : "rgba(231, 76, 60, 0.3)",
              color: ((student.math+student.phy+student.chem)/3)>=40 ? "#2ecc71" : "#e74c3c",
              padding: "1rem",
              borderRadius: "10px",
              textAlign: "center",
              fontSize: "1.4em",
              fontWeight: "bold"
            }}>
              {((student.math+student.phy+student.chem)/3)>=40 ? "✅ PASS" : "❌ FAIL"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
