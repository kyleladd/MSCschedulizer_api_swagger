## Installation
-  Install Dependencies ```npm install```
- Create Test Database
- Create Production Database
- Rename and configure ```mysql_config.example.js``` to ```mysql_config.js```
- Execute/Import ```schema.sql ``` on each database connection

#### Run Tests
- Execute/Import ```test-data.sql ``` on the test database connection
- ```./node_modules/mocha/bin/mocha```

#### Run the Express API server
- Create Production database
- ```node index.js```
- Help: ```node main.js --help```

## Related Apps
- https://github.com/kyleladd/MSCschedulizer_scraper
- https://github.com/kyleladd/MSCschedulizer_api_swagger
- https://github.com/kyleladd/MSCschedulizer_FrontEnd
