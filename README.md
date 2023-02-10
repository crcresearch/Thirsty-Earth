# Thirsty Earth

This repo will house the code for the Thirsty Earth game, an application that will alow players to practice water management.

## **Install Instructions**

### Prerequisites
* Docker and Docker Compose
* a Node Version Manager if running BoardGame.io code outside of docker.

### Docker Setup
- Must add a `.envs/.postgres` file to your local file tree.
- This file is an environment variable file that must define the following variables. 
  - `POSTGRES_DB`
  - `POSTGRES_HOST=postgres`
  - `POSTGRES_PORT=5432`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
- Run `docker-compose -f local.yml up` to pull down all docker images and start the database and boardgame.io containers. The local.yml file omits the nginx service from running since it does not currently run with self signed certificates out of the box.
- Once the docker containers are all up and running, the React.js frontend for Thirsty Earth will be available at `http://localhost:8000` 
- **NOTE: With the Docker approach, there is not built in live-reloading of the Boardgame.io server backend.**

### Non-Docker Setup
If desired to have live reloading and the power of the React development server, it may make sense to run the ecosystem outside of Docker. 

In this case, it is still easiest to run PostgreSQL inside of the docker container, but getting environment variables inside of the React.js frontend and Boardgame.io node.js code will require additional steps.

Here are the steps needed to adapt to this path:
- Prerequisite - Nodejs 16 runtime installed - preferably inside of a Node Version manager
- Run `npm install`
- Create a `.envs/.postgres` file per the Docker setup instructions (still needed to run postgres in Docker)
- In this case the `POSTGRES_HOST` will be `localhost` instead of `postgres`
- Run `docker-compose up postgres` to only run the postgres container.
- Create a `.env` file at the root of the project directory. This should be a copy of the `.envs/.postgres` file, with `export ` before each key/value pair.
- Run `source .env` to load all variables into the shell environment.
- To run the development node.js backend, run `npm run serve`
- To run the development React.js frontend, run `npm run start`
- The Thirsty Earth frontend will be available at `https://localhost:3000`

