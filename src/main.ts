import App from "./App";
import { render } from "custom-jsx-library";

const appElement = App();
console.log(JSON.stringify(appElement, null, 2));

render(App, document.getElementById("root")!);
