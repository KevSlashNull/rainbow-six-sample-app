// this a subset of the features that Tom Clancy's Rainbow Six: Siege events provides - however,
// when writing an app that consumes events - it is best if you request
// only those features that you want to handle.
//
// NOTE: in the future we'll have a wildcard option to allow retrieving all
// features
let g_interestedInFeatures = [
  'game_info',
  'match',
  'roster',
  'kill',
  'death',
  'match_info'
];

function registerEvents() {
  let { events } = overwolf.games;
  
  // general events errors
  events.onError.addListener(info => {
    console.log("Error: " + JSON.stringify(info));
  });

  // "static" data changed
  // This will also be triggered the first time we register
  // for events and will contain all the current information
  events.onInfoUpdates2.addListener(info => {
    console.log("Info UPDATE: " + JSON.stringify(info));
  });

  // an event triggerd
  events.onNewEvents.addListener(info => {
    console.log("EVENT FIRED: " + JSON.stringify(info));
  });
}

function gameLaunched(gameInfoResult) {
  if (!gameInfoResult
      || !gameInfoResult.gameInfo
      || (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged)
      || !gameInfoResult.gameInfo.isRunning
      || Math.floor(gameInfoResult.gameInfo.id/10) != 10826
     )
    return false;

  console.log("Tom Clancy's Rainbow Six: Siege launched");
  return true;
}

function gameRunning(gameInfo) {
  if (!gameInfo
      || !gameInfo.isRunning
      || Math.floor(gameInfo.id/10) != 10826
     )
    return false;

  console.log("Tom Clancy's Rainbow Six: Siege running");
  return true;
}

function setFeatures() {
  overwolf.games.events.setRequiredFeatures(g_interestedInFeatures, info => {
    if (info.status == "error")
      window.setTimeout(setFeatures, 2000) && return;

    console.log("Set required features:");
    console.log(JSON.stringify(info));
  });
}


// Start here
overwolf.games.onGameInfoUpdated.addListener(function (res) {
  if (gameLaunched(res)) {
    registerEvents();
    setTimeout(setFeatures, 1000);
  }
  console.log("onGameInfoUpdated: " + JSON.stringify(res));
});

overwolf.games.getRunningGameInfo(function (res) {
  if (gameRunning(res)) {
    registerEvents();
    setTimeout(setFeatures, 1000);
  }
  console.log("getRunningGameInfo: " + JSON.stringify(res));
});
