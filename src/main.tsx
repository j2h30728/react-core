const App = () => {
  return (
    <div>
      <h3 key="h3-key">Hello World</h3>
    </div>
  );
};

document.querySelector<HTMLButtonElement>("#app")?.appendChild(App());
