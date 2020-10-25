//document ready function occurs when the page's loaded (a callback function)
$(document).ready(function () {
  let coinCache = [], moreInfoCache = [], idArray = [];
  createDivs()
  createCoinCache(coinCache, moreInfoCache, idArray, status)

  //shows the Home div(a callback function)
  $("#homeButton").click(function () {
    $("#coinsDiv").empty().show()
    $("#liveReportsDiv").hide()
    $("#aboutDiv").hide()

    //if coinCach's empty get coins from server.
    if (!coinCache || coinCache.length === 0) {
      createCoinCache(coinCache, moreInfoCache, idArray, status);
    }
    else //else get from cache and create cards.
    {
      coinCache.forEach((item) => {
        createCoinCard(item, moreInfoCache, idArray)
      });
    }

  });

  //shows the About div(a callback function)
  $("#About").click(function () {
    let aboutCard = $(".flex-container").show()
    $("#aboutDiv").append(aboutCard).show()
    $("#liveReportsDiv").hide()
    $("#coinsDiv").hide()
  });

  //shows the liveReports div(a callback function)
  $("#liveReports").click(function () {
    $("#liveReportsDiv").empty()
    $("#coinsDiv").hide()
    $("#aboutDiv").hide()
    $("#liveReportsDiv").show()
    if (idArray.length !== 0) {
      createGraph(idArray)
    } else {
      $("#liveReportsDiv").empty().text('No coins were selected!').addClass('connectionErrorMessage')
    }
  });

  //shows the About div(a callback function)
  $("#searchButton").click(function () {
    let userValue = $("#sreachInput").val()
    $("#sreachInput").val("")

    for (let item of coinCache) {
      if (item.symbol == userValue) {
        createSelectedCoinCard(item, moreInfoCache, idArray)
      }
    }
  });
});


//creates the selected coin card 
function createSelectedCoinCard(coinObject, moreInfoCache) {
  $("#coinsDiv").empty()
  let toggleButton = null
  let containerDiv = $("<div>").addClass("col-lg-3 col-sm-6")
  let cardDiv = $("<div>").addClass("card");
  let cardBodyDiv = $("<div>").addClass("card-body");
  let cardH5 = $("<h5>").addClass("card-title").text(coinObject.symbol);
  let cardP = $("<p>").addClass("card-text").text(coinObject.name);
  let moreInfoDiv = $(`<div id=collapse${coinObject.id}>`).addClass("collapse");
  let loadingImage = createCardLoadingImage()
  let cardButton = createCardButton(coinObject).click(function () { onShowMoreInfoClicked(moreInfoDiv, moreInfoCache, coinObject.id, loadingImage) });
  addElementsToCoinsDiv(cardDiv, cardBodyDiv, cardH5, cardP, cardButton, loadingImage, containerDiv, toggleButton, moreInfoDiv)
}

//creates Coins div
function createCoinsDiv() {
  let coinsDiv = document.createElement("div")
  coinsDiv.className = "container-fluid"
  coinsDiv.id = "coinsDiv"
  return coinsDiv
}

//creates About div 
function createAboutDiv() {
  let aboutDiv = document.createElement("div")
  aboutDiv.className = "container"
  aboutDiv.id = "aboutDiv"
  return aboutDiv
}

//creates Live reports div
function createLiveReportsDiv() {
  let liveReportsDiv = document.createElement("div")
  liveReportsDiv.className = "container"
  liveReportsDiv.id = "liveReportsDiv"
  return liveReportsDiv
}

//creates the three divs
function createDivs() {
  let coinsDiv = createCoinsDiv()
  let aboutDiv = createAboutDiv()
  let liveReportsDiv = createLiveReportsDiv()
  document.body.appendChild(coinsDiv)
  document.body.appendChild(aboutDiv)
  document.body.appendChild(liveReportsDiv)
}

//creates the loading image of home page
function createHomeLoadingImage() {
  let LoadingImage = $('<img>', { src: "pics/loader1.gif", alt: "Error", id: "homeLoadingImage" });
  $("#coinsDiv").append(LoadingImage)

}

//creates the loading image of "Show more" button
function createCardLoadingImage() {
  let cardLoadingImageDiv = $('<div>', { id: "cardLoadingImageDiv" });
  let cardLoadingImage = $('<img>', { src: "pics/ImageLoader2.gif", alt: "Error" });
  $(cardLoadingImageDiv).append(cardLoadingImage)
  return cardLoadingImageDiv
}

//creates the cache whose all the coins from sever
function createCoinCache(coinCache, moreInfoCache, idArray) {
  createHomeLoadingImage();
  let url = "https://api.coingecko.com/api/v3/coins/list";
  $.get(url)
    .then(coins => {
      $("#homeLoadingImage").hide();
      for (let index = 0; index < 100; index++) {
        let coinObject = createCoin(coins[index]);
        coinCache.push(coinObject);
        createCoinCard(coinObject, moreInfoCache, idArray);
      }

    })

    .catch(() => {
      $("#coinsDiv").empty().text('Connection Error!').addClass('connectionErrorMessage')
    });
}

