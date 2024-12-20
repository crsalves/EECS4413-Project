
# **EECS4413 (A) F24 - Team Project**

- Demo: **Cyber Pets** (e-store web application)

## **Links**

- **GitHub Repository**: [EECS4413-Project](https://github.com/crsalves/EECS4413-Project)

  `https://github.com/crsalves/EECS4413-Project`

- **Source Code**: [app](https://github.com/crsalves/EECS4413-Project/tree/main/app)

   `https://github.com/crsalves/EECS4413-Project/tree/main/app`


- **SQL Database Scripts**: [scripts.sql](https://github.com/crsalves/EECS4413-Project/blob/main/app/database/scripts.sql)

  `https://github.com/crsalves/EECS4413-Project/blob/main/app/database/scripts.sql`


## **Overview**

This project's deployment uses **Docker** with public images hosted on **Docker Hub**.

## **Running the Application (DOCKER)**

Before proceeding, ensure **Docker Engine** and **Docker Compose** are installed:
```
   docker --version
   docker-compose --version
   ```
---

#### **Start the Program**

1. Navigate to the app directory and execute the command:
```
make run-app
```

2. Access the Web Application on [http://localhost:3000](http://localhost:3000)

---

#### **Stop the Application**

```
make stop-app
```
> **Note!**
>
> Refer to the [**Makefile**](https://github.com/crsalves/EECS4413-Project/blob/main/app/Makefile) script for detailed information about the command lines that are automatically executed when running this application.


## **Credentials**

#### Admin Account

Use the following credentials to log in as the admin user:
```
Admin-user id: admin@admin.com
Password: admin
```
---

#### MySQL Connection

```
Port: 3306
User: root
Password: password
Database: pet_store
```
