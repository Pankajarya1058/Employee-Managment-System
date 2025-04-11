# Employee Management System application

## Overview

The Employee Management System is a web application that allows admin to manage employee records, including adding, updating, and deleting employee details. The system is built with:

**Frontend:** ReactJS

**Backend:** NodeJS

**Database:** MySQL

**Deployment:** Docker-Compose (with multi-stage builds)

## Project Structure
```
Employee-Eanagement-System/
├── frontend/          # ReactJS source code
├── backend/           # NodeJS source code
├── .gitignore        
└── README.md          # Project documentation
```

## Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/engine/install/)

- [Docker Compose](https://docs.docker.com/compose/install/)

- [Git](https://git-scm.com/downloads)

- [MySQL Database](https://dev.mysql.com/downloads/installer/)

  

## Locally Installation & Setup
Install the MySQL Database on you local and configure according to backend/.env file.

### Clone the Repository
```
git clone https://github.com/Pankajarya1058/Employee-Managment-System.git
cd Employee-Managment-System
```
### Run below command to download node_modules in backend and frontend directory
```
npm i
```

### Run Backend
```
# Go to backend directory and run below command.
node index.js
```

### Run Frontend
```
# Go to frontend directory and run below command
npm start
```


## Setup with Docker container

### Project Structure

```
Employee-Eanagement-System/
├── frontend/          # ReactJS source code
|   ├── Dockerfile
├── backend/           # NodeJS source code
|   ├── Dockerfile
├── docker-compose.yml # Docker Compose file
└── README.md          # Project documentation
```

## Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/engine/install/)

- [Docker Compose](https://docs.docker.com/compose/install/)

- [Git](https://git-scm.com/downloads)

### Clone the Repository
```
git clone https://github.com/Pankajarya1058/Employee-Managment-System.git
cd Employee-Managment-System
```
### Switch to devops branch
```
git switch devops
```

### Run with Docker Compose

```
docker-compose up --build -d
```

This will:

- Build and run the ReactJS frontend

- Start the NodeJS backend API

- Set up the MySQL database

### Access the application through browser
```
http://<ip-of-your-server>/
Email: admin@gmail.com
Password: admin
```

### Stopping the Application

To stop the containers, run:
```
docker-compose down
```

