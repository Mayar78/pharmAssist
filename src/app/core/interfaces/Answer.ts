export interface AnswerData {
  PromptReason: string;
  HasChronicConditions: string;
  TakesMedicationsOrTreatments: string;
  CurrentSymptoms: string;
}

export interface Question {
  id: string;
  text: string;
  required: boolean;
  apiField: keyof AnswerData;
}