# Lower Rio Grande Salinity Forecast
Website to display TCEQ stations in the Rio Grande Valley and show the lower Rio Grande salinity forecast (LRGSF) levels. The LRGSF also functions as a REST API to provide users with hourly water quality data data from TCEQ stations.

![Website Image](public/images/website-layout.png)

The website will be accessible through https://lrgsf.utrgv.edu.

## Installation

The LRGSF app salinity-site is designed to run on a Linux machine. To run the salinity-site you first need to install the following software.
* NodeJs
* MySQL

### NodeJs

To install NodeJs you need to follow the steps found here https://nodejs.dev/learn/how-to-install-nodejs.
If you are running Ubuntu you can execute the following commands.
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

Once you have installed NodeJs, go ahead and clone the salinity-site repository. Once cloned, using your preferred text editor open up the src/app.js file and uncomment the first line and commend out the second line. This is because the default environment path is hardcoded to match the servers .env path and will not match your local computer's path.

Next, oepn up your terminal and navigate into the project home directory where the package.json and package-lock.json files are found and run the following commands.
```bash
npm install
```
Once all packages have been installed run the development bash script to build the website using the following.
```bash
npm run dev
```
Once you see 2 green built messages, end the command using cntrl+c and start the website using the following.
```bash
npm start
```

Open up your browser and go to http://localhost:3000 to view the salinity-site or LRGSF website running on your local computer.

### MySQL

To install MySQL you need to follow the steps found here https://www.geeksforgeeks.org/how-to-install-mysql-on-linux/.
If you are running Ubuntu you can execute the following commands. Then follow the prompted instructions to set up your MySQL server.
```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```
Once you have set up your MySQL server, create a new database and import the tables from the tceq_database.sql file. You can use the following command.
```bash
mysql -u USER_NAME -p DATABASE_NAME < tceq_database.sql
```
Next, create a **.env** file in the project directory where the package-lock.json and package.json files are found. Add the following variables and assign them the values according to your preference and MySQL set up.
```bash
DB_NAME="YourDatabaseName"
DB_USER="YourDatabaseUsername"
DB_PASS="YourUserPassword"
API_KEY="YourPasskey"
```

## API
The LRGSF API provides users with hourly water quantity data of the Rio Grande River from the TCEQ stations. We have a web scrapper set up in our server that collects data daily to ensure our API has the latest data.

To test our API we recommend you use **PostMan** https://www.postman.com/, using the PostMan app makes it easier to make requests to our API.

### About
By making a get request to http://localhost:3000/api/help users can get a sense of how to use the API.
![Get Request](public/images/get_request.png)
The user must send a start and end date get the water quality data during that period. The API only provides data as far back as January 01, 2019, since this is the earliest data collected by the TCEQ deparment.

### Request Data
By making a post request to http://localhost:3000/api/riogranderiver users can download their desired timeframe of data by following the link returned by the API.
![Post Request](public/images/post_request.png)
Users must include the start and end date in the body section of PostMan in JSON format and include the API Key in Authorization tab using Basic Auth type.
