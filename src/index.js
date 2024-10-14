import "./scss/index.scss";

import * as bootstrap from "bootstrap";

import { initializeAuthRules } from "./modules/index/authrules.js";
import { indexTemplate } from "./modules/index/index_m.js";

document.querySelector("#app").innerHTML = indexTemplate();

initializeAuthRules();
