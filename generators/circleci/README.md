# CircleCI setup for continuous integration

*CircleCI is a continuous integration solution allowing you to run your tests each time you do a pull request. We advocate using it for unit tests as it is faster than Bitrise to execute them.*

In order to make circleCI working on your app, you need to create a circle.yml file by running

`yo rn-toolbox:circleci`

Then you have to configure the branch on which you want to trigger circleCI webhook directly on GitHub :)
