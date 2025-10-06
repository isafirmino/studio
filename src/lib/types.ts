import type { User as FirebaseUser } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  judgingBody?: string;
  role?: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  url: string;
  // Using a simple text mock for document content
  contentText: string;
  summary?: string;
  summaryGenerating?: boolean;
}

export interface LegalProcess {
  id: string;
  userId: string;
  processNumber: string;
  parties: string;
  subject: string;
  class: string;
  area: string;
  date: string;
  documents?: LegalDocument[];
}

export interface AppUser extends FirebaseUser {
  profile?: UserProfile;
}
