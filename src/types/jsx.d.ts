declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
    // type ElementType = string | React.JSXElementConstructor<any>;
    // interface Element extends React.ReactElement<any, any> {}
  }
}
