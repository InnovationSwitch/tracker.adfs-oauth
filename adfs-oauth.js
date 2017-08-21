Accounts.oauth.registerService('tracker-adfsoauth');

if (Meteor.isClient) {
  Meteor.loginWithTrackerAdfsoauth = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    TrackerAdfsoauth.requestCredential(options, credentialRequestCompleteCallback);
  };
}
