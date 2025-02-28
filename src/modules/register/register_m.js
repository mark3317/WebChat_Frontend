export const registerTemplate = () => /*html*/ ` 
<aside class="navigation">
      <nav>
        <ul>
          <li><a href="/">█𝑨𝑼𝑻𝑯𝑶𝑹𝑰𝒁𝑨𝑻𝑰𝑶𝑵</a></li>
          <li><a href="../../src/html/register.html">█𝑹𝑬𝑮𝑰𝑺𝑻𝑹𝑨𝑻𝑰𝑶𝑵</a></li>
          <li><a href="../../src/html/mainchat.html">█𝑴𝑨𝑰𝑵 𝑪𝑯𝑨𝑻</a></li>
        </ul>
      </nav>
    </aside>
    <main>
      <!--* BACKGROUND -->
      <div id="particles-js"></div>
      <!-- todoLOGO -->
      <div id="logo" style="min-height:6rem">
        <h1>Веб Чат Онлайн</h1>
        <!--! spinner -->
        <div
          id="spinner"
          class="spinner-border"
          role="status"
          style="display: none; position: absolute; right: 5%"
        ></div>
      </div>
      <!--* Registration-->
      <section class="registration">
        <form class="p-4 p-md-5 border rounded-3" id="registerForm">
          <h1 class="h3 mb-3 fw-normal" id="text">Регистрация</h1>
          <div class="form-floating mb-3">
            <!-- NICKNAME -->
            <input
              type="text"
              class="form-control"
              id="floatingNickname"
              placeholder="Ваш Nickname"
            />
            <label for="floatingNickname">Логин</label>
          </div>
          <div class="form-floating mb-3">
            <!-- EMAIL -->
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label for="floatingInput">Адрес электронной почты</label>
          </div>
          <div class="form-floating mb-3">
            <!-- PASSWORD -->
            <input
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Пароль"
            />
            <label for="floatingPassword">Пароль</label>
          </div>
          <div class="form-floating mb-3">
            <!-- CONFIRM PASSWORD -->
            <input
              type="password"
              class="form-control"
              id="floatingConfirmPassword"
              placeholder="Повторите пароль"
            />
            <label for="floatingConfirmPassword">Повторите пароль</label>
          </div>
          <aside class="asideshowpass">
            <div class="checkbox mb-3">
              <label style="cursor: pointer; user-select: none">
                <input
                  type="checkbox"
                  id="showPassword"
                  style="cursor: pointer"
                />
                <span>Показать пароль</span>
              </label>
            </div>
          </aside>
          <!--* LOGIN BUTTON -->
          <button
            type="submit"
            class="w-100 btn btn-lg btn-primary"
            style="display: block"
            id="but_normal"
          >
            Войти
          </button>
          <!--! REGISTER BUTTON FAILED -->
          <button
            type="button"
            class="w-100 btn btn-danger"
            style="display: none"
            id="but_fail"
          >
            Ошибка регистрации
          </button>
          <!-- *REGISTER BUTTON SUCCESS -->
          <button
            type="button"
            class="w-100 btn btn-success"
            style="display: none"
            id="but_success"
          >
            Успешная регистрация
          </button>
          <!--todo REGISTER BUTTON WARNING -->
          <button
            type="button"
            class="w-100 btn btn-warning"
            style="display: none"
            id="but_warning"
          >
            Заполните все поля
          </button>
          <!--todo REGISTER BUTTON WARNING2 -->
          <button
            type="button"
            class="w-100 btn btn-warning"
            style="display: none"
            id="but_warning2"
          >
            Пароли не совпадают
          </button>
          <!--todo REGISTER BUTTON WARNING3 -->
          <button
            type="button"
            class="w-100 btn btn-warning"
            style="display: none"
            id="but_warning3"
          >
            Некорректный email
          </button>
          <hr class="my-4" />
          <!-- Уже зареганы? -->
          <aside style="display: flex; justify-content: center">
            <small class="text-body-secondary" style="user-select: none">
              Уже зарегистрированы? <a href="index.html">Авторизируйтесь</a>
            </small>
          </aside>
        </form>
      </section>
    </main>
`;
