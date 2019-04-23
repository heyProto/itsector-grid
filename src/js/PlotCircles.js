import React from 'react';
import Util from '../js/utility';

class PlotCircles extends React.Component { 
  
  render() {
    if (this.props.dataJSON === undefined) {
      return(<div></div>)
    } else {
      const {colorCategory, defaultCircleColor} = this.props.chartOptions;
      const circles = this.props.dataJSON.map((point, i) => {
        return(
          <circle 
            data-id={point.id}
            className={`map-circles circle-${point.id}`}
            key={i} 
            cx={this.props.projection([point.long, point.lat])[0]} 
            cy={this.props.projection([point.long, point.lat])[1]} 
            r={4}
            fill={defaultCircleColor}
            onClick={this.props.showModal}>
          </circle>
        )
      });
      return(
        <g>{circles}</g>
      )
    }
  }
}

export default PlotCircles;
