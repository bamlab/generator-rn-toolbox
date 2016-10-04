# RN Toolbox
Yeoman generators to kickstart your react-native v0.33 - 0.34 projects. It requires XCode 8.

## Warning
As of now, the way those generators are configured is heavily biased and based on our own company needs.

## Main features
- Eslint setup
- Fastlane setup for multiple environments
  - (Almost) No manual setup
  - Multiple Ids + Name
  - Centralized environments config for both apps

## Generators

### Running the steps

It is recommended to initiate the git repository right after instantiating the app and to do you first commit.

It is also recommended to do a separate commit after running each of these steps.

### Creating your react app

Use the `react init <ProjectName> && cd <ProjectName>` command to instanctiate your React Native Project.

### Adding eslint

*Eslint ensures a constistent coding style. For React Native newcomers it will also help you in your path to learn it.*

Use `yo rn-toolbox:eslint` to setup airbnb react native eslint

### Adding fastlane

*Fastlane is an amazing tool which allows you easily build, sign and deploy both your iOS and Android applications.*

The following config is based on using HockeyApp with an Enterprise certificate for staging deployment.

***IMPORTANT:*** In order to use this generator, upon instanciating the project open the `.xcproject` file and change the following config:
- `open ios/<ProjectName>.xcproject`
- Click the project file and uncheck ***Automatically manage signing***
- Go to ***Build Settings*** select ***All*** and scroll to ***Signing***
- For ***Code Signing Identity/Debug*** select ***iOS Developer***
- For ***Code Signing Identity/Release*** select ***iOS Distribution***

***IMPORTANT:*** Right now iOS iTunes Connect app creation has been disabled due to issues upon app creation and will necessitate manual creation.

***IMPORTANT:*** AppStore deployment will require app icons to be setup

Then use `yo rn-toolbox:fastlane` to setup fastlane for one line deploy to Hockey App and one line prod builds
You should then run `bundle install`

- To deploy iOS for staging run `bundle exec ios fastlane deploy_staging`
- To deploy iOS for prod run `bundle exec fastlane ios deploy_prod`
- To deploy Android for staging run `bundle exec fastlane android deploy_staging`
- To build Android for prod `bundle exec fastlane android deploy_prod`

## Upcoming features
- Android prod deployment
- Cocoapods compatibility
- Jest setup
- Continuous deployment setup (via bitrise)