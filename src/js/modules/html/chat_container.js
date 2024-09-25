import { html, render } from "lit-html";
// chat_container.js
export const chatContainerHTML = html`
  <section class="chat_container">
    <header class="chat_header">
      <h1>General Chat</h1>
    </header>
    <main class="chat_main">
      <!--* Тело карточки -->
      <div class="card-body">
          <!-- Сообщение от Timona Siera -->
          <div class="message-header">
            <p class="small mb-1 lazure">Папич</p>
            <p class="small mb-1 lazure">23 Jan 2:00 pm</p>
          </div>
          <div class="message-body">
            <img
              src="http://94.242.53.252/profile.png"
              alt="avatar 1"
              class="avatar"
            />
            <div>
              <p class="message-content output text-white">
              Съешь ещё этих мягких французских булок, да выпей чаю! Съешь ещё этих мягких французских булок, да выпей чаю!
              Съешь ещё этих мягких французских булок, да выпей чаю! Съешь ещё этих мягких французских булок, да выпей чаю!
              </p>
            </div>
          </div>

          <!-- Сообщение от Johny Bullock -->
          <div class="message-header">
              <p class="small mb-1 lazure">23 Jan 2:05 pm</p>
              <p class="small mb-1 lazure">Вадик</p>
            </div>
            <div class="message-body justify-content-end">
              <div>
                <p class="message-content bg-warning text-white">
                Съешь ещё этих мягких французских булок, да выпей чаю! Съешь ещё этих мягких французских булок, да выпей чаю!
                Съешь ещё этих мягких французских булок, да выпей чаю! 
                </p>
              </div>
              <img
                src="http://94.242.53.252/profile.png"
                alt="avatar 1"
                class="avatar"
              />
            </div>
    </main>
    <footer class="chat_footer">
   <!--* GRID MessageInput Container -->
   <aside class="grid_message_container">
    <div class="grid_sms_input"> 
      <input type="text" id="sms-input" class="form-control" placeholder="Введите сообщение..." aria-label="Введите сообщение..." aria-describedby="button-addon2">
    </div>
    <div class="grid_sms_button">
      <button type="submit" class="btn btn-success" id="send_message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.3L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
        </svg>
      </button>
    </div>
  </aside>
    </footer>
  </section>
`;
// Рендеринг шаблона
const appElement = document.getElementById("chat_container");
render(chatContainerHTML, appElement);
