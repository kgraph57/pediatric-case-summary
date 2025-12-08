export interface Case {
  id: string;
  title: string;
  patientAge: number;
  patientGender: string;
  status: 'draft' | 'completed' | 'submitted';
  priority: 'low' | 'medium' | 'high';
  isFavorite: boolean;
  completeness: number;
  tags: string[];
  chiefComplaint: string;
  presentIllness: string;
  pastHistory: string;
  familyHistory: string;
  physicalExam: string;
  labFindings: string;
  imagingFindings: string;
  diagnosis: string;
  treatment: string;
  discussion: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'pediatric-cases';

export const storage = {
  getCases(): Case[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCase(caseData: Case): void {
    const cases = this.getCases();
    const index = cases.findIndex(c => c.id === caseData.id);
    if (index >= 0) {
      cases[index] = caseData;
    } else {
      cases.push(caseData);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  },

  deleteCase(id: string): void {
    const cases = this.getCases().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  },

  getCase(id: string): Case | undefined {
    return this.getCases().find(c => c.id === id);
  },
};
