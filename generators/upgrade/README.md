# React Native Upgrade

*Tired of React Native upgrade screewing up your files use this generator for patch upgrades!*

:warning: ***This generator is deprecated and won't be maintained anymore. We recommend using [react-native-git-upgrade](https://facebook.github.io/react-native/blog/2016/12/05/easier-upgrades.html) from now on.***

**Disclaimer**
Thank you [ncuillery](https://github.com/ncuillery) for creating [those patches](https://github.com/ncuillery/rn-diff)!

**Features**
- Automatic React Native version detection
- Fetches and generates the patch
- Installs new React Native version
- Applies the patch using 3way merge or patch

## Usage
- Make sure to start from a clean repository
- Make sure to commit after each upgrade.
- Run `yo rn-toolbox:upgrade` once for each upgrade.

## Troubleshooting
- If the command fails using `git apply`
  - Reset your git
  - Use `patch` and resolve failing merges manually.
