import { useState, useEffect } from 'react';
import './App.css';
import { db } from './components/firebase'; // Make sure this path is correct

import seedData from './components/firebaseSeeder.js';
import {
  collection,
  getDocs
} from 'firebase/firestore';

function App() {
  const [sections, setSections] = useState([]);
  const [programsBySection, setProgramsBySection] = useState({});

  useEffect(() => {
    const runSeed = async () => {
      try {
        await seedData();
        console.log('✅ Firebase seed completed.');
      } catch (error) {
        console.error('❌ Error running seed script:', error);
      }
    };

    runSeed();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch sections
        const sectionsSnapshot = await getDocs(collection(db, 'sections'));
        const sectionsList = sectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSections(sectionsList);

        // 2. Fetch programs
        const programsSnapshot = await getDocs(collection(db, 'programs'));
        const programsList = programsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 3. Group programs by sectionId
        const groupedPrograms = {};
        programsList.forEach(program => {
          const sid = program.sectionId;
          if (!groupedPrograms[sid]) {
            groupedPrograms[sid] = [];
          }
          groupedPrograms[sid].push(program);
        });

        setProgramsBySection(groupedPrograms);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App" style={{ direction: 'rtl', padding: '20px' }}>
      <h1>برامج المركز حسب الأقسام</h1>

      {sections.map(section => (
        <div
          key={section.id}
          className="section-card"
          style={{
            border: '1px solid #ccc',
            marginBottom: '30px',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)'
          }}
        >
          <h2>{section.name}</h2>
          <p><strong>الرؤية:</strong> {section.vision}</p>
          <p><strong>الأهداف:</strong> {section.goals}</p>

          <h3>البرامج:</h3>
          <ul>
            {(programsBySection[section.id] || []).map(program => (
              <li key={program.id}>
                <strong>{program.title}</strong>: {program.description}
              </li>
            ))}
            {(programsBySection[section.id] || []).length === 0 && (
              <p>لا يوجد برامج لهذا القسم حالياً.</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
