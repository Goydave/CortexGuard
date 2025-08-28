export type Scan = {
  id: string;
  content: string;
  type: "URL" | "SMS" | "Email" | "File";
  date: string;
  riskScore: number;
  isPhishing: boolean;
};
