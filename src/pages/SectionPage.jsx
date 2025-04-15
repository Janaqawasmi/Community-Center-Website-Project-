import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import './SectionPage.css';

function SectionPage() {
  const { id } = useParams();
  const [section, setSection] = useState(null);

  useEffect(() => {
    const fetchSection = async () => {
      const docRef = doc(db, 'sections', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSection(docSnap.data());
      } else {
        console.log("No such section!");
      }
    };
    fetchSection();
  }, [id]);

  if (!section) return <p>جاري التحميل...</p>;

  return (
    <div className="section-page">
      {/* Top banner */}
      <div className="section-banner">
        <h1>{section.title}</h1>
        {(section.Subtitle || section.subtitle) && (
          <h2>{section.Subtitle || section.subtitle}</h2>
        )}
      </div>

      {/* Main content area */}
      <div className="section-content">
        {/* Image area */}
        {section.imageUrl && (
          <div className="section-image">
            <img src={section.imageUrl} alt="صورة القسم" />
          </div>
        )}

        {/* Text content area */}
        <div className="section-text">
          {/* Description */}
          {section.description_title && <h3>{section.description_title}</h3>}
          {section.description && <p>{section.description}</p>}

          {/* Goals */}
          {section.goals_title && <h3>{section.goals_title}</h3>}
          {Array.isArray(section.goals) && (
            <ul>
              {section.goals.map((goal, i) => <li key={i}>{goal}</li>)}
            </ul>
          )}

          {/* Extra Goals */}
          {section.extra_goals_title && <h3>{section.extra_goals_title}</h3>}
          {Array.isArray(section.extra_goals) && (
            <ul>
              {section.extra_goals.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          )}

          {/* Programs */}
          {section.programs_title && <h3>{section.programs_title}</h3>}
          {Array.isArray(section.programs) && (
            <ul>
              {section.programs.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          )}

          {/* Curricular Programs */}
          {section.curricular_programs_title && <h3>{section.curricular_programs_title}</h3>}
          {section.curricular_programs_subtitle && <p><strong>{section.curricular_programs_subtitle}</strong></p>}
          {Array.isArray(section.curricular_programs) && (
            <ul>
              {section.curricular_programs.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          )}

          {/* Non-Curricular Programs */}
          {section.non_curricular_programs_title && <h3>{section.non_curricular_programs_title}</h3>}
          {Array.isArray(section.non_curricular_programs) && (
            <ul>
              {section.non_curricular_programs.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SectionPage;
