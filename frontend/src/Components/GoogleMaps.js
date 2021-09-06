import React, {Component} from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

//note: code formatted for ES6 here
export class MapContainer extends Component {
    state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      mapCenter:{
          lat: 1.2921,
          lng: 36.8219
      }
    };
   
    onMarkerClick = (props, marker, e) =>
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
   
    onMapClicked = (props) => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        })
      }
    };
   
    render() {
      return (
        <Map google={this.props.google}
            
            initialCenter= {{
                lat:this.state.mapCenter.lat,
                lng:this.state.mapCenter.lng
            }}
            >
          <Marker onClick={this.onMarkerClick}
                  name={'Current location'} />
   
        </Map>
      )
    }
  }

  export default GoogleApiWrapper({
      apiKey: ('AIzaSyD_lMXvGFGsiO2qhvX7Vs49r-sdICRtrAQ')
  })(MapContainer)