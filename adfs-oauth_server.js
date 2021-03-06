Trackeradfsoauth = {};

OAuth.registerService('trackeradfsoauth', 2, null, function (query) {

    var config = Companies.findOne({slug: 'tracker'});

    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }

    var response = getTokens(query);
    var expiresAt = (+new Date) + (1000 * parseInt(response.expiresIn, 10));
    var accessToken = response.accessToken;

    var identity = getIdentity(accessToken);

    var serviceData = {
        accessToken: accessToken,
        expiresAt: expiresAt
    };

    //Add fields from jwt token to the serviceData
    _.extend(serviceData, identity);

    // only set the token in serviceData if it's there. this ensures
    // that we don't lose old ones (since we only get this on the first
    // log in attempt)
    if (response.refreshToken)
        serviceData.refreshToken = response.refreshToken;

    return {
        serviceData: serviceData,
        options: {profile: {name: identity[config.profileNameField]}}
    };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {

    var config = Companies.findOne({slug: 'tracker'});

    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }

    var response;
    try {
        response = HTTP.post(
            config.oauthAdfsUrl + "/token", {
                npmRequestOptions: {
                    rejectUnauthorized: false //allow self signed certificates
                },
                params: {
                    code: query.code,
                    client_id: config.clientId,
                    client_secret: OAuth.openSecret(config.secret),
                    redirect_uri: config.redirectUri,
                    grant_type: 'authorization_code'
                }
            });

    } catch (err) {
        console.log(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with Adfsoauth. " + err.message),
            {response: err.response});
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error("Failed to complete OAuth handshake with Adfsoauth. " + response.data.error);
    } else {
        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
            idToken: response.data.id_token
        };
    }
};

var getIdentity = function (accessToken) {

    var config = Companies.findOne({slug: 'tracker'});

    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }

    try {
        return verifyToken(accessToken, config.publicCertPath, 'RS256');
    } catch (err) {
        throw _.extend(new Error("Failed to fetch identity from ADFS jwt token. " + err.message),
            {response: err.response});
    }
};

Trackeradfsoauth.retrieveCredential = function (credentialToken, credentialSecret) {

    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};