//creates coin object
function createCoin(item) {
  return coin = { id: item.id, symbol: item.symbol, name: item.name }
}

//creates a card which has a coin  
function createCoinCard(coinObject, moreInfoCache, idArray) {
  let coinSymbol = removeDotFromCoinSymbol(coinObject.symbol)
  let toggleButton = createToggleButton(coinSymbol, idArray)
  let containerDiv = $("<div>").addClass("col-lg-3 col-sm-6")
  let cardDiv = $("<div>").addClass("card");
  let cardBodyDiv = $("<div>").addClass("card-body");
  let cardH5 = $("<h5>").addClass("card-title").text(coinSymbol);
  let cardP = $("<p>").addClass("card-text").text(coinObject.name);
  let moreInfoDiv = $(`<div id=collapse${coinObject.id}>`).addClass("collapse");
  let loadingImage = createCardLoadingImage()
  let cardButton = createCardButton(coinObject).click
    (function () { onShowMoreInfoClicked(moreInfoDiv, moreInfoCache, coinObject.id, loadingImage) });

  addElementsToCoinsDiv(cardDiv, cardBodyDiv, cardH5, cardP, cardButton, loadingImage, containerDiv, toggleButton, moreInfoDiv)
}

//formatts the coin's symbol
function removeDotFromCoinSymbol(coinSymbol) {
  let newCoinSymbol = coinSymbol.replace('.', '');
  return newCoinSymbol;
}



//creates the "Moreinfo" button
function createCardButton(coinObject) {
  let cardButton = $(`<button  data-toggle='collapse' id=${coinObject.id} data-target='#collapse${coinObject.id}'>`)
    .addClass("btn btn-primary").text("More info");
  return cardButton
}

//creates the toggle button
function createToggleButton(toggleId, idArray) {
  let div = $('<section>').addClass("custom-control custom-switch");
  let labelToggle = createLabel(toggleId);
  let checkboxToggle = createCheckbox(toggleId, idArray);
  $(div).append(checkboxToggle, labelToggle);
  return div
}

//creates the label of the toggle
function createLabel(id) {
  return $(`<label for=${id} class=custom-control-label></label>`);
}

//creates the checkbox of the toggle
function createCheckbox(id, idArray) {
  return $(`<input type=checkbox class=custom-control-input id=${id}>`).prop("checked", isCheckBoxChecked(id, idArray)).click((event) => {
    onCheckBoxSwitchToggled(event, id, idArray);
  });
}

//checks whether the checkbox's checked or not(a boolean function)
function isCheckBoxChecked(id, idArray) {
  let isChecked = false;
  idArray.forEach(item => {
    if (item == id) {
      isChecked = true;
    }
  });
  return isChecked;
}

//adds the card to Coins div
function addElementsToCoinsDiv(cardDiv, cardBodyDiv, cardH5, cardP, cardButton, loadingImage, containerDiv, toggleButton, moreInfoDiv) {
  $(cardBodyDiv).append(toggleButton, cardH5, cardP, cardButton, loadingImage, moreInfoDiv);
  $(cardDiv).append(cardBodyDiv);
  $(containerDiv).append(cardDiv);
  $("#coinsDiv").append(containerDiv);
}

//shows more information about the coin(a callback function)
function onShowMoreInfoClicked(moreInfoDiv, moreInfoCache, coinId, loadingImage) {
  if ($(moreInfoDiv).is(":hidden") == true) {
    let coin = getCoinFromMoreInfoCache(coinId, moreInfoCache)
    if (!coin) {
      retrieveCoinFromServer(coinId, moreInfoCache, moreInfoDiv, loadingImage);
    }
    else {
      showMoreInfo(coin, moreInfoDiv)
    }
  }
}

//gets coin from Moreinfo cache
function getCoinFromMoreInfoCache(coinId, moreInfoCache) {
  let cachedCoin;
  moreInfoCache.forEach(item => {
    if (item.id === coinId) {
      cachedCoin = item;
    }
  });
  return cachedCoin;
}

//retrieves coin from server
function retrieveCoinFromServer(coinId, moreInfoCache, moreInfoDiv, loadingImage) {

  $(loadingImage).show()
  let url = `https://api.coingecko.com/api/v3/coins/${coinId}`;

  $.get(url).then(coin => {
    $(loadingImage).hide();
    let moreInfoCoin = createMoreInfoCoin(coin);
    moreInfoCoin = validateMoreInfoCoin(moreInfoCoin)
    moreInfoCache.push(moreInfoCoin);
    initCacheCleanUp(coinId, moreInfoCache);

    showMoreInfo(moreInfoCoin, moreInfoDiv)
    console.log(moreInfoCache)
  })

    .catch(() => {
      $(loadingImage).hide();
      $(moreInfoDiv).text("Cnnection Error!").addClass("moreInfoErrorMessage")

    });

}

