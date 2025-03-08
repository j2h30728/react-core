const App = () => {
  return (
    <div id="app" key="0">
      <h1>Hello</h1>
      <div>
        <p>중첩구조</p>
      </div>
      <Header />
      <Content />
      <Test />
    </div>
  );
};

const Header = () => {
  return (
    <h1 key="1" id="header">
      Hello, React Clone!
    </h1>
  );
};

const Content = () => {
  return (
    <p key="2" id="content">
      This is a simple React Clone.
      <div>
        <span>content span 1</span>
        <span>content span 2</span>
      </div>
    </p>
  );
};

const Test = () => {
  return <>Fragment test</>;
};

export default App;
