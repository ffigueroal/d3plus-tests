import React from 'react';

class VizBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const {config} = this.props;

    return (
      <div className="section">
        <div className="container">
          {config}
        </div>
      </div>
    )
  }
}

export default VizBox;