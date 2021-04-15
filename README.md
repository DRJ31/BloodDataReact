# Blood Data Management System | React (Ant Design)

This is a simple website to manage results from blood routine examination. You can also modify it to keep track of other data manually. 

The website is of private use at present, therefore, there is temporarily no registration function in the system. The purpose of login function is to block strangers, thus the information of user has to add to database manually. 

This is the frontend of the project, the backend of the project is [DRJ31/BloodDataExpress](https://github.com/DRJ31/BloodData/Express)

## Installation
The project use **yarn** as package management tool. If you do not have **yarn**, you should run
```shell
npm install -g yarn
```
Then, go to the root of project and then
```shell
yarn install
```
Now you can start the project.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## URLs and Functions
- **/** - Main page of data table and chart
- **/login** - Login page
- **/input** - Edit page (Developing)