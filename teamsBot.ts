import { default as axios } from "axios";
import * as querystring from "querystring";
import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
  MessagingExtensionActionResponse,
  MessagingExtensionAction,
} from "botbuilder";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";

export interface DataInterface {
  likeCount: number;
}

export class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Message extension Code
  // Search.
  public async handleTeamsMessagingExtensionSubmitAction(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<MessagingExtensionActionResponse> {
    console.log("handle!");
    const card = AdaptiveCards.declare<DataInterface>({
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          size: "Medium",
          weight: "Bolder",
          text: "Learn Adaptive Card and Commands",
        },
        {
          type: "TextBlock",
          text: 'Now you have triggered a command that sends this card! Go to documentations to learn more about Adaptive Card and Commands in Teams Bot. Click on "I like this" below if you think this is helpful.',
          wrap: true,
        },
      ],
      actions: [
        {
          type: "Action.OpenUrl",
          title: "Adaptive Card Docs",
          url: "https://docs.microsoft.com/en-us/adaptive-cards/",
        },
        {
          type: "Action.OpenUrl",
          title: "Bot Command Docs",
          url: "https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/create-a-bot-commands-menu?tabs=desktop%2Cdotnet",
        },
      ],
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.4",
    }).render();
    const adaptiveCard = CardFactory.adaptiveCard(card);

    return {
      task: {
        type: "message",
        value: "Thanks!",
      },
    };
  }

  public async handleTeamsMessagingExtensionFetchTask(
    context: TurnContext,
    _action: MessagingExtensionAction
  ): Promise<MessagingExtensionActionResponse> {
    console.log("handle fetch task");
    const adaptiveCard = CardFactory.adaptiveCard(
      AdaptiveCards.declare<DataInterface>({
        type: "AdaptiveCard",
        version: "1.6",
        body: [
          {
            type: "TextBlock",
            text: `You have sent ${JSON.stringify(context.activity)}`,
            wrap: true,
          },
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      }).render()
    );
    return {
      task: {
        type: "continue",
        value: {
          card: adaptiveCard,
          height: 450,
          title: "Task Module Fetch Example",
          url: null,
          width: 500,
        },
      },
    };
  }
}
