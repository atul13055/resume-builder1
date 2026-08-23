import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ResumeData, ThemeConfig } from '../types/resume';

export interface CloudResumeDocument {
  id: string;
  title: string;
  resumeData: ResumeData;
  theme: ThemeConfig;
  atsScore: number;
  createdAt: any;
  updatedAt: any;
}

export async function fetchUserResumes(userId: string): Promise<CloudResumeDocument[]> {
  try {
    const resumesRef = collection(db, 'users', userId, 'resumes');
    const q = query(resumesRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    const items: CloudResumeDocument[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || 'Untitled Resume',
        resumeData: data.resumeData,
        theme: data.theme,
        atsScore: data.atsScore ?? 75,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return items;
  } catch (error) {
    console.error('Error fetching cloud resumes:', error);
    // Fallback if index is not ready yet: fetch unordered
    try {
      const resumesRef = collection(db, 'users', userId, 'resumes');
      const snapshot = await getDocs(resumesRef);
      const items: CloudResumeDocument[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || 'Untitled Resume',
          resumeData: data.resumeData,
          theme: data.theme,
          atsScore: data.atsScore ?? 75,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      return items;
    } catch (e) {
      console.error('Secondary error fetching resumes:', e);
      return [];
    }
  }
}

export async function saveResumeToCloud(
  userId: string,
  resumeId: string | null,
  title: string,
  resumeData: ResumeData,
  theme: ThemeConfig,
  atsScore: number
): Promise<string> {
  const resumesRef = collection(db, 'users', userId, 'resumes');

  const resumePayload = {
    title: title || `${resumeData?.personalInfo?.fullName || 'My'} Resume`,
    resumeData,
    theme,
    atsScore,
    updatedAt: serverTimestamp(),
  };

  if (resumeId) {
    const docRef = doc(db, 'users', userId, 'resumes', resumeId);
    await setDoc(docRef, resumePayload, { merge: true });
    return resumeId;
  } else {
    const newDocRef = await addDoc(resumesRef, {
      ...resumePayload,
      createdAt: serverTimestamp(),
    });
    return newDocRef.id;
  }
}

export async function deleteCloudResume(userId: string, resumeId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'resumes', resumeId);
  await deleteDoc(docRef);
}

export async function renameCloudResume(userId: string, resumeId: string, newTitle: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'resumes', resumeId);
  await setDoc(
    docRef,
    {
      title: newTitle.trim(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function duplicateCloudResume(userId: string, resumeId: string): Promise<string> {
  const sourceRef = doc(db, 'users', userId, 'resumes', resumeId);
  const snap = await getDoc(sourceRef);
  if (!snap.exists()) {
    throw new Error('Resume not found');
  }

  const data = snap.data();
  const resumesRef = collection(db, 'users', userId, 'resumes');
  const newDocRef = await addDoc(resumesRef, {
    ...data,
    title: `${data.title || 'Resume'} (Copy)`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return newDocRef.id;
}
