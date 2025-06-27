import { db } from "../../../components/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export const handleConfirmDelete = async ({
  selected,
  setData,
  setDeleteOpen,
  setSelected,
}) => {
  try {
    await Promise.all(
      selected.map(({ firebaseId, collectionName }) =>
        deleteDoc(doc(db, collectionName, firebaseId))
      )
    );

    setData(prev =>
      prev.filter(reg =>
        !selected.some(sel => sel.firebaseId === reg.firebaseId)
      )
    );

    setDeleteOpen(false);
    setSelected([]);
  } catch (err) {
    console.error("فشل الحذف:", err);
  }
};
