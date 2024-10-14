import "./scss/register.scss";

import * as bootstrap from "bootstrap";

import { initializeRegRules } from "./modules/register/regrules.js";
import { registerTemplate } from "./modules/register/register_m.js";

document.querySelector("#app").innerHTML = registerTemplate();

initializeRegRules();
