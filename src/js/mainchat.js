// Проверка состояния Stomp клиента в localStorage
const stompClientConnected = localStorage.getItem("stompClientConnected");
const userId = localStorage.getItem("userId");
const chatsId = JSON.parse(localStorage.getItem("chatsId"));

if (stompClientConnected) {
  const stompClient = Stomp.over(socket);

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

  stompClient.activate();
}
