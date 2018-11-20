import React, { Component } from "react";
import {
  Map,
  GoogleApiWrapper,
  Polygon,
  Marker,
  InfoWindow
} from "google-maps-react";
import axios from "axios";

const mapStyles = {
  width: "100%",
  height: "100%"
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: [],
      machines: [],
      selectedPlace: {},
      activeMarker: {},
      showingInfoWindow: false
    };

    this.loadData();
  }

  componentDidMount() {
    this.interval = setInterval(() => this.loadData(), 120000);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  async loadData() {
    try {
      const areas = await axios.get("http://localhost:3000/areas");
      const machines = await axios.get("http://localhost:3000/machines");
      this.setState({ areas: areas.data });
      this.setState({ machines: machines.data });
    } catch (err) {
      console.log(err);
    }
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    const iconPaths = [
      "http://maps.google.com/mapfiles/kml/paddle/grn-blank.png",
      "http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png",
      "http://maps.google.com/mapfiles/kml/paddle/red-blank.png"
    ];
    const areas = this.state.areas.map(area => {
      const coords = area.location.coordinates[0].map(point => {
        return { lat: point[0], lng: point[1] };
      });
      return (
        <Polygon
          key={area._id}
          paths={coords}
          strokeColor="#00FF00"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#00FF00"
          fillOpacity={0.35}
        />
      );
    });
    const points = this.state.machines.map(m => {
      return (
        <Marker
          key={m._id}
          onClick={this.onMarkerClick}
          name={`Máquina ${m.id_in_company} de ${m.company_name}`}
          position={{
            lat: m.location.coordinates[0],
            lng: m.location.coordinates[1]
          }}
          icon={{
            url: iconPaths[m.color],
            scaledSize: new this.props.google.maps.Size(32, 32)
          }}
        />
      );
    });
    return (
      <div>
        <Map
          google={this.props.google}
          onClick={this.onMapClicked}
          zoom={14}
          style={mapStyles}
          initialCenter={{
            lat: -23.2237,
            lng: -45.9009
          }}
          mapType="hybrid"
        >
          {areas}
          {points}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onMapClicked}
          >
            <div>
              <h5>{this.state.selectedPlace.name}</h5>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAO_FN-RXXM2k6H9ebcSCz4EccReTlJ3H8"
})(Home);
