import './App.css';
import { useEffect, useMemo, useState } from 'react';

const NOTE_STEPS = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const NOTE_NAME_BY_STEP = {
  '-1': 're',
  0: 'mi',
  1: 'fa',
  2: 'sol',
  3: 'la',
  4: 'si',
  5: 'do',
  6: 're',
  7: 'mi',
  8: 'fa',
  9: 'sol',
};

const STAFF_BASE = {
  height: 220,
  top: 80,
  lineSpacing: 18,
};

const getStaffConfig = (count) => {
  if (count <= 5) {
    return {
      ...STAFF_BASE,
      width: 680,
      leftPadding: 150,
      rightPadding: 90,
    };
  }
  if (count <= 6) {
    return {
      ...STAFF_BASE,
      width: 700,
      leftPadding: 120,
      rightPadding: 40,
    };
  }
  if (count <= 7) {
    return {
      ...STAFF_BASE,
      width: 780,
      leftPadding: 130,
      rightPadding: 50,
    };
  }
  return {
    ...STAFF_BASE,
    width: 900,
    leftPadding: 150,
    rightPadding: 60,
  };
};

const getNoteY = (step, staffBottom, noteStepSize) =>
  staffBottom - step * noteStepSize;

const getNoteCountForWidth = (width) => {
  if (width < 500) {
    return 5;
  }
  if (width < 700) {
    return 7;
  }
  return 10;
};

const buildNotes = (count) =>
  Array.from({ length: count }, (_, index) => {
    const step = NOTE_STEPS[Math.floor(Math.random() * NOTE_STEPS.length)];
    return {
      id: `${Date.now()}-${index}-${Math.random()}`,
      step,
      name: NOTE_NAME_BY_STEP[step],
    };
  });

function App() {
  const [noteCount, setNoteCount] = useState(() => getNoteCountForWidth(window.innerWidth));
  const [notes, setNotes] = useState(() => buildNotes(noteCount));
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const staff = useMemo(() => getStaffConfig(noteCount), [noteCount]);
  const noteStepSize = staff.lineSpacing / 2;
  const staffBottom = staff.top + staff.lineSpacing * 4;
  const noteSpacing = useMemo(
    () => (staff.width - staff.leftPadding - staff.rightPadding) / (noteCount - 1),
    [noteCount, staff.leftPadding, staff.rightPadding, staff.width]
  );
  const staffLines = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => ({
        y: staffBottom - index * staff.lineSpacing,
      })),
    [staff.lineSpacing, staffBottom]
  );

  useEffect(() => {
    const handleResize = () => {
      const nextCount = getNoteCountForWidth(window.innerWidth);
      setNoteCount((prevCount) => {
        if (prevCount === nextCount) {
          return prevCount;
        }
        setNotes(buildNotes(nextCount));
        setSelectedNoteId(null);
        return nextCount;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const refreshNotes = () => {
    setNotes(buildNotes(noteCount));
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
              Aşağıdaki her nota için doğru adı (do, re, mi, fa, sol, la, si) zihninden söyle.
            </p>
          </div>
          <button type="button" className="App-button" onClick={refreshNotes}>
            Yeni notalar getir
          </button>
        </header>

        <section className="Staff-card">
          <svg
            className="Staff"
            viewBox={`0 0 ${staff.width} ${staff.height}`}
            role="img"
            aria-label="Rastgele notalarla oluşturulmuş nota çizgisi"
          >
            <defs>
              <linearGradient id="staffGlow" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#f8f1e8" />
                <stop offset="100%" stopColor="#efe1c7" />
              </linearGradient>
            </defs>

            <rect x="30" y="30" width={staff.width - 60} height="160" rx="26" fill="url(#staffGlow)" />

            {staffLines.map((line, index) => (
                <line
                  key={`line-${index}`}
                  x1="60"
                  x2={staff.width - 40}
                  y1={line.y}
                  y2={line.y}
                  className="Staff-line"
                />
            ))}

            <image
              href={`${process.env.PUBLIC_URL}/sol.jpg`}
              x="48"
              y="38"
              width="100"
              height="144"
              preserveAspectRatio="xMidYMid meet"
              className="Staff-clef-image"
            />

            {notes.map((note, index) => {
              const x = staff.leftPadding + index * noteSpacing;
              const y = getNoteY(note.step, staffBottom, noteStepSize);
              const stemUp = note.step <= 4;
              const stemLength = 40;
              const headWidth = 21;
              const headHeight = 14;
              const hitPaddingX = 2;
              const hitPaddingY = 2;
              const headTop = y - headHeight / 2;
              const headBottom = y + headHeight / 2;
              const stemEndY = stemUp ? y - stemLength : y + stemLength;
              const hitTop = Math.min(headTop, stemEndY) - hitPaddingY;
              const hitBottom = Math.max(headBottom, stemEndY) + hitPaddingY;

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
                  <rect
                    x={x - headWidth / 2 - hitPaddingX}
                    y={hitTop}
                    width={headWidth + hitPaddingX * 2}
                    height={hitBottom - hitTop}
                    fill="transparent"
                  />
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
