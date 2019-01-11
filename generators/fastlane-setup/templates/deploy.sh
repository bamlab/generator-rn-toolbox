#! /bin/bash
set -e

DEV=0
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NO_COLOR='\033[0m'

APP_ENV="test"
APP_OS="ios and android"
DEPLOY_TYPE="soft"


success(){
  echo -e "✅  ${GREEN}$1${NO_COLOR}"
}

warn(){
  echo -e "⚠️  ${YELLOW}$1${NO_COLOR}"

  if [ $DEV -eq 0 ]
  then
    exit 1
  fi
}

check_environment(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  case $APP_ENV in
    production)
      BRANCH=production;;
    test)
      BRANCH=test;;
    *) warn "Unknown target \"$APP_ENV\".";;
  esac

  if [ "$CURRENT_BRANCH" != "$BRANCH" ]
  then
    warn "Wrong branch, checkout $BRANCH to deploy to $APP_ENV."
  else
    success "Deploying to $APP_ENV."
  fi
}


while getopts ":e:o:t:d:m:" opt; do
  case $opt in
    e) APP_ENV="$OPTARG"
    ;;
    o) APP_OS="$OPTARG"
    ;;
    t) DEPLOY_TYPE="$OPTARG"
    ;;
    d) DEV=1
    ;;
    \?) echo "${RED}Invalid option -$OPTARG${NO_COLOR}" >&2
    ;;
  esac
done

[[ -z $(git status -s) ]] || warn 'Please make sure you deploy with no changes or untracked files. You can run *git stash --include-untracked*.'

check_environment $APP_ENV

if [ $DEPLOY_TYPE == "hard" ]; then
  echo -e "${BLUE}* * * * *"
  echo -e "👷  Hard-Deploy"
  echo -e "* * * * *${NO_COLOR}"
  if [[ $APP_OS != "android" ]]; then
    echo -e "${GREEN}- - - - -"
    echo -e "Fastlane 🍎  iOS $APP_ENV"
    echo -e "- - - - -${NO_COLOR}"
    bundle exec fastlane ios deploy --env=$APP_ENV
  fi
  if [[ $APP_OS != "ios" ]]; then
    echo -e "${YELLOW}- - - - -"
    echo "Fastlane 🤖  Android $APP_ENV"
    echo -e "- - - - -${NO_COLOR}"
    bundle exec fastlane android deploy --env=$APP_ENV
  fi
fi

if [ $DEPLOY_TYPE == "soft" ]; then
  echo -e "${CYAN}* * * * *"
  echo -e "🍦  Soft-Deploy"
  echo -e "* * * * *${NO_COLOR}"

  source fastlane/.env
  mv src/environment/index.js src/environment/index.js.bak
  cp src/environment/index.$APP_ENV.js src/environment/index.js

  LAST_GIT_COMMIT=$(git log HEAD --pretty=format:"%h : %s" -1)
  MESSAGE="${LAST_GIT_COMMIT}"
  echo -e "${CYAN}Deploying Commit : $MESSAGE${NO_COLOR}"

  yarn

  
  CODEPUSH_KEY_PATH="codepush_private_key_${APP_ENV}.pem" # 
  if [[ $APP_OS != "android" ]]; then
    echo -e "${GREEN}- - - - -"
    echo -e "Codepush 🍎  iOS ${APP_ENV}"
    echo -e "- - - - -${NO_COLOR}"
    appcenter codepush release-react -d $IOS_CODEPUSH_DEPLOYMENT_NAME -a $APPCENTER_USERNAME/$IOS_APPCENTER_APP_ID --target-binary-version ">=$IOS_MINIMUM_CODEPUSH_VERSION" --description "$MESSAGE" || [ "$?" -eq "3" ];
  fi
  if [[ $APP_OS != "ios" ]]; then
    echo -e "${YELLOW}- - - - -"
    echo -e "Codepush 🤖  Android ${APP_ENV}"
    echo -e "- - - - -${NO_COLOR}"
    appcenter codepush release-react -d $ANDROID_CODEPUSH_DEPLOYMENT_NAME -a $APPCENTER_USERNAME/$ANDROID_APPCENTER_APP_ID --target-binary-version ">=$ANDROID_MINIMUM_CODEPUSH_VERSION" --description "$MESSAGE" || [ "$?" -eq "3" ];
  fi
  

  mv src/environment/index.js.bak src/environment/index.js
fi

success "📦  Deploy succeeded."
