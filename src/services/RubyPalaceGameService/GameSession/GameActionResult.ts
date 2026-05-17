// GameActionResult.ts

import { GameModal } from "./GameModal";

export type GameActionResult =
  | {
      type: "render";
    }
  | {
      type: "modal";
      modal: GameModal;
    };
