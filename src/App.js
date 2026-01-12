import './App.css';
import { useMemo, useState } from 'react';

const NOTE_COUNT = 10;
const NOTE_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const NOTE_NAMES = ['mi', 'fa', 'sol', 'la', 'si', 'do', 're', 'mi', 'fa'];

const STAFF = {
  width: 900,
  height: 220,
  top: 80,
  lineSpacing: 18,
  leftPadding: 150,
  rightPadding: 60,
};

const noteStepSize = STAFF.lineSpacing / 2;
const staffBottom = STAFF.top + STAFF.lineSpacing * 4;

const getNoteY = (step) => staffBottom - step * noteStepSize;

const buildNotes = (count) =>
  Array.from({ length: count }, (_, index) => {
    const step = NOTE_STEPS[Math.floor(Math.random() * NOTE_STEPS.length)];
    return {
      id: `${Date.now()}-${index}-${Math.random()}`,
      step,
      name: NOTE_NAMES[step],
    };
  });

function App() {
  const [notes, setNotes] = useState(() => buildNotes(NOTE_COUNT));
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const noteSpacing = useMemo(
    () => (STAFF.width - STAFF.leftPadding - STAFF.rightPadding) / (NOTE_COUNT - 1),
    []
  );
  const staffLines = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => ({
        y: staffBottom - index * STAFF.lineSpacing,
      })),
    []
  );

  const refreshNotes = () => {
    setNotes(buildNotes(NOTE_COUNT));
    setSelectedNoteId(null);
  };
  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  return (
    <div className="App">
      <main className="App-shell">
        <header className="App-header">
          <div>
            <h1>Gördüğün notaları isimlendir</h1>
            <p className="App-subtitle">
              Aşağıdaki çizgideki her nota için doğru adı (do, re, mi, fa, sol, la, si) zihninden söyle.
            </p>
          </div>
          <button type="button" className="App-button" onClick={refreshNotes}>
            Yeni sorular getir
          </button>
        </header>

        <section className="Staff-card">
          <svg
            className="Staff"
            viewBox={`0 0 ${STAFF.width} ${STAFF.height}`}
            role="img"
            aria-label="Rastgele notalarla oluşturulmuş nota çizgisi"
          >
            <defs>
              <linearGradient id="staffGlow" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#f8f1e8" />
                <stop offset="100%" stopColor="#efe1c7" />
              </linearGradient>
            </defs>

            <rect x="30" y="30" width="840" height="160" rx="26" fill="url(#staffGlow)" />

            {staffLines.map((line, index) => (
              <line
                key={`line-${index}`}
                x1="60"
                x2={STAFF.width - 40}
                y1={line.y}
                y2={line.y}
                className="Staff-line"
              />
            ))}

            <text
              x="65"
              y="120"
              className="Staff-clef"
              dominantBaseline="middle"
            >
              𝄞
            </text>

            {notes.map((note, index) => {
              const x = STAFF.leftPadding + index * noteSpacing;
              const y = getNoteY(note.step);
              const stemUp = note.step <= 4;
              const stemLength = 40;
              const headWidth = 21;
              const headHeight = 14;

              return (
                <g
                  key={note.id}
                  className={`Staff-note${note.id === selectedNoteId ? ' is-selected' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${index + 1}. nota`}
                  onClick={() => setSelectedNoteId(note.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      setSelectedNoteId(note.id);
                    }
                  }}
                >
                  <ellipse
                    cx={x}
                    cy={y}
                    rx={headWidth / 2 }
                    ry={headHeight / 2 }
                    transform={`rotate(-18 ${x} ${y})`}
                  />
                  <line
                    x1={stemUp ? x + headWidth / 2 - 2 : x - headWidth / 2 + 2}
                    x2={stemUp ? x + headWidth / 2 - 2 : x - headWidth / 2 + 2}
                    y1={y}
                    y2={stemUp ? y - stemLength : y + stemLength}
                    className="Staff-stem"
                  />
                </g>
              );
            })}
          </svg>
          <div className="Staff-answer" aria-live="polite">
            {selectedNote ? (
              <>
                Seçili nota: <strong>{selectedNote.name}</strong>
              </>
            ) : (
              'Notaya tıklayınca adı burada görünecek.'
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
