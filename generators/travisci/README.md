# TravisCI setup for continuous integration

*TravisCI is a continuous integration solution allowing you to run your tests each time you do a pull request. We advocate using it for unit tests as it is faster than Bitrise to execute them.*

In order to make Travis working on your app, you need to create a .travis.yml file by running

We recommend using Travis for the tests as it comes with yarn preinstalled and allows you to save your Jest cache

`yo rn-toolbox:travisci`

Then you have to configure the branch on which you want to trigger travisCI webhook on :)
