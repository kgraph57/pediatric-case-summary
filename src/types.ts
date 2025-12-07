export interface CaseSummaryResult {
  caseNumber: number
  fieldNumber: number
  isDesignatedDisease: boolean
  summary: string
  extractedInfo?: {
    patientId?: string
    age?: string
    gender?: string
    chiefComplaint?: string
    diagnosis?: string
  }
}

export interface CaseFormData {
  caseNumber: number
  fieldNumber: number
  isDesignatedDisease: boolean
  voiceInputText: string
}
