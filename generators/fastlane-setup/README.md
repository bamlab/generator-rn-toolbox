# Fastlane Setup

*Fastlane is an amazing tool which allows you to easily build, sign and deploy both your iOS and Android applications.*

> ***:warning: XCode 8 is required.***
> Run at least once:
> ```
> xcode-select --install
> ```

**Features**
- (Almost) No manual setup
- Multiple Ids + Name
- Centralized Fastlane environments config for both apps
- JS environment

This is just the fastlane setup step required to centralize your app config. Run it with
```
yo rn-toolbox:fastlane-setup
```

Once done head over to [fastlane-env](../fastlane-env/README.md) to setup multiple environments for your project.
