export interface MethodologySection {
  heading: string;
  body: string; // paragraphs separated by \n\n
}

export type MethodologyContent = MethodologySection[];
