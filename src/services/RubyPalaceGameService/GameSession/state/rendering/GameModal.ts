export type GameModal = {
  action: string;
  title: string;
  fields: {
    id: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  }[];
};
