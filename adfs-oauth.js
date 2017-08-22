Accounts.oauth.registerService('trackeradfsoauth');

if (Meteor.isClient) {
  Meteor.loginWithTrackeradfsoauth = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Trackeradfsoauth.requestCredential(options, credentialRequestCompleteCallback);
  };
}
