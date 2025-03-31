# Employee Management System application

## Overview

The Employee Management System is a web application that allows users to manage employee records, including adding, updating, and deleting employee details. The system is built with:

**Frontend:** ReactJS

**Backend:** NodeJS

**Database:** MySQL

**Deployment:** Docker-Compose (with multi-stage builds)

## Project Structure

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

- Docker

- Docker Compose

- Git

## Installation & Setup

**Clone the Repository**
```
git clone https://github.com/Panky1058/Employee-Managment-System.git
cd Employee-Management-System
```
## Switch to devops branch
```
git switch devops
```

## Run with Docker Compose

```
docker-compose up --build -d
```

This will:

- Build and run the ReactJS frontend

- Start the NodeJS backend API

- Set up the MySQL database
