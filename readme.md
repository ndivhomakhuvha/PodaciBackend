# PROJECT FLOW

![Authentication Flow](https://res.cloudinary.com/dxnpgxqlg/image/upload/v1685692980/project_flow_tanvzu.svg)
# ENDPOINTS


## USER

| Description | Method |            URL |
| ----------- | :----: | -------------: |
| Register    |  POST  |      /api/user |
| Login       |  POST  | /api/user/sign |

## SERVER

| Description              | Method |                    URL |
| ------------------------ | :----: | ---------------------: |
| Add Server               |  POST  |            /api/server |
| Retrieving Servers By ID |  GET   |        /api/server/:id |
| Retrieving All Servers   |  GET   |            /api/server |
| Update One Server        |  PUT   | /api/server/update/:id |

# Adding a table with References 

```SQL 
  CREATE TABLE posts (
  server_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (user_id),
  imageurl VARCHAR(100),
  ipadress VARCHAR(100),
  name VARCHAR(100),
  memory VARCHAR(100),
  type VARCHAR(100),
  status VARCHAR(100)
); 
```
# Viewing Only Content from a single user

```SQL SELECT * FROM addresses WHERE user_id = $1 ```

# Checking if A URL IS UP / NOT.

```javascript
async function checkUrl(url) {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            console.log(`${url} is running`);
        } else {
            console.log(`${url} is not running`);
        }
    } catch (error) {
        console.error(`Error checking ${url}: ${error.message}`);
    }
}

// Usage example
const url = 'http://127.0.0.1:3500'; // Replace with the desired URL

checkUrl(url);
 ```
