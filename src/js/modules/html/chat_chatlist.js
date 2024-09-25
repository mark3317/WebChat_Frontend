import { html, render } from "lit-html";
// chat_chatlist.js
export const chatListHTML = html`
  <div
    class="position-relative p-5 text-center text-muted bg-body border border-dashed"
    id="chatlist"
  >
    <h1 class="text-body-emphasis">Список чатов:</h1>
    <div
      id="spinner2"
      class="spinner-border"
      role="status"
      style="display: block; margin-left: 42%;"
    ></div>
    <ul id="chat-list"></ul>
  </div>
`;

const appElement2 = document.getElementById("chat_chatlist");
render(chatListHTML, appElement2);
