import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
  MessagingExtensionActionResponse,
  MessagingExtensionAction,
  BotHandler,
} from "botbuilder";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { addMessageContext, ping } from "./backend";

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
    console.log("handle!" + JSON.stringify({ query, context }, undefined, 2));
    const message = context.activity.value?.messagePayload?.body.content;
    const sender =
      context.activity.value?.messagePayload?.from.user.displayName;
    const messageUrl = context.activity.value?.messagePayload?.linkToMessage;
    const additionalContext = context.activity.value?.data.additionalContext;
    await addMessageContext(messageUrl, message, sender, additionalContext);

    return {
      task: {
        type: "message",
        value: "Saved!",
      },
    };
  }

  public async handleTeamsMessagingExtensionFetchTask(
    context: TurnContext,
    action: MessagingExtensionAction
  ): Promise<MessagingExtensionActionResponse> {
    console.log("handle fetch task");
    // const title = context.activity.value?.
    const message = context.activity.value?.messagePayload?.body.content;
    console.log(message);
    // const messageUrl = context.activity.value?.messagePayload?.linkToMessage;
    // await addMessageContext(messageUrl, message);
    const adaptiveCard = CardFactory.adaptiveCard(
      AdaptiveCards.declare({
        type: "AdaptiveCard",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.6",
        body: [
          {
            type: "Input.Text",
            placeholder:
              "Add any other additional context that you'd like to bookmark this with",
            id: "additionalContext",
            label: "Additional Context (optional)",
            isMultiline: true,
            maxLength: 100,
          },
          {
            type: "ActionSet",
            actions: [
              {
                type: "Action.Submit",
                title: "Submit",
                id: "submitAdditionalContext",
                style: "positive",
              },
            ],
          },
        ],
      }).render()
    );

    return {
      task: {
        type: "continue",
        value: {
          card: adaptiveCard,
          height: 450,
          title: "Save Bookmark",
          url: null,
          width: 500,
        },
      },
    };
  }
}
