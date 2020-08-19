/* eslint-disable */


import * as React from 'react';

interface HomeProps {
  fileName: string;
}




export default class Counter extends React.Component<HomeProps,{}> {
  state = {
    count: 0
  };

  increment = () => {
    this.setState({
      count: (this.state.count + 1)
    });
  };

  decrement = () => {
    this.setState({
      count: (this.state.count - 1)
    });
  };

  render () {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <h2>{this.props.fileName}</h2>
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement}>Decrement</button>
      </div>
    );
  }
}
