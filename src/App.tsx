const App = () => {
  return (
    <div id="app" key="0">
      <h1>Hello</h1>
      <div>
        <p>Nested structure1</p>
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
  return <>Fragment test</>;
};

export default App;
