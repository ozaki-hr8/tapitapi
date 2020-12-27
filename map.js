const url = "https://sbi72z2kn8.execute-api.ap-northeast-1.amazonaws.com/prod"
var data2

function attach_message(map, marker, name, konzatu, iw) {
    google.maps.event.addListener(marker, "click", function (e) {
        iw.setContent(`<span>${name}<br>混雑度：${konzatu}</span>`)
        iw.open(map, marker)
    })
}

$(function () {
    $.ajax({
        url: url,
        success: function (json) {
            data2 = jsonRequest(json)
            initialize()
        },
    })

    function jsonRequest(json) {
        var data = []
        var n = json.length
        for (var i = 0; i < n; i++) {
            data.push(json[i])
        }
        return data
    }


    function initialize() {
        var opts = {
            zoom: 15,
            center: new google.maps.LatLng(35.681382, 139.766084),
        }
        var map = new google.maps.Map(document.getElementById("map"), opts)
        var i = data2.length
        var iw = new google.maps.InfoWindow()
        var marker = new Array()

        for (var j = 0; j < i; j++) {
            var dat = data2[j]

            var obj = {
                position: new google.maps.LatLng(dat.ido, dat.keido),
                map: map,
                icon: "map_tapi.png"
              }
            marker[j] = new google.maps.Marker(obj)
            attach_message(map, marker[j], dat.name, dat.konzatu, iw)
            iw.close()
        }

        var minX = marker[0].getPosition().lng()
        var minY = marker[0].getPosition().lat()
        var maxX = marker[0].getPosition().lng()
        var maxY = marker[0].getPosition().lat()

        for (var j = 0; j < i; j++) {
            var lt = marker[j].getPosition().lat()
            var lg = marker[j].getPosition().lng()
            if (lg <= minX) {
                minX = lg
            }
            if (lg > maxX) {
                maxX = lg
            }
            if (lt <= minY) {
                minY = lt
            }
            if (lt > maxY) {
                maxY = lt
            }
        }

        var sw = new google.maps.LatLng(maxY, minX)
        var ne = new google.maps.LatLng(minY, maxX)
        var bounds = new google.maps.LatLngBounds(sw, ne)
        map.fitBounds(bounds)
    }

})

$(function () {
    $(".button1").click(function () {

      var opts = {
          zoom: 15,
          center: new google.maps.LatLng(35.681382, 139.766084),
      }
      var map = new google.maps.Map(document.getElementById("map"), opts)
      var i = data2.length
      var iw = new google.maps.InfoWindow()
      var marker = new Array()

      for (var j = 0; j < i; j++) {
          var dat = data2[j]
          var konzatsu=parseInt(dat.konzatu)
          var mapIcon;
          if((0<=konzatsu)&&(30>konzatsu)){
            mapIcon="map1.png"
          }else if ((30<=konzatsu)&&(60>konzatsu)) {
            mapIcon="map2.png"
          }else{
            mapIcon="map3.png"
          }
          var obj = {
              position: new google.maps.LatLng(dat.ido, dat.keido),
              map: map,
              icon: mapIcon
          }
          marker[j] = new google.maps.Marker(obj)
          attach_message(map, marker[j], dat.name, dat.konzatu, iw)
          iw.close()
      }

      var minX = marker[0].getPosition().lng()
      var minY = marker[0].getPosition().lat()
      var maxX = marker[0].getPosition().lng()
      var maxY = marker[0].getPosition().lat()

      for (var j = 0; j < i; j++) {
          var lt = marker[j].getPosition().lat()
          var lg = marker[j].getPosition().lng()
          if (lg <= minX) {
              minX = lg
          }
          if (lg > maxX) {
              maxX = lg
          }
          if (lt <= minY) {
              minY = lt
          }
          if (lt > maxY) {
              maxY = lt
          }
      }

      var sw = new google.maps.LatLng(maxY, minX)
      var ne = new google.maps.LatLng(minY, maxX)
      var bounds = new google.maps.LatLngBounds(sw, ne)
      map.fitBounds(bounds)
    })
})


$(function () {
    $("#btn").click(function () {
        var button = $(this)
        button.attr("disabled", true)
        var data = {
            TableName: "intern-ag-shop",
            Item: {
                name: {
                    S: $("#name").val(),
                },
                ido: {
                    S: $("#ido").val(),
                },
                keido: {
                    S: $("#keido").val(),
                },
                konzatu: {
                    S: $("#konzatu").val(),
                },
            },
        }

        $.ajax({
            type: "post",
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function (resp) {
                $("#name").val("")
                $("#ido").val("")
                $("#keido").val("")
                $("#konzatu").val("")
                console.log(resp)
            },
            error: function (resp) {
                console.log(resp)
            },
            complete: function () {
                button.attr("disabled", false)
            },
        })
    })
})
