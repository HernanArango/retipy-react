retipy-react
============

retipy-react is part of the [retipy](https://github.com/alevalv/retipy-rest) project.

UI implementation that relies on [retipy-rest](https://github.com/alevalv/retipy-rest)
REST api to provide a good UX when using retipy.

This project was done using Typescript + React, with the [material-ui](http://material-ui.com/) UI
components.

Building and Testing locally
----------------------------

Install [yarn](https://yarnpkg.com/) in your machine.

Run `yarn install` to fetch all project dependencies (this can take a while).

To test your changes in a local server run `yarn start`.

Building the docker image
-------------------------

Run the following command in the root folder of the project:

```sh
docker build --rm -f "docker/Dockerfile" -t retipy-ui:latest .
```

You can start your created image with: `docker run -it -p 80:80 retipy-ui:latest`. It will map
the server to the port 80 of your machine, switch the -p second 80 to the desired port if this is
an issue.

Automatic builds are available in docker hub as `alevalv/retipy-ui`.

License
-------

retipy-react is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
