export interface FormData {
  contact: RegExp;
  amount: string;
  invoiceDate: string;
  dueDate: string;
  account: RegExp;
  invoiceNumber?: string;
}

export const purchaseFormData: FormData = {
  contact: new RegExp("Systima AS", "i"),
  amount: "100",
  invoiceDate: "01.01.2024",
  dueDate: "01.01.2024",
  invoiceNumber: "1",
  account: new RegExp("1000 Utvikling, ervervet", "i"),
};

export const contactName = "Bjorn";