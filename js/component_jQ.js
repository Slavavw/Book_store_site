$(function () {
  $("#dialog").dialog({ autoOpen: false });
  $("input[name='dateAndTime']").on('click', function (event) {
    //$("#fadeOut :nth-child(n+2)").fadeOut();
    $("input[name='dateAndTime']").datepicker({
      onSelect: (dateText, inpt) => {
        console.log(dateText);
        if (new Date().toLocaleDateString() !== new Date(dateText).toLocaleDateString()) {
          var dayNames = $(this).datepicker("option", "dayNames");
          $("#dialog p:nth-of-type(2)").after(`</br><p>день ${dayNames}</p>`);
          $("#dialog").dialog("open");
        }
      },
      onClose: (evnt) => {
        $("#fadeOut *:nth-child(n+2)").fadeIn();
        $("#dialog p:nth-of-type(3+n)").remove();
      },
      monthNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      dayNamesMin: ["пн", "вт", "ср", "чт", "птн", "сб", "вс"]
    });
  })
  //============================================================
  //альтернативная проверка заполнения значения элементов в формах, при сабмитах формы
  $("form").submit(function (event) {
    var validDate = true;
    $("[required],[pattern]").each(function () {
      if ($(this).attr('required') && ($(this).val() === "")) {
        $(this).focus();
        $("#dialog").append(`<p>не заполнено поле ${$(this).attr('name') || ""}</p>`);
        $("#dialog").dialog("open");
        validDate = false; return false
      }
      if ($(this).attr('pattern')) {
        var regExp = new RegExp($(this).attr("pattern"));
        if (!regExp.test($(this).val())) {
          $(this).focus();
          $("#dialog").append(`<p>данные из поля ${$(this).attr('name')} имеют неправильный формат</p>`);
          $("#dialog").dialog("open");
          validDate = false; return false
        }
      }
    })
    return validDate;
  })
  //=============================================================
  $("#dialog").on("dialogbeforeclose", function (event, ui) {
    $("#dialog *").remove();
    $(event.target).append("<p>Wrong date!</p><p>must be today</p>");
  });
});
console.log("focus");
$("input[type='tel']").focus(function (event) {
  $(this).attr("placeholder", "телефон доверия")
})
$("input[type='tel']").blur(function (event) {
  $(this).attr("placeholder", "")
})
//запись в локальное хранилище localStorage
let current_items = [{
  id: "ABCD0123",
  data: "Men's Running Shoes",
  ts: new Date()
},
{
  id: "ABCD0124",
  data: "Woomen's Running Shoes",
  ts: new Date()
},
{
  id: "ABCD0125",
  data: "Woomen's bikini",
  ts: new Date()
},
{
  id: "curentUser",
  data: "Slava",
  ts: new Date()
}]
current_items.forEach(store => localStorage.setItem(store.id, JSON.stringify(store)));
