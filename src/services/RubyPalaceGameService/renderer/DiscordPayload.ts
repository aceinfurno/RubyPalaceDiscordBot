export class DiscordPayload<T> {
  constructor(
    public readonly type: "update" | "modal",
    public readonly payload: T,
  ) {}

  public static update<T>(
    payload: T
  ): DiscordPayload<T> {
    return new DiscordPayload(
      "update",
      payload,
    );
  }

  public static modal<T>(
    payload: T
  ): DiscordPayload<T> {
    return new DiscordPayload(
      "modal",
      payload,
    );
  }
}
