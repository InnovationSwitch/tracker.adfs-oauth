Package.describe({
  name: 'innovationswitch:tracker.adfs-oauth',
  version: '0.0.1',
  summary: 'Oauth2 authentication for Tracker',
  git: 'https://github.com/InnovationSwitch/tracker.adfs-oauth',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use(['underscore', 'random']);
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use(['underscore', 'service-configuration'], ['client', 'server']);
  api.use(['random', 'templating'], 'client');

  api.use('accounts-base', ['client', 'server']);

  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);

  //Add npm module files
  api.addFiles(['adfs-oauth_package.js'], ['server']);

  api.addFiles(['adfs-oauth_configure.html', 'adfs-oauth_configure.js'], 'client');
  api.addFiles('adfs-oauth_server.js', 'server');
  api.addFiles('adfs-oauth_client.js', 'client');
  api.addFiles('adfs-oauth.js');

});

//NPM module dependencies
Npm.depends({
   'jwt-simple': '0.3.1'
});