//creates moreinfo coin object
function createMoreInfoCoin(coin) {
  return {
    usd: coin.market_data.current_price.usd,
    eur: coin.market_data.current_price.eur,
    ils: coin.market_data.current_price.ils,
    logo: coin.image.thumb,
    id: coin.id
  };
}

//checks whether the coin's values are undefined,if they're,converts to zero
function validateMoreInfoCoin(moreInfoCoin) {
  if (moreInfoCoin.usd === undefined || moreInfoCoin.eur === undefined || moreInfoCoin.ils === undefined) {
    moreInfoCoin.usd = 0;
    moreInfoCoin.eur = 0;
    moreInfoCoin.ils = 0;
  }
  return moreInfoCoin
}

//displays the current more information about the coin
function showMoreInfo(moreInfoCoin, moreInfoDiv) {
  $(moreInfoDiv).removeClass("moreInfoErrorMessage").empty().append((`logo: <img src=${moreInfoCoin.logo}> <br/> 
    USD: ${moreInfoCoin.usd} $ <br/> EUR: ${moreInfoCoin.eur} € <br/> ILS: ${moreInfoCoin.ils} ‏₪ `))

}

//cleans the cache every two minutes
function initCacheCleanUp(coinId, moreInfoCache) {
  setTimeout(() => {
    moreInfoCache.forEach((item, index) => {
      if (item.id == coinId) {
        moreInfoCache.splice(index, 1);
      }

    });
  }, 8000);
}

//checks if the toggle is on or off under the limitation of five toggles(a callback function)
function onCheckBoxSwitchToggled(event, id, idArray) {
  if (idArray.length < 5) {
    if ($(event.target).prop("checked") == true) {
      idArray.push(id)
      console.log(idArray)
    }
    else {
      removeFromIdArray(idArray, id)
      console.log(idArray)
    }
  } else if ($(event.target).prop("checked") == false) {
    removeFromIdArray(idArray, id)
    console.log(idArray)
  }
  else {
    $(`input[id=${id}]`).prop("checked", false);
    $(".modal-body").empty()
    createModalToggles(idArray, id)
    $('#myModal').modal('show');
  }
}

//creates the modal toggles
function createModalToggles(idArray, id) {
  for (let index = 0; index < idArray.length; index++) {
    let div = createModalToggle(idArray, id, index)
    $(".modal-body").append(div);
  }
}

//creates the modal toggle
function createModalToggle(idArray, id, index) {
  let div = $("<div>").addClass("custom-control custom-switch");
  let myLabel = $(`<label for=modal${idArray[index]} class=custom-control-label>${idArray[index]}</label>`);
  let myCheckbox = $(`<input type=checkbox class=custom-control-input id=modal${idArray[index]}>`).prop("checked", true)
    .click(() => { oneModalCheckBoxSwitchToggled("modal" + idArray[index], id, idArray) });
  $(div).append(myCheckbox, myLabel);
  return div
}

//removes the chosen toggle(a callback function)
function oneModalCheckBoxSwitchToggled(id, lastCoinId, idArray) {
  for (let index = 0; index < idArray.length; index++) {
    $(`input[id=modal${idArray[index]}]`).attr('disabled', true);
  }

  let extractedId = id.slice(5)
  $("#cancelButton").unbind().click(() => {//unbind methods prevents duplicates
    onCancelClicked(extractedId, lastCoinId, idArray);
  });
}

//displays the chosen coin on account of the other chosen coin (a callback function)
function onCancelClicked(extractedId, lastCoinId, idArray) {
  removeFromIdArray(idArray, extractedId)
  $(`input[id=${extractedId}]`).prop("checked", false);
  if (idArray.length < 5) {
    idArray.push(lastCoinId)
    console.log(idArray)
    $(`input[id=${idArray[idArray.length - 1]}]`).prop("checked", true);
  }
}

//removes toggle from Id array
function removeFromIdArray(idArray, id) {
  idArray.forEach((item, index) => {
    if (item == id) {
      idArray.splice(index, 1)
    }
  });

}


