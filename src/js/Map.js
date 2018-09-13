import React from 'react';
import * as topojson from 'topojson-client';
import {geoPath, geoCentroid, geoMercator} from 'd3-geo';
import PlotCircles from '../js/PlotCircles';
import Voronoi from '../js/Voronoi';

class MapsCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projection: undefined,
      regions: [],
      outlines: [],
      country: undefined,
      path: undefined,
      offsetWidth: undefined,
      offsetHeight: undefined,
      matrix: [1, 0, 0, 1, 0, 0],
      dragging: false
    }
  }

  panLeft = () => {
    const m = this.state.matrix;
    m[4] += 20;
    this.setState({ matrix: m });
  }

  panRight = () => {
    const m = this.state.matrix;
    m[4] -= 20;
    this.setState({ matrix: m });
  }

  panUp = () => {
    const m = this.state.matrix;
    m[5] += 20;
    this.setState({ matrix: m });
  }

  panDown = () => {
    const m = this.state.matrix;
    m[5] -= 20;
    this.setState({ matrix: m });
  }

  zoom = (scale) => {
    const m = this.state.matrix;
    const len = m.length;
    for (let i = 0; i < len; i++) {
      m[i] *= scale;
    }
    m[4] += (1 - scale) * this.state.offsetWidth / 2;
    m[5] += (1 - scale) * this.state.offsetHeight / 2;
    this.setState({ matrix: m });
  }

  componentWillMount() {
    let offsetWidth = this.props.mode === 'laptop' ? 700 : 360,
      offsetHeight = this.props.mode === 'laptop' ? 700 : 400;

    let ch = this.props.topoJSON,
      country = topojson.feature(ch, ch.objects),
      center = geoCentroid(topojson.feature(ch, ch.objects)),
      scale = 700,
      projection = geoMercator().center(center)
        .scale(scale)
        .translate([offsetWidth/2, offsetHeight/2]),
      path = geoPath()
        .projection(projection);

    let bounds  = path.bounds(country),
      hscale = scale*offsetWidth  / (bounds[1][0] - bounds[0][0]),
      vscale = scale*offsetHeight / (bounds[1][1] - bounds[0][1]);
    scale = (hscale < vscale) ? hscale : vscale;
    let offset = [offsetWidth - (bounds[0][0] + bounds[1][0])/2, offsetHeight - (bounds[0][1] + bounds[1][1])/2];

    projection = geoMercator().center(center)
      .scale(scale)
      .translate(offset);
    path = path.projection(projection);

    let regions = country.features.map((d,i) => {
      return(
        <g key={i} className="region">
          <path className="geo-region" d={path(d)}></path>
        </g>
      )
    })

    let outlines = country.features.map((d,i) => {
      return(
        <path key={i} className="geo region-outline" d={path(d)}></path>
      )
    })

    this.setState({
      projection: projection,
      regions: regions,
      outlines: outlines,
      country: country,
      path: path,
      offsetWidth: offsetWidth,
      offsetHeight: offsetHeight
    })
  }

  render(){
    let styles = {
      strokeWidth: 0.675
    }
    const {projection, regions, outlines, country, path, offsetWidth, offsetHeight, matrix, dragging} = this.state;
    return(
      <div>
      <div className="map-nav">
          <button className="zoom-button" onClick={() => {this.zoom(0.8)}}>–</button>
          <button className="zoom-button" onClick={() => {this.zoom(1.25)}}>+</button>
          <div className="pan-nav">
            <button className="zoom-button" onClick={() => {this.panUp()}}>↑</button>
            <div><button className="zoom-button" onClick={() => {this.panLeft()}}>←</button>
            <button className="zoom-button" onClick={() => {this.panRight()}}>→</button></div>
            <button className="zoom-button" onClick={() => {this.panDown()}}>↓</button>
          </div>
        </div>
        <svg id='map_svg' viewBox={`0, 0, ${offsetWidth}, ${offsetHeight}`} width={offsetWidth} height={offsetHeight}>
          <g id="map-group" transform={`matrix(${this.state.matrix.join(' ')})`}>
            <g id="regions-grp" className="regions">{regions}</g>
            <path className='geo-borders' d={path(country)}></path>
            <g className="outlines" style={styles}>{outlines}</g>
            <PlotCircles dataJSON={this.props.dataJSON} projection={projection} chartOptions={this.props.chartOptions} height={offsetHeight} width={offsetWidth} />
            <Voronoi data={this.props.dataJSON} projection={projection} width={offsetWidth} height={offsetHeight} mode={this.props.mode} circleClicked={this.props.circleClicked} handleCircleClicked={this.props.handleCircleClicked} circleHover={this.props.circleHover} showModal={this.props.showModal}/> 
          </g>
        </svg>  
      </div>
    )
  }
}

export default MapsCard;
