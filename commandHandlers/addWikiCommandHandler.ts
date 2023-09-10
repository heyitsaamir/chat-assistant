import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { addWiki, queryForMessage } from "../backend";

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

export class AddWikiCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "bookmarkWiki";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`App received message: ${message.text}`);
    // og
    // https://domoreexp.visualstudio.com/Teamspace/_wiki/wikis/Teamspace.wiki/29331/General-onboarding
    // https://dev.azure.com/domoreexp/Teamspace/_apis/wiki/wikis/Teamspace.wiki/pages/29331?api-version=7.1-preview.1
    const wikiDetails =
      /domoreexp\.visualstudio\.com\/([^\/]*)\/.*wikis\/([^\/]*)\/([^\/]*)/.exec(
        message.text
      );
    if (!wikiDetails) {
      return "Invalid wiki url";
    }
    const [_, wikiSpace, wikiName, pageId] = wikiDetails;
    try {
      await addWiki(
        `https://dev.azure.com/domoreexp/${wikiSpace}/_apis/wiki/wikis/${wikiName}/pages/${pageId}?api-version=7.1-preview.1`
      );
    } catch (e) {
      console.log(e);
      return "Failed to add wiki";
    }

    return "Added wiki!";
  }
}
