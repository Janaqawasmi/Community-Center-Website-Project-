// firebaseSeeder.js
import { db } from "./firebase"; // your firebase config file
import { collection, addDoc } from "firebase/firestore";

// 1. Add sections
const sectionsData = [
  {
    name: "قسم المسنين",
    description: "يهتم هذا القسم بتقديم خدمات وأنشطة للمسنين.",
    vision: "تحقيق رفاهية كبار السن من خلال الدعم والرعاية.",
    goals: ["توفير بيئة آمنة", "تنظيم فعاليات ترفيهية", "تعزيز العلاقات الاجتماعية"],
  },
  {
    name: "قسم النساء",
    description: "يقدم القسم برامج متنوعة لدعم النساء وتطوير مهاراتهن.",
    vision: "تمكين المرأة وتعزيز دورها في المجتمع.",
    goals: ["ورشات توعوية", "برامج دعم نفسي", "تدريبات مهنية"],
  },
  {
    name: "قسم الشبيبة",
    description: "برامج موجهة لتطوير مهارات الشباب وبناء شخصياتهم.",
    vision: "شباب قادرون على تحقيق إمكاناتهم.",
    goals: ["تنمية المهارات القيادية", "أنشطة رياضية", "ورش تعليمية"],
  },
  {
    name: "قسم الاحتياجات الخاصة",
    description: "يقدم خدمات تعليمية وترفيهية لأصحاب الاحتياجات الخاصة.",
    vision: "دمج وتطوير ذوي الاحتياجات الخاصة في المجتمع.",
    goals: ["برامج تعليمية", "دعم نفسي واجتماعي", "أنشطة ترفيهية"],
  },
  {
    name: "قسم الحضانة",
    description: "رعاية الأطفال في سن الحضانة وتوفير بيئة تعليمية ممتعة.",
    vision: "طفولة سعيدة وتعليم مبكر متميز.",
    goals: ["تعليم مبكر", "أنشطة ترفيهية", "رعاية صحية"],
  },
  {
    name: "قسم رياض الأطفال",
    description: "برامج رياض الأطفال لتنمية المهارات الأساسية للأطفال.",
    vision: "تهيئة الأطفال للمرحلة الدراسية.",
    goals: ["مهارات لغوية", "أنشطة جماعية", "تعليم مبسط"],
  },
  {
    name: "قسم الثقافة",
    description: "يركز على النشاطات الثقافية مثل المسرح، الموسيقى، والقراءة.",
    vision: "نشر الثقافة وتعزيز القيم المجتمعية.",
    goals: ["عروض مسرحية", "ورش قراءة", "دروس موسيقية"],
  }
];

const seedData = async () => {
  const sectionIds = {};

  // Step 1: Add sections and store their IDs
  for (const section of sectionsData) {
    const sectionRef = await addDoc(collection(db, "sections"), section);
    sectionIds[section.name] = sectionRef.id;
    console.log(`Section ${section.name} added with ID: ${sectionRef.id}`);
  }

  // Step 2: Add programs linked to sections
  const programsData = [
    {
      name: "برنامج تطوير الذات",
      description: "برنامج يهدف لتطوير مهارات النساء الشخصية والمهنية.",
      sectionId: sectionIds["قسم النساء"],
      days: ["الاثنين", "الأربعاء"],
      time: "16:00 - 18:00"
    },
    {
      name: "برنامج تعليم الكبار",
      description: "دروس محو الأمية والتعلم المستمر للمسنين.",
      sectionId: sectionIds["قسم المسنين"],
      days: ["الثلاثاء"],
      time: "10:00 - 12:00"
    },
    {
      name: "برنامج القيادة الشابة",
      description: "تدريب الشبيبة على القيادة والعمل الجماعي.",
      sectionId: sectionIds["قسم الشبيبة"],
      days: ["الخميس"],
      time: "15:00 - 17:00"
    },
    {
      name: "برنامج ترفيهي",
      description: "أنشطة ترفيهية للأطفال ذوي الاحتياجات الخاصة.",
      sectionId: sectionIds["قسم الاحتياجات الخاصة"],
      days: ["الأحد"],
      time: "09:00 - 11:00"
    }
  ];

  for (const program of programsData) {
    await addDoc(collection(db, "programs"), program);
    console.log(`Program ${program.name} added.`);
  }

  console.log("🔥 Seeding complete!");
};

export default seedData;
