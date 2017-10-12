# Jest setup

*Unit tests are an essential part of developping a robust application. Jest is the ideal unit test tool for React Native.*

Jest now comes bundled with React Native but this generator will setup a few extra tools.

Use `yo rn-toolbox:jest` to setup jest.

**Features**
- Base test
- File Stub to prevent errors when files are imported in components
- Base test for the `Button` component if `rn-toolbox:base` was installed
- Inclusion of `npm run test:lint` when running `npm test` if `rn-toolbox:lint` was installed
