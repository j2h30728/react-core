import { useState } from "custom-jsx-library/core";

const App = () => {
  const [state, setState] = useState(0);
  const [count1, setCount1] = useState(1);
  const [count2, setCount2] = useState(2);
  const [count3, setCount3] = useState(3);
  console.log(state);
  return (
    <div id="app" key="0">
      <h1>Hello</h1>
      <div>
        <p>{state}</p>
        <p>{count1}</p>
        <p>{count2}</p>
        <p>{count3}</p>
        <button
          onClick={() => {
            setState((prev) => prev + 1);
            setCount1((prev) => prev + 1);
            setCount2((prev) => prev + 1);
            setCount3((prev) => prev + 1);
            setCount3((prev) => prev + 1);
            setCount3((prev) => prev + 1);
            setCount3((prev) => prev + 10);
          }}>
          카운트 업
        </button>
        <p>Nested structure2</p>
        <p>Nested structure3</p>
      </div>
      <Header />
      <Content />
      <Test />
    </div>
  );
};

const Header = () => {
  return (
    <h1 key="1" id="header" onClick={() => console.log("header click")} style={{ color: "blue", fontSize: "50px" }}>
      Hello, React Clone!
    </h1>
  );
};

const Content = () => {
  return (
    <p key="2" id="content">
      This is a simple React Clone.
      <div>
        <span key="content-1">content span 1</span>
        <span key="content-2">content span 2</span>
      </div>
      <button onClick={() => console.log("click 했을 때")}>클릭 버튼</button>
    </p>
  );
};

const Test = () => {
  return (
    <>
      <h2>Fragment Title</h2>
      <span>Fragment test</span>
    </>
  );
};

export default App;
