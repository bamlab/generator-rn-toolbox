# Adding Fastlane

*Fastlane is an amazing tool which allows you to easily build, sign and deploy both your iOS and Android applications.*

**Features**
- (Almost) No manual setup
- Multiple Ids + Name
- Centralized Fastlane environments config for both apps
- JS environment

***:warning: XCode 8 is required.***

## Usage

The following config is based on using HockeyApp with an Enterprise certificate for staging deployment.

***IMPORTANT:***
- Right now iOS iTunes Connect app creation has been disabled due to issues and will necessitate manual creation.
- To setup the prod app id on Apple Developer before manually adding the iTunes connect app run `bundle exec fastlane ios setup --env prod`

***IMPORTANT:*** AppStore deployment will require app icons to be setup

Then use `yo rn-toolbox:fastlane` to setup fastlane for one line deploy to Hockey App and one line prod builds.
You should then run `bundle install`

- To deploy iOS for staging run `bundle exec fastlane ios deploy_staging`
- To deploy iOS for prod run `bundle exec fastlane ios deploy_prod`
- To deploy Android for staging run `bundle exec fastlane android deploy_staging`
- To build Android for prod `bundle exec fastlane android deploy_prod`
