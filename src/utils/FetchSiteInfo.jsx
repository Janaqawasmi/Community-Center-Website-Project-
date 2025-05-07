// FetchSiteInfo.jsx
import { useState, useEffect } from "react";
import { db } from '../components/firebase';
import { doc, getDoc } from "firebase/firestore";

export function useFetchSiteInfo() {
  const [siteInfo, setSiteInfo] = useState({
    facebookLink: "",
    whatsAppLink: "",
    aboutUsText: "",
    address: "",
    email: "",
    heroSection: "",
    instagramLink: "",
    logoUrl: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const docRef = doc(db, "siteInfo", "9ib8qFqM732MnTl9G6YGz");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteInfo({
            facebookLink: data.FacebookLink || "",
            whatsAppLink: data.WhatsAppLink || "",
            aboutUsText: data.about_us_text || "",
            address: data.address || "",
            email: data.email || "",
            heroSection: data.heroSection || "",
            instagramLink: data.instagramLink || "",
            logoUrl: data.logo_url || "",
            phoneNumber: data.phone_number || "",
          });
        } else {
          console.log("No such document");
        }
      } catch (error) {
        console.error("Error fetching site info:", error);
      }
    };

    fetchSiteInfo();
  }, []);

  return siteInfo; // <<< return the full object
}
