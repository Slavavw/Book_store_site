
$("#geo-location button").click(function (event) {
  geoip2.city((geolocation) => {
    console.log(geolocation);
    let position = {};
    position.coords = {
      latitude: geolocation.location.latitude,
      longitude: geolocation.location.longitude
    }
    geo_success(position, true);
  })

  if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geo_success, geo_error);
  }
})
function geo_success(position, MaxMind = false) {
  let { latitude, longitude } = position.coords;
  if (MaxMind) {
    $(".geo-location,.dialog").attr("title", "Geolocation")
      .append(`<h4>Геолокация через сервис maxmind</h4>`)
      .append(`<p>
              <a href="https://dev.maxmind.com/geoip/geolocate-an-ip/client-side-javascript?lang=en" terget="_blank">
                IP to location service provided by MaxMind
              </a>
              </p>`)
      .append(`<p>Широта: ${latitude}</p>`)
      .append(`<p>Долгота: ${longitude}</p>`);
  }
  else {
    $(".geo-location,.dialog").attr("title", "Geolocation")
      .append(`<h4>Геолокация через <b>navigator.geolocation</b></h4>`)
      .append(`<p>Широта: ${latitude}</p>`)
      .append(`<p>Долгота: ${longitude}</p>`);
  }
  $(".geo-location,.dialog").dialog({
    show: { effect: "blind", duration: 800 },
    buttons: [{
      text: "Ok",
      icon: "ui-icon-close",
      click: () => $(".geo-location,.dialog").dialog("close")
    }],
    close: (event, ui) => $(".geo-location,.dialog").text("")
  })
}
function geo_error(err) {
  if (err.code === 1) Error("Пользователь запретил определение местоположения.")
  else if (err.code === 2) Error("Географическая информация недоступна")
  else if (err.code === 3) Error("Превышен интервал ожидания географической информации")
  else Error("Во время запроса географической информации произошла неизвестная ошибка")
}
