const React = require("react");
const { PacmanLoader } = require("react-spinners/PacmanLoader");
const dialogModal = require("./dialogModal.jsx");

async function geoLocationByMaxMind() {
  return new Promise(resolve => geoip2.city(geolocation => resolve({
    latitude: geolocation.location.latitude,
    longitude: geolocation.location.longitude
  }))
  ).then(data => { console.log(data); return data; });
}

async function getCurrentLocation(MaxMind = false) {
  let p;
  if (!MaxMind && (navigator && navigator.geolocation)) {
    p = new Promise(resolve => navigator.geolocation.getCurrentPosition(resolve))
      .then(data => {
        let { latitude, longitude } = data.coords;
        return { latitude, longitude };
      })
  }
  else p = await geoLocationByMaxMind();
  console.log(p);
  return p;
}

class Maps_google extends React.Component {
  componentDidMount() {
    new Promise(resolve => resolve(getCurrentLocation(true)))
      .then(data => {
        let { latitude, longitude } = data;
        let map_options = {
          zoom: 15,
          center: new google.maps.LatLng(latitude, longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          //mapTypeId: google.maps.MapTypeId.HYBRID
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
          },
          navigationControl: true,
          navigationControlOptions: {
            style: google.maps.NavigationControlStyle.ZOOM_PAN,
            position: google.maps.ControlPosition.TOP_LEFT
          },
          scaleControl: true,
          scaleControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT
          }
        };
        this.props.setLocation({
          latitude,
          longitude,
          map: new google.maps.Map($("#map")[0], map_options)
        })
      })
  }
  render() {
    let { latitude, longitude, map } = this.props;
    return <div id="map"
      data-latitude={latitude ? `${latitude}` : ``}
      data-longitude={longitude ? `${longitude}` : ``}
      data-marker={
        (latitude && longitude) ? new google.maps.Marker({ position: new google.maps.LatLng(latitude, longitude), title: "Slava", map: map }) : ''
      } />
  }
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = { latitude: "", longitude: "", map: "" };
    this.setLocation = this.setLocation.bind(this);
  }
  setLocation(state = { latitude, longitude, map }) {
    console.log(state);
    this.setState({ ...state });
  }
  printAddres() {
    let { latitude, longitude, map } = this.state;
    //настройка объекта Geocoder
    let geocoder = new google.maps.Geocoder();
    //преобразовываем координаты в объект
    let yourLocation = new google.maps.LatLng(latitude, longitude);
    //находим информацию о местоположении
    geocoder.geocode({ 'latLng': yourLocation }, function (result, status) {
      new dialogModal("адрес по геолокации", `<p>Ваш адрес: </p>`, $("#dialog")).InitDialog().showDialog();
      if (status === google.maps.GeocoderStatus.OK) {
        if (result[0]) {
          dialog = new dialogModal(
            "адрес по геолокации",
            `<p>Ваш адрес: ${result[0].formatted_address}</p>`,
            $("#dialog")).InitDialog();
        }
        else Error("Google не возвратил результатов.");
      }
      else Error("Обратное геокодирование не удалось, так как " + status)
    })
  }
  render() {
    let { latitude, longitude, map } = this.state;
    return <div id="google-map" style={{ backgroundColor: "url('/images/main-bg.jpg') center -302px no-repeat fixed #f5f5f5" }}>
      <h3>Мы расположены...</h3>
      <Maps_google setLocation={this.setLocation} latitude={latitude} longitude={longitude} map={map} />
      <button className="btn btn-link"
        onClick={this.printAddres.bind(this)} disabled={!latitude}
      >Получить адрес по геолокации</button>
    </div>
  }
}


module.exports = Map;
