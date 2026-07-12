export interface LegalSection {
  heading: string;
  body: string; // paragraphs separated by \n\n
}

export interface LegalDoc {
  updated: string;
  sections: LegalSection[];
}

export interface LegalContent {
  privacy: LegalDoc;
  cookies: LegalDoc;
  terms: LegalDoc;
}
