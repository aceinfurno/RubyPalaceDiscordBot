import { GameService } from "../services/GameService";

export class AppContext {
  public readonly RubyPalace: RubyPalace;

  constructor() {
    this.RubyPalace = new RubyPalace();
  }
}
