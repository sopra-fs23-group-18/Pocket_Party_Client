# Pocket Party

## Launch & Deployment

For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org). All other dependencies, including React, get installed with:

`npm install`

Run this command before you start your application for the first time. Next, you can start the app with:

`npm run dev`

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use Google Chrome).

### Testing

Testing is optional, and you can run the tests with `npm run test`.
This launches the test runner in an interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### Build

Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## User Flow

- Host creates a lobby
- Host shares the invite code with players
- Players join the lobby
- Host starts the game
- Host chooses a game mode(which minigames to play, how long they want to play)
- A minigame is randomly chosen
- Show a preview of the minigame, with description and image
- Players play the minigame
- Web show the results of the minigame
- Repeat until the game is over
- Show the final results of the game

## Authors

- **Stefan Schuler** -- Sopra Group 18
- **Naseem Hassan** -- Sopra Group 18
- **Sven Ringger** -- Sopra Group 18
- **Guojun Wu** -- Sopra Group 18
- **Nils Grob** -- Sopra Group 18

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
