import React from 'react';
import { render } from 'react-dom';

import './stripe.js';

class App extends React.Component {
  render() {
    return <p>Hello world!</p>;
  }
}

render(<App/>, document.getElementById('app'));
