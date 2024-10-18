export const chatInfoPanelHTML = () => /*html*/ `
<div
      class="position-relative p-5 text-center text-muted bg-body border border-dashed"
      id="infopanel"
    >
      <!-- <svg class="bi mt-5 mb-3" width="48" height="48"> -->
        <use xlink:href="#check2-circle"></use>
      </svg>
      <h1 class="text-body-emphasis">Привет, user!</h1>
      <p class="col-lg-6 mx-auto mb-4">
        Добро пожаловать в чат!
      </p>
      <!--! btn-container -->
      <aside class="btn-container">
        <!-- todo?CREATE-CHAT -->
        <button class="btn btn-success px-5 mb-5" type="button" style="min-width: 9.75rem; width: 9.75rem;" disabled>
          Создать чат 
        </button>
        <!-- todo?INVITE-CHAT -->
        <button
          class="btn btn-success px-5 mb-5" 
          type="button"
          style="min-width: 9.75rem; width: 9.75rem;"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
          disabled
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
