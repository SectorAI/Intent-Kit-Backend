# 🚅 Intent Kit Backend Deployment Guide (Sector AI's Backend)
<h4 align="center">
    <a href="https://nodejs.org/" target="_blank">
       <img src="https://img.shields.io/badge/NodeJS-76AE64?style=flat-square" alt="Y Combinator W23">
    </a>
    <a href="[https://nodejs.org/](https://nestjs.com/)" target="_blank">
       <img src="https://img.shields.io/badge/NestJS-E42751?style=flat-square" alt="Y Combinator W23">
        </a>
    <a href="https://www.postgresql.org/" target="_blank">
       <img src="https://img.shields.io/badge/PostgreSQL-31638C?style=flat-square" alt="Y Combinator W23">
    </a>
      <a href="https://redis.io/" target="_blank">
       <img src="https://img.shields.io/badge/Redis-9F1910?style=flat-square" alt="Y Combinator W23">
    </a>
    <a href="https://telegram.org">
        <img src="https://img.shields.io/static/v1?label=Chat%20on&message=Telegram&color=blue&logo=Telegram&style=flat-square" alt="Telegram">
    </a>
</h4>
This backend is built using [NestJS](https://nestjs.com/), a powerful Node.js framework for building scalable and efficient server-side applications. Below are the detailed steps to deploy and run the backend for your project:

## Prerequisites

Before you start, ensure that you have the following installed and properly configured on your machine:

1. [Node.js \(version 20 or above\)](https://nodejs.org/en/download)
2. [PostgreSQL \(for storing agent data\)](https://www.postgresql.org/)
3. [Redis \(for caching purposes\)](https://redis.io/)


## 📖 Setup Instructions

### Step 1: Install Dependencies:

> [!IMPORTANT]
>First, ensure that your Node.js version is 20 or higher. You can check this by running `node -v`.

Install the project dependencies by running the following command:

```shell
yarn install
```

### Step 2: Install Required Programs

- You will need PostgreSQL to store agent data. Please make sure that you have PostgreSQL installed and running.
- Install Redis to handle caching. Redis is a key-value store used for optimizing performance.

### Step 3: Configure Environment Variables

- Copy the example environment configuration file by running the following command:

```bash
cp .env.example .env
```

- Modify the `.env` file with your specific configurations. This file contains sensitive data like database credentials, cache settings, etc. Be sure to update the necessary fields for your local or production environment.

### Step 4: Run in Development Mode

- To start the application in development mode, use the following command:
```bash
yarn dev
```

- This will run the application with hot-reloading, so changes you make to the code will be reflected without restarting the server.

### Step 5: Build the Project

- If you want to build the project for production, run:
```bash
yarn build

```
- This will compile the project into a production-ready state, optimizing the code and assets.

### Step 6: Start the Project in Production

- To start the project in a production environment, use:
``` bash
yarn start

```
- This will start the server with all production configurations and optimizations in place.



### Additional Notes:
> - Make sure your PostgreSQL and Redis instances are correctly configured and accessible as specified in the `.env` file.
> - For further configuration or troubleshooting, refer to the NestJS documentation or check the logs generated during the yarn dev and yarn start commands.
> - By following these steps, you will have the backend running locally or in a production environment.

If you have suggestions on how to improve the code quality feel free to open an issue or a PR.


# Support / talk with uss
- [Community Telegram 💭](https://telegram.org)
- Our emails ✉️ 
