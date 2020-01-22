# ReactStock Backend

#### This is the main branch that contains the backend for the ReactStock project.

Based on MERN Stack, this Backend provides the following routes:

1. :heavy_check_mark: /user : GET - Get user data using email id

2. :heavy_check_mark: /user/login : GET - Get user data using access token

3. :heavy_check_mark: /user/login: POST - Create a new user using Google profile

4. :heavy_check_mark: /user/pictures: GET - Get all the pictures posted by a user

5. :heavy_check_mark: /picture: GET - Get some pictures to display on the dashboard

6. :heavy_check_mark: /picture: POST - Upload a new picture using the access token

7. :x: /picture/:pictureId: GET - Get a picture by its id

8. :x: /picture/:pictureId: DELETE - Delete a picture by its id

To run the app, clone this repo and then in the directory, run `yarn install` and then run `yarn start`
