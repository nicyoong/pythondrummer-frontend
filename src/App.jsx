import { useEffect, useState } from "react";
import DrumPad from "./DrumPad";

export default function App() {
  const [config, setConfig] = useState(null);
  const [pattern, setPattern] = useState([]);
  const [bpm, setBpm] = useState(100);
  const [swing, setSwing] = useState(0);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    fetch("http://localhost:8000/config")
      .then((res) => res.json())
      .then(setConfig);
    fetch("http://localhost:8000/pattern")
      .then((res) => res.json())
      .then((data) => setPattern(data.pattern));
  }, []);

  const newPattern = async () => {
    const res = await fetch("http://localhost:8000/pattern");
    const data = await res.json();
    setPattern(data.pattern);
  };

  const updateBpm = async (value) => {
    setBpm(value);
    await fetch(`http://localhost:8000/bpm/${value}`, { method: "POST" });
  };

  const updateSwing = async (value) => {
    setSwing(value);
    await fetch(`http://localhost:8000/swing/${value}`, { method: "POST" });
  };

  if (!config) return <p>Loading...</p>;

  return (
    <div className="p-6 text-center font-sans">
      <h1 className="text-2xl font-bold mb-4">🥁 Web Drum Machine</h1>
      <div className="controls mb-6">
        <label>
          BPM: <input type="range" min="60" max="180" value={bpm} onChange={(e) => updateBpm(e.target.value)} />
          {bpm}
        </label>
        <br />
        <label>
          Swing: <input type="range" min="0" max="0.5" step="0.05" value={swing} onChange={(e) => updateSwing(e.target.value)} />
          {swing}
        </label>
        <br />
        <label>
          Volume:{" "} <input type="range" min="0" max="100" step="1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
          {volume}
      </label>
        <button onClick={newPattern} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">🔁 New Pattern</button>
      </div>
      <DrumPad pattern={pattern} samples={config.samples} bpm={bpm} volume={volume} />
    </div>
  );
}
