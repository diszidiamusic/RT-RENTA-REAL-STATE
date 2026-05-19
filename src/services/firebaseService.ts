import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
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
    await addDoc(collection(db, 'properties'), {
      ...property,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ownerId: auth.currentUser?.uid
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'properties');
  }
};

export const updateProperty = async (id: string, property: Partial<Property>) => {
  try {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, {
      ...property,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `properties/${id}`);
  }
};

export const removeProperty = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'properties', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
  }
};
