// Импорт
import "../scss/index.scss";
import "../scss/register.scss";
import "../scss/mainchat.scss";
// JS Bootstrap
import * as bootstrap from "bootstrap";
console.log("Webpack is working!");
// My JS
import "./background/particles.min";
import "./background/app";
import "./logic/authrules";

if (window.location.pathname.includes("mainchat.html")) {
  import("sockjs-client").then((SockJS) => {
    import("@stomp/stompjs").then(({ Client }) => {
      // Проверка состояния Stomp клиента в localStorage
      const stompClientConnected = localStorage.getItem("stompClientConnected");
      const userId = localStorage.getItem("userId");
      const chatsId = JSON.parse(localStorage.getItem("chatsId"));

      if (stompClientConnected) {
        // Создание экземпляра SockJS
        const socket = new SockJS.default("http://94.242.53.252:8081/ws");
        const stompClient = new Client({
          webSocketFactory: () => socket,
          debug: (str) => {
            console.log(str);
          },
        });

        stompClient.onConnect = (frame) => {
          console.log("Connected: " + frame);

          stompClient.subscribe(`/user/${userId}/invite`, (message) => {
            const response = JSON.parse(message.body);
            alert(response.content);
          });

          chatsId.forEach((chatId) => {
            stompClient.subscribe(`/chat/${chatId}/message`, (message) => {
              const response = JSON.parse(message.body);
              alert(response.content);
            });
          });
        };

        // Активация stompClient
        stompClient.activate();
      }
    });
  });
}
