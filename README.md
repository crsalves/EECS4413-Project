
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

## **Running the Application**

### **Option 1: Running the Project Using Docker**

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

---

### **Option 2: Running the Project on Localhost**

To run the project locally without Docker, the installation of necessary software and packages has been automated using a [**Makefile**](#) commands to set-up and start the necessary parts of application (Database, Backend, and Frontend). Following the steps and execute the commands subsequently:

#### Step 1. Set-up the [**Database**](#)

- Create the connection using the configuration below:
```
Port: 3306
user: root
password: password
database name: pet_store
```

- Set Execute the queries from the schema [**scripts.sql**](#) file to create the database and populate the tables with the provided sample records.

Note that, it is possible to use the docker-compose for individuals containers. To set-up the database separately, got to app directory and execute the command:
```
make start-db
```

---

#### Step 2. Set-up the [**Backend**](#)

- Install backend dependencies and start the server program by running the following command in the `backend` directory:
```
npm install
npm run start-node-dev
```

#### Step 3. Set-up the  [**Frontend**](#)

- Install frontend dependencies and start the React development server by running the following command in the `frontend` directory:
```
npm install
npm start
```

### Finally, access the the program on
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend/API**: [http://localhost:8080](http://localhost:8080)
   - **Database**: Verify the MySQL database connection using tools such as **MySQL Workbench**.

---

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
