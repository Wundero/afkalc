import { useCallback, useEffect, useState } from "react";
import firebase from "firebase";
import useFirestorePartialUpdateRef from "./useFirestorePartialUpdateRef";

export default function useFirestoreValue<T>(
  isView: boolean,
  docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | null,
  key: string,
  uid: string,
  isAuth: boolean,
  defaultValue: T,
  forceCreate: string | null = null
): [T, (value: T) => void] {
  const [firestoreValue, setLocalValue] = useState(defaultValue);
  const partialUpdateRef = useFirestorePartialUpdateRef();

  useEffect(() => {
    if (docRef !== null && (isView || isAuth)) {
      docRef.onSnapshot((doc) => {
        if (doc !== undefined && doc.exists) {
          const data = doc.data();
          if (data !== undefined) {
            setLocalValue(data[key]);
            return;
          }
        }

        if (forceCreate !== null && uid !== undefined) {
          partialUpdateRef(docRef, { [key]: forceCreate }, uid);
        }
        setLocalValue(defaultValue);
      });
    }
  }, [
    isAuth,
    docRef,
    setLocalValue,
    defaultValue,
    forceCreate,
    isView,
    key,
    partialUpdateRef,
    uid,
  ]);

  const setValue = useCallback(
    (value) => {
      if (docRef !== null) {
        partialUpdateRef(docRef, { [key]: value }, uid);
      }
      setLocalValue(value);
    },
    [docRef, key, uid, partialUpdateRef]
  );

  return [firestoreValue, setValue];
}