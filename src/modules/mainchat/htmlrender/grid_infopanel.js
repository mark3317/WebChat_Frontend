export const chatInfoPanelHTML = () => /*html*/ `
<div
  class="position-relative p-5 text-center text-muted bg-body border border-dashed"
      id="infopanel"
    >
      <!-- <svg class="bi mt-5 mb-3" width="48" height="48"> -->
        <use xlink:href="#check2-circle"></use>
      </svg>
      <h1 class="text-body-emphasis">Привет, user!</h1>
      <img
            src="http://94.242.53.252/profile.png"
            alt="avatar 1"
            class="avatar"
            style="width: 4.375rem; height: 4.375rem; margin-bottom: 1rem;"
          />
      <!--! btn-container -->
      <aside class="btn-container">
        <!-- todo?CREATE-CHAT -->
        <button class="btn btn-success px-5 mb-5" type="button"
         style="min-width: 9.75rem; width: 9.75rem;"
         data-bs-toggle="modal"
          data-bs-target="#myModal2"
          >
          Создать чат 
        </button>
        <!-- todo?INVITE-CHAT -->
        <button
          id="inviteChatButton"
          class="btn btn-success px-5 mb-5" 
          type="button"
          style="min-width: 9.75rem; width: 9.75rem;"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
        >
          Пригласить в чат
        </button>
        <!-- todo?LOGOUT -->
        <button class="btn btn-success px-5 mb-5" type="button" style="min-width: 9.75rem; width: 9.75rem;">
          <a style="color: rgb(255, 255, 255); text-decoration: none;"      href="/">Выйти</a>
        </button>
        <!-- todo?ADMIN_BUTTON -->
        <button class="btn btn-secondary px-5 mb-5" type="button" 
        id="admin_button" style="display: none; min-width: 9.75rem; width: 9.75rem;"
        data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"
        style="min-width: 9.75rem; width: 9.75rem;">
          Режим админа
        </button>
      </aside>
    </div>
`;
