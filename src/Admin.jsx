import { useState } from "react";

export default function Admin(){
  const [f, setF] = useState({roll:"",name:"",math:"",phy:"",chem:""});
  const [msg, setMsg] = useState("");

  async function save(){
    const x = await fetch("/api/marks",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(f)
    });
    const r = await x.json();
    setMsg(r.error ? r.error : "✅ Saved Successfully!");
    setTimeout(() => setMsg(""), 3000);
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
        <h1 style={{ color: "#667eea", marginTop: 0, marginBottom: "2rem" }}>🔐 Admin Panel</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input 
            style={{
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "10px",
              fontSize: "1em",
              transition: "border-color 0.3s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            placeholder="Roll Number" 
            value={f.roll}
            onChange={e=>setF({...f,roll:e.target.value})}
          />
          
          <input 
            style={{
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "10px",
              fontSize: "1em",
              transition: "border-color 0.3s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            placeholder="Student Name" 
            value={f.name}
            onChange={e=>setF({...f,name:e.target.value})}
          />
          
          <input 
            style={{
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "10px",
              fontSize: "1em",
              transition: "border-color 0.3s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            placeholder="Math Score" 
            type="number"
            value={f.math}
            onChange={e=>setF({...f,math:e.target.value})}
          />
          
          <input 
            style={{
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "10px",
              fontSize: "1em",
              transition: "border-color 0.3s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            placeholder="Physics Score" 
            type="number"
            value={f.phy}
            onChange={e=>setF({...f,phy:e.target.value})}
          />
          
          <input 
            style={{
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "10px",
              fontSize: "1em",
              transition: "border-color 0.3s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            placeholder="Chemistry Score" 
            type="number"
            value={f.chem}
            onChange={e=>setF({...f,chem:e.target.value})}
          />
        </div>

        <button 
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "1.5rem",
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1.1em",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#764ba2";
            e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.4)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#667eea";
            e.target.style.boxShadow = "none";
            e.target.style.transform = "translateY(0)";
          }}
          onClick={save}
        >
          💾 Save Marks
        </button>

        {msg && (
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: msg.includes("✅") ? "rgba(46, 204, 113, 0.1)" : "rgba(231, 76, 60, 0.1)",
            color: msg.includes("✅") ? "#2ecc71" : "#e74c3c",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "1.1em",
            border: `2px solid ${msg.includes("✅") ? "#2ecc71" : "#e74c3c"}`
          }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
