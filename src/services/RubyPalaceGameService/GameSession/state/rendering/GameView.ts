// GameView.ts
export type GameControl =
  | {
      type: "button";
      action: string;
      label: string;
      style?: "primary" | "secondary" | "success" | "danger";
    }
  | {
      type: "select";
      action: string;
      placeholder: string;
      options: {
        label: string;
        value: string;
        description?: string;
      }[];
    }
  | {
      type: "modal";
      action: string;
      buttonLabel: string;
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

export interface GameView {
  title: string;
  description: string;
  controls: GameControl[];
}
