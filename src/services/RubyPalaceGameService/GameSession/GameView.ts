// GameView.ts
export type GameControl =
  | {
      type: "button";
      action: string;
      label: string;
      style?: "primary" | "secondary" | "success" | "danger";
    };

export interface GameView {
  title: string;
  description: string;
  controls: GameControl[];
}
