import "./scss/mainchat.scss";
import "./scss/chat_container.scss";

import { chatListHTML } from "./modules/mainchat/htmlrender/grid_chatlist";
import { chatContainerHTML } from "./modules/mainchat/htmlrender/grid_container";
import { chatInfoPanelHTML } from "./modules/mainchat/htmlrender/grid_infopanel";

import * as bootstrap from "bootstrap";

import { initializeIndexedDB } from "./modules/indexedDB";
import { initializeMainChatLogic } from "./modules/mainchat/mainrules";
import { initializeChatLogic } from "./modules/mainchat/showchat";
import { initializeAdminPanel } from "./modules/mainchat/admin";
import { initializeChatListLogic } from "./modules/mainchat/chatlist";
import { initializeInviteChat } from "./modules/mainchat/invite";

document.querySelector("#grid_container").innerHTML = chatContainerHTML();
document.querySelector("#grid_chatlist").innerHTML = chatListHTML();
document.querySelector("#grid_infopanel").innerHTML = chatInfoPanelHTML();

initializeIndexedDB();
initializeMainChatLogic();
initializeChatLogic();
initializeAdminPanel();
initializeChatListLogic();
initializeInviteChat();