//creates the graph where the five checked coins are displayed(the toggles)
function createGraph(symbolArray) {
  let currencyGraphNames = [], currency1 = [], currency2 = []
    , currency3 = [], currency4 = [], currency5 = [], currencyArray = [], options = {};

  if (!symbolArray || symbolArray.length == 0) {
    /// if no checked IDs then...
    $("#liveReportsDiv").empty().text("Please choose currencies to analyse ,using the toggle button.")
      .removeClass("connectionErrorMessage").addClass('graphMessage')

    // Appending the canvas Chart for the graph
  } else {
    $("#liveReportsDiv").empty().append("<div id='chartContainer' style='height: 500px; width: 100%;'></div>");

    options = createTheGraphObject(options)

    // Setting an interval, will update Data every (2000 miliseconds) 2 seconds 
    let intervalId = setInterval(function () {
      getData(currencyGraphNames, currency1, currency2, currency3
        , currency4, currency5, currencyArray, intervalId, symbolArray);
    }, 2000);

    // Calling the function to get updated data
    getData(currencyGraphNames, currency1, currency2, currency3
      , currency4, currency5, currencyArray, intervalId, symbolArray);


    //creates the graph object
    function createTheGraphObject(options) {
      return (options = {
        animationEnabled: true,
        title: {
          text: "Live Currency Update in $",
          fontFamily: "sans-serif",
          fontWeight: 600,
        },
        axisX: {
          title: "Updates every 2 seconds",
          labelFontFamily: "Times New Roman",
          titleFontWeight: "bold",
          titleFontSize: 22,
          titleFontColor: "darkred",
          labelFontColor: "darkred",
          labelFontSize: 17,
          tickColor: "darkred",
          valueFormatString: "hh:mm:ss",
        },
        axisY: {
          title: "Value In US Dollars",
          titleFontWeight: "bold",
          titleFontSize: 22,
          titleFontColor: "darkblue",
          labelFontColor: "darkblue",
          labelFontSize: 17,
          tickColor: "darkblue",
          minimum: 0,
          prefix: "$",
        },
        toolTip: {
          shared: true,
          fontSize: 16,
        },
        legend: {
          cursor: "pointer",
          fontSize: 20,
          verticalAlign: "top",
          fontColor: "dimGrey",
        },
        data: [],
      })
    }

    //creates the currency
    function createTheCurrency(currency, key, currencyGraphNames, currencyArray, time, result) {
      currency.push({
        x: time,
        y: result[key].USD
      });
      currencyGraphNames.push(key);
      currencyArray.push(currency);
    }

    // Handles the display of the graph (for example its options)
    function appendGraph(currencyArray, currencyGraphNames, counter) {
      currencyArray.forEach((item, index) => {
        if (item != undefined && options.data.length < (counter - 1)) {
          options.data.push({
            name: currencyGraphNames[index],
            type: "spline",
            showInLegend: true,
            xValueFormatString: "hh:mm:ss",
            dataPoints: item,
          });
        }
      })

      if ($("#chartContainer") && $("#chartContainer").CanvasJSChart()) {
        $("#chartContainer").CanvasJSChart().render();
      }

      // On click function for every button, that will clear the interval. Making sure to unbind the function
      // to prevent duplicates of it and multiple calls
      $('a[href="#"]')
        .bind("click.interval", () => {
          if ($("#coinDiv").is(":hidden") == false || $("#aboutDiv").is(":hidden") == false) {
            clearInterval(intervalId);
            $('a[href="#"]').unbind("click.interval");
          }
        });
    }

    // Gets data from the API
    function getData(currencyGraphNames, currency1, currency2, currency3, currency4, currency5, currencyArray, intervalId, symbolArray) {
      let time = new Date(), counter = 1;
      let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbolArray[0]},${symbolArray[1]},${symbolArray[2]},${symbolArray[3]},${symbolArray[4]}&tsyms=USD`;

      $.get(url)

        .then(result => {
          if (result.Response == "Error") {
            $("#liveReportsDiv").empty().text("There's no data to analyse from any of your chosen currencies. Please choose different ones.")
              .removeClass("connectionErrorMessage").addClass('graphMessage')
            // Clearing the interval so it won't happen again
            clearInterval(intervalId);
            symbolArray = [];

          } else {
            for (let key in result) {
              switch (counter) {
                case 1:
                  createTheCurrency(currency1, key, currencyGraphNames, currencyArray, time, result)
                  break;
                case 2:
                  createTheCurrency(currency2, key, currencyGraphNames, currencyArray, time, result)
                  break;
                case 3:
                  createTheCurrency(currency3, key, currencyGraphNames, currencyArray, time, result)
                  break;
                case 4:
                  createTheCurrency(currency4, key, currencyGraphNames, currencyArray, time, result)
                  break;
                case 5:
                  createTheCurrency(currency5, key, currencyGraphNames, currencyArray, time, result)
                  break;
              }
              counter++;
            }
            // Appends the newly added data to the graph
            appendGraph(currencyArray, currencyGraphNames, counter);
          }
        })

        .catch(() => { $("#liveReportsDiv").empty().text('Connection Error!').removeClass("graphMessage").addClass('connectionErrorMessage') })
    }
    $("#chartContainer").CanvasJSChart(options);
  }
}
