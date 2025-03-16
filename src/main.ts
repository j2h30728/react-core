import { renderToString, render } from "custom-jsx-library/core";
import App from "./App";

const appElement = App();
console.log(JSON.stringify(appElement, null, 2));

console.log("renderToString:", renderToString(appElement));
render(appElement, document.getElementById("root")!);
