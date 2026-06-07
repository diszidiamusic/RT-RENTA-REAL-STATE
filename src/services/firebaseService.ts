import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Property } from '../components/PropertyList';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

function cleanUndefined(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  }
  if (typeof obj === 'object') {
    const proto = Object.getPrototypeOf(obj);
    if (proto !== null && proto !== Object.prototype) {
      // Intact for FieldValue, Timestamp, etc.
      return obj;
    }
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = cleanUndefined(val);
      }
    }
    return cleaned;
  }
  return obj;
}

export const getProperties = (callback: (properties: Property[]) => void) => {
  const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Property));
    callback(properties);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'properties');
  });
};

export const addProperty = async (property: Omit<Property, 'id'>) => {
  try {
    const rawPayload = {
      ...property,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ownerId: auth.currentUser?.uid || null
    };
    await addDoc(collection(db, 'properties'), cleanUndefined(rawPayload));
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'properties');
  }
};

export const updateProperty = async (id: string, property: Partial<Property>) => {
  try {
    const docRef = doc(db, 'properties', id);
    if (id.startsWith('local-')) {
      const { id: _, ...propertyData } = property as any;
      const rawPayload = {
        ...propertyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ownerId: auth.currentUser?.uid || null
      };
      await setDoc(docRef, cleanUndefined(rawPayload));
    } else {
      const rawPayload = {
        ...property,
        updatedAt: serverTimestamp()
      };
      await updateDoc(docRef, cleanUndefined(rawPayload));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `properties/${id}`);
  }
};

export const removeProperty = async (id: string) => {
  try {
    if (id.startsWith('local-')) {
      const docRef = doc(db, 'properties', id);
      await setDoc(docRef, {
        isDeletedLocal: true,
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } else {
      await deleteDoc(doc(db, 'properties', id));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
  }
};
