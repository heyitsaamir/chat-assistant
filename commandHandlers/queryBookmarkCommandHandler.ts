import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { queryForMessage } from "../backend";

const json = {
  type: "AdaptiveCard",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: "${title}",
    },
    {
      type: "TextBlock",
      text: "${body}",
      wrap: true,
    },
  ],
  actions: [
    {
      type: "Action.OpenUrl",
      title: "Open",
      url: "${url}",
    },
  ],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.4",
};

/**
 * The `HelloWorldCommandHandler` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export class QueryBookmarkCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "query";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`App received message: ${message.text}`);
    const queryResult = await queryForMessage(message.text);

    const cardDatas = queryResult.map((result) => ({
      title: "Query Result",
      body: result.textDetails.text,
      url: result.textUrl,
    }));

    const cardJsons = cardDatas.map((cardData) =>
      AdaptiveCards.declare(json).render(cardData)
    );
    const result = await MessageFactory.list(
      cardJsons.map((cardJson) => CardFactory.adaptiveCard(cardJson))
    );

    return result;
  }
}
