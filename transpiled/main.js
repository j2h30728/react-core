import { jsx as _jsx } from "custom-jsx-runtime/jsx-runtime";
const App = () => {
  return _jsx("div", {
    children: _jsx("h3", {
      children: "Hello World"
    }, "h3-key")
  });
};
document.querySelector("#app")?.appendChild(App());