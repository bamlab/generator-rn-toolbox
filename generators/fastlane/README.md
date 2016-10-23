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

***IMPORTANT:*** In order to use this generator, upon instantiating the project open the `.xcodeproj` file and change the following config:
- `open ios/<ProjectName>.xcodeproj`
- Click the project file and uncheck ***Automatically manage signing***
- Go to ***Build Settings*** select ***All*** and scroll to ***Signing***
- For ***Code Signing Identity/Debug*** select ***iOS Developer***
- For ***Code Signing Identity/Release*** select ***iOS Distribution***

***IMPORTANT:*** Right now iOS iTunes Connect app creation has been disabled due to issues upon app creation and will necessitate manual creation.

***IMPORTANT:*** AppStore deployment will require app icons to be setup

Then use `yo rn-toolbox:fastlane` to setup fastlane for one line deploy to Hockey App and one line prod builds.
You should then run `bundle install`

- To deploy iOS for staging run `bundle exec fastlane ios deploy_staging`
- To deploy iOS for prod run `bundle exec fastlane ios deploy_prod`
- To deploy Android for staging run `bundle exec fastlane android deploy_staging`
- To build Android for prod `bundle exec fastlane android deploy_prod`
