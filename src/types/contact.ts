export type ContactStatus = "New" | "In Progress" | "Resolved";

export interface Contact {
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
