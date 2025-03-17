import { render } from "custom-jsx-library/core";
import App from "./App";

const appElement = App();
console.log(JSON.stringify(appElement, null, 2));

render(appElement, document.getElementById("root")!);
