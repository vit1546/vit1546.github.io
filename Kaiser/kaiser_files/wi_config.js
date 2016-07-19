try {  //PROD Config : Ensures that other script tags are not interfered with.
    if (typeof kaiserConfig == "undefined") { kaiserConfig = {}; } // Create new global var if missing.
    kaiserConfig.wi =
        {isDebug:   false
        ,isWtDebug: false
        ,isSSA:     'true'
        ,domain:    'statse.webtrendslive.com'
        ,navStartLevel: '1'
        ,dcsid:     'dcspqhv09000000ctqpwnx704_7o8c'
        ,isActive:  'true'
        ,hccFilter: '/Consumer/Health & wellness/Live healthy/Featured health topics/(.*)'
        ,linkTracking: true
        ,accordionTracking: true
        ,lightboxTracking: true
        ,isWtInside: false
        };

} catch(err) {
    console.error(err);
} 