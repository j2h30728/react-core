import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "custom-jsx-runtime/jsx-runtime";
const App = () => {
  return _jsxs(
    "div",
    {
      id: "app",
      children: [
        _jsx("h1", {
          children: "Hello",
        }),
        _jsx("div", {
          children: _jsx("p", {
            children: "\uC911\uCCA9\uAD6C\uC870",
          }),
        }),
        _jsx(Header, {}),
        _jsx(Content, {}),
        _jsx(Test, {}),
      ],
    },
    "0"
  );
};
const Header = () => {
  return _jsx(
    "h1",
    {
      id: "header",
      children: "Hello, React Clone!",
    },
    "1"
  );
};
const Content = () => {
  return _jsxs(
    "p",
    {
      id: "content",
      children: [
        "This is a simple React Clone.",
        _jsxs("div", {
          children: [
            _jsx("span", {
              children: "content span 1",
            }),
            _jsx("span", {
              children: "content span 2",
            }),
          ],
        }),
      ],
    },
    "2"
  );
};
const Test = () => {
  return _jsx(_Fragment, {
    children: "Fragment test",
  });
};
export default App;
