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
    <div className="section-page-magazine">
      {/* Header */}
      <div className="section-header">
        <div className="section-header-top">
          <div className="section-header-title">
            <h1>{section.title}</h1>
            {(section.subtitle || section.Subtitle) && (
              <h2>{section.subtitle || section.Subtitle}</h2>
            )}
          </div>
          <div className="section-header-logo">
            <img src="/src/assets/logo.png" alt="Community Logo" />
          </div>
        </div>

        {/* Header Background Image */}
        <div
          className="section-header-image"
          style={{
            backgroundImage: section.imageUrl ? `url(${section.imageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#f3f3f3'
          }}
        >
          {!section.imageUrl && (
            <div className="header-image-placeholder">
              [هنا توضع صورة كبيرة لخلفية القسم]
            </div>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className="section-content">
        {/* Description */}
        <div className="section-block">
          <h3 className="section-icon-heading">📝 {section.description_title}</h3>
          <p>{section.description}</p>
        </div>

        {/* Goals */}
        {section.goals && (
          <div className="section-block">
            <h3 className="section-icon-heading">🎯 {section.goals_title}</h3>
            <ul>
              {section.goals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>
        )}


          {/* Extra Goals */}
          {section.extra_goals_title && <h3>{section.extra_goals_title}</h3>}
          {Array.isArray(section.extra_goals) && (
            <ul>
              {section.extra_goals.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          )}

        {/* Programs */}
        {section.programs && (
          <div className="section-block">
            <h3 className="section-icon-heading">📋 {section.programs_title}</h3>
            <ul>
              {section.programs.map((program, index) => (
                <li key={index}>{program}</li>
              ))}
            </ul>
          </div>
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
          
        <div className="section-illustration-placeholder">
          [رسم توضيحي أو صورة لاحقاً]
        </div>
      </div>
    </div>
  );
}

export default SectionPage;
