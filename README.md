# SEI Project 3: Wanderlust

## Overview

The third project of the Software Engineering immersive course at General Assembly London was a full-stack project, in a team of 3,  using the MERN (MongoDB, Express, React.js and Node.js) framework.

## Brief
* Work in a team, using git to code collaboratively
* Build a full-stack application by building your own back-end and front-end
* Use an Express API to serve data from a Mongo database
* Consume the API with a separate front-end using React
* Be a complete product that has CRUD functionality implemented and a few models that have relationships

## Deployment
<a href="https://project-3-wanderlust.herokuapp.com/">Wanderlust</a>

## Timeframe
This was a group project of 3 people, with [James Gulland](https://github.com/james-gulland) and [Ross Rogerson](https://github.com/Ross-Rogerson), and the timeframe was 7 days.

## Technologies used:
**Planning:**
* Excalidraw
* Trello

**Front-end:**
* HTML5
* SCSS / SASS 
* JavaScript (ES6)
* React.js
* Axios
* Mapbox

**Back-end:**
* Node.js
* MongoDB
* Mongoose
* Express
* Insomnia
* Git (branching) & GitHub

## Installation
* Clone repo or download zip
* In the terminal run this command to connect the `databasemongod --dbpath ~/data/db`
* Install dependencies in the root of the project `npm install`
* In the root, seed database with `npm run seed`
* Split Terminal window and move into client folder writing `cd client`
* Install all front-end dependencies by running `npm install`
* In the ROOT start the server with `npm run serve`
* In the CLIENT start the front-end with `npm run start`
* Head to localhost: 3000 to view the site.
* You can register as a new user or to enter as an authenticated admin, you can use rosie@email.com and password: rosie1

## Planning
Inspired by the weather in the UK, we thought that every time it is raining we are thinking that we would like to be somewhere sunny and hot, therefore we decided to build a travel website called Wanderlust. This was the first full-stack app created during my time at General Assembly's Software Engineering Immersive course, and it was the third project overall.
The app includes a third party API, RESTful API, built using Express, MongoDB, NodeJS and uses React.js in the front-end.
This was a group project of 3 people to be completed in one week. And it was an amazing experience working with them.
The wireframe was created in Excalidraw and the main plan was to have a landing page with a navigation bar that included a logo on the left hand side and all destinations, login and registration on the right handside.
At the bottom, we decided to go for a sliding bar,  where the user is able to click on the weather icons. According to the icon clicked, it will show a different image and location depending on the weather.
Finally, there is the explore button that will take the user to the destination endpoint.
On this page, the user can filter the destinations, according to the temperature, date, country, continent and rating. Once everything has been filtered, multiple locations will show up showing an image and the degrees at the very top. Clicking on the destination or city will take the user to another endpoint, which is the destination name endpoint. This will show everything about the city. Such as, images, the 7-day forecast, which is an external api, attractions, another external API that shows the map of the location and reviews. Please see the wireframe below:

![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683898432/Project_3/project-3-readme-google-docs-0_cij1dn.png)

While below we have the pages for the login and the registration:

![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683898498/Project_3/project-3-readme-google-docs-1_cc8dyu.png)

Then, once the user is logged in can only add reviews. While the admin team can add new destinations and delete them as well.

![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683898550/Project_3/project-3-readme-google-docs-2_hrgqyg.png)
![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683898553/Project_3/project-3-readme-google-docs-3_woy5rz.png)

Finally we created the different relationships in a diagram before sign off. This shows the destination schema, the review schema and the user schema and their relationships.

![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683898601/Project_3/project-3-readme-google-docs-4_lzxku3.png)

We used Trello for the different tasks, but we preferred to keep it democratic and everyone was free to work on whatever they liked. However, the most important thing was to keep each other updated before starting working on a task. We didn’t want to have any conflicts when pulling or pushing to GitHub. 

## Approach

### Back-end

#### Models

#### Destination Model

* For our collections, we have 3 schemas.  
* The first model is the Destination Schema. From the code below, the destination name is unique, which means that only one destination can have that name. While, almost every property in this schema has a required property, which means that when creating the database, these properties must be provided, or the creation will fail.

Destination Schema for our destinations:

```js
const destinationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  continent: { type: String, required: true },
  currency: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  features: [{ type: String, required: true }],
   owner: { type: Schema.ObjectId, ref: 'User', required: true },
  reviews: [reviewSchema],
})
```

After creating this schema, we created roughly 100 destinations in our database. I looked after all the images and features. The latter was an array of 3 indexes, which included sightseeing, activities and restaurants.

#### User Model

* User schema for the user registration and login:

```js
const userSchema = new Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
})
```

* User: this assigns a user to every activity and uses a referenced relationship.
* `isAdmin`: this field represents whether the user is an admin or not.

Our User schema was a pretty standard one. However, certain areas about the User needed to be protected, including us, admin developers, who had direct access to the database. In order to implement this, additional features were added to the model itself to protect Users:

* Shown in the User model above, the username and email fields have been distinguished as being `unique: true`. In this way the user can't register with the same email address or with an existing username.
* Mongoose has some incredibly in-built methods which I also used in conjunction with Bcrypt for password hashing. Using pre, I was able to access Mongoose Schema’s lifecycle methods and run functions when users either register or login. 
* The first method I built was a `toJSON` function that is called whenever a Mongoose document is converted to JSON, such as when you send it as a response to an HTTP request. From the code snippet below, I have set `virtuals: true`. Virtual fields are not stored in the database. Then, I used the `transform` method that actually lives on the database and finally the password will be deleted for security reasons.

```js
// Removes password whenever a document is password is converted into JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.password
  },
})
```
* To check the password and passwordConfirmation field match from the user input during registration. If these weren't matching, it would be invalid and halts the user from registering.

```js
// Checks password matches password confirmation
userSchema.pre('validate', function (next) {
  if (this.isModified('password') && this.password !== this._passwordConfirmation) {
    this.invalidate('passwordConfirmation', 'Passwords do not match.')
  }
  next()
})
```
* If during registration the first function is passed and accepted, the password entered uses bcrypt to encrypt the password before being stored into the database. If under any circumstance the database were to be hacked, this would make it difficult for hackers to decrypt the passwords of any users.

```js
// Encrypts password
  .pre('save', function (next) {
    if (this.isModified('password')) {
      const salt = bcrypt.genSaltSync(12)
      this.password = bcrypt.hashSync(this.password, salt)
         }
    next()
  })
```

* The final function checks the credentials of a user during the login. The function checks the password currently stored in the database and ensures this matches the hashed password.

```js
userSchema.methods.validatePassword = function (plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password)
}
```

#### Review Model

* Review schema for our user when leaving a review:

```js
const { Schema } = mongoose
const reviewSchema = new Schema({
  title: { type: String, required: true, maxlength: 20 },
  text: { type: String, required: true, maxlength: 300 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  owner: { type: Schema.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
})
```

* Reviews: every activity has an array of reviews, which is an embedded relationship.
* Timestamps: this field if set to true will provide us at what time the review was created and I can show it in the UI.

Thanks to the review model, I was able to create an average rating virtual field, which contains an average of all the reviews rating. I used the GET method to execute whenever the data is retrieved from the database. Inside this method a callback function has been used, which loops through the reviews and gets an average and returns that value.

```js
destinationSchema.virtual('averageRating')
  .get(function () {
    if (!this.reviews.length) return 'Not yet rated'
    // Create a sum, then average it by dividing by the length
    const sum = this.reviews.reduce((acc, review) => {
      return acc + review.rating
    }, 0)
    return parseFloat((sum / this.reviews.length).toFixed(0))
  })
destinationSchema.set('toJSON', { virtuals: true })
```

#### Router

* As a team, we created a router.js file to determine our API endpoints, and how each of the collections would be called on. 

```js
router.route('/')
  .get(displayAllDestinations)
  .post(loginOrRegister)

router.route('/destinations/:destinationId')
  .get(displaySingleDestination)
  .post(secureRoute, addReview)
  .delete(secureRoute, deleteReview)
  .put(secureRoute, updateteReview)

router.route('/admin')
  .put(secureRoute, updateDestination)
  .post(secureRoute, addDestination)
  .delete(secureRoute, deleteDestination)
  .get(secureRoute, adminProfileView)

router.route('/profile/:userId')
  .delete(secureRoute, deleteReview)
  .get(secureRoute, profileView)
```

Every route represents the endpoint. To access the secureRoute endpoints, the user or the team member needs to login.

#### Controllers

At this point, I looked at some of the routes, such as  `/destinations/:destinationId`,  `/` and `/admin` . While writing the functions and once completed, I was testing them in Insomnia to check that they were working properly.

* The function below displays all the destinations using the GET request method to fetch the destinations from the database that we created. All users that don’t have an account can access the collection of all the destinations. The function uses a `try...catch` block to handle any errors that may occur during the asynchronous operation of fetching all destinations using Mongoose's `find()` method. 

```js
export const displayAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find()
    return res.json(destinations)
  } catch (err) {
    console.log(err)
  }
}
```

* Moving to the next endpoint `/destinations/:destinationId`. For this one as well, all users can access the collection of one single destination. The function starts by destructuring the `destinationId` parameter from the `req.params` object. This is the ID of the destination that we are fetching. The GET request method has been used, but I was looking for the destination with the method `findById()`. If no destination has been found under that Id, it will show an error when testing. Otherwise it will return with the destination that I was looking for.

```js
export const displaySingleDestination = async (req, res) => {
  try {
    // console.log(req)
    const { destinationId } = req.params
    const destination = await 
    Destination.findById(destinationId).populate('owner').populate('reviews.owner')

    // If record returns null, we want to throw a 404
    if (!destination) throw new Error('Record not found')

    // Return the found record to the client
    return res.json(destination)
  } catch (err) {
    return sendError(err, res)
  }
}
```

* If logged in the user can add a review to one of the destinations. I have used the POST request method. The function uses a `try...catch` block to handle any errors that may occur. The function starts by destructuring the destinationId parameter from the req.params object and then I look for the destination with the method `findById()`. If this is successful, the review will be added under the user profile and under that destination Id. Otherwise, if the destination was not found it will show an error.

```js
export const addReview = async (req, res) => {
    try {
    const { destinationId } = req.params
    const destination = await Destination.findById(destinationId)

    if (!destination) throw new NotFound('Destination Not Found')

    const reviewToAdd = { ...req.body, owner: req.loggedInUser._id }
    
    destination.reviews.push(reviewToAdd)
    
    await destination.save()

    return res.status(201).json(destination)
  } catch (err) {
    return sendError(err, res)
  }
}
```

* The last function that I did under the endpoint `/admin` is the `deleteDestination` function. Here I have used the DELETE request and only the admin team, as per endpoint, can delete the destinations. I started destructuring the `id` property from `req.body`. Then, I had to retrieve the Id of the user logged in and according to the latter one, I needed to search for the destination to be deleted by calling the method `Destination.findById(id)`. If the destination that I would like to delete doesn’t match my Id, it will show that I am unauthorised. Otherwise, it will delete the destination. 

```js
export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.body
    const loggedInUserId = req.loggedInUser._id

    const destinationToDelete = await Destination.findById(id)
    if (!destinationToDelete) throw new NotFound('Destination not found')

    if (!destinationToDelete.owner.equals(loggedInUserId)) {
      throw new Unauthorized()
    }
    await destinationToDelete.deleteOne()
    return res.sendStatus(204)
  } catch (err) {
    return sendError(err, res)
  }
}
```

#### Secure Route

For every route which is only accessible for users stored in the database, we have specified another function to run beforehand. The `secureRoute`. This is an entirely separate file created with middleware to identify if a user is truly logged in.

The function is a conditional statement to identify if a token has been issued. Once a user is able to successfully log in, a JWT is returned as a response which is valid for 7 days in this app.

* If the token is valid, different conditional statements have been set. If the user could not be found in the database, it throws an error on the screen saying that this logged in user was not found. 

```js
if (!loggedInUser) throw new NotFound('User not found')
```

* Then an if statement for the admin team has been created. This has been written for authorization purposes, to make sure that only users with admin privileges can access certain parts of the application. If the conditions are not met, an error will be sent.

```js
if (req.route.path.includes('admin') && !loggedInUser.isAdmin) throw new Unauthorised('User is not an admin')
```

### Front-end

Having successfully built our API and tested it through Insomnia as a team, we now focused in the font-end.

#### NavBar

* The navigation bar held a number of functions which were determined to be run using ternaries. For instance, if the user is authenticated (logged in), the nav bar needs to show Profile and Logout. And if the user is not authenticated, it renders login and register, each with an `onClick` handler that calls a function to open a modal - Login and Register.

```js
<nav>
        <ul>
          {isAuthenticated() ?
            <>
              <Link className="profile" to={`/profile/${getUserID()}`} as={Link}>Profile</Link>
              <li className="logout" onClick={handleLogOut}>Logout</li>
            </>
            :
            <>
              <li to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => openModal('login')}>Login</li>
              <li to="/" id="register" className={location.pathname === '/' ? 'active' : ''} onClick={() => openRegisterModal('register')}>Register</li>

            </>
          }
        </ul>
      </nav>
```

#### Register Modal

In the file `RegisterDialog.js`, there is the logic for the registration. Usually, it will have a separate endpoint, but we decided to use a modal instead. This means that it doesn’t have an endpoint.

* This component uses the `useState` hook to create a `registerFormFields` state variable that holds an object containing the form data for user registration (username, email, password, passwordConfirmation, and isAdmin). The `handleChangeRegister` function has been used when the user types into the form (input fields). 
* The `submitRegistration` function is called when the user submits the registration form. An API call has been made with the POST request to the server to register the user. If there is an error during registration, the error message will be shown on the screen.
* Finally the two functions `openRegisterModal()` and `closeRegisterModal()` help to open the modal and close the modal when clicked.

```js
// State for the Modal to either show or not show
const registerRef = useRef(null)
// State for Register
  const [registerFormFields, setRegisterFormFields] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isAdmin: false,
  })

function openRegisterModal() {
    registerRef.current.showModal()
  }

  function closeRegisterModal() {
    registerRef.current.close()
  }

const handleChangeRegister = (e) => {
    setRegisterFormFields({ ...registerFormFields, [e.target.name]: e.target.value })
    setError('')
  }

  const submitRegistration = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/', registerFormFields)
      closeRegisterModal()
      navigate('/') 
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }
  }
```

#### Font Awesome Icons

* React is very powerful and thanks to the in-built methods. My teammate and I did this together. We imported some icons from the website Font Awesome and installed some commands:

```js
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/react-fontawesome@latest
```

Once installed, we imported the name of the icons at the top of `DestinationSingle.js` and passed the icons in the code as a prop.

#### Add Review

* Since I looked after the addReview in the back-end, we decided that I was going to create this function in the frontend as well. A POST request has been used. If I used POST in the back-end, the same needs to be used in the front-end. An API call was made and if the token is valid the request will be successful and the review will be added.

```js
const [reviewFields, setReviewFields] = useState({
    title: '',
    text: '',
    rating: 4,
  })

const addReview = async (e) => {
    console.log('REVIEW FIELDS ->', reviewFields)
    e.preventDefault()
    try {
      await axios.post(`/api/destinations/${id}`, reviewFields,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
      const updatedReviews = [...reviews, reviewFields]
      setReviews(updatedReviews)
    } catch (err) {
      console.log('error', err)
       setError(err.response.data.message)
    }
  }
```

#### MapBox

* As a team, we decided to use an external API which is mapbox. I did this function with my teammate. When the user is on the single destination is able to see the map of the location. In order to do so, We had to register to the website, receive a token and create a function, which is inside a `try...catch` block to handle errors. The `map` constructor takes an object as its argument that specifies various options for configuring the map. Thanks to the database that we built in the backend, we were able to use the longitude and the latitude of the database, instead of using the ones from mapbox.

```js
useEffect(() => {
    const getMap = async () => {
      if (!destination) return
      try {
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNndWxsYW5kIiwiYSI6ImNsZnM1dTBsbzAzNGczcW1ocThldWt5bDkifQ.W8F3EzE7Ap170SOD3_VRDg'
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [destination.longitude, destination.latitude],
          zoom: 10,
        })
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getMap()
  }, [destination])
```

### Challenges

* One of the main challenges has been the register modal. As I mentioned previously, it doesn’t have an endpoint and it was harder than expected. The login modal was created first and at the beginning if I clicked on register, it would open the login modal. Therefore, I had to rewrite all the variables and functions and rename them and created a `registerDialog.js` file and it finally started working. Usually if you have endpoints the process is different, however this was something completely new for me and my colleagues as well. The code is a little bit messy and I had to write some functions on every file to let it work from every endpoint, but it is working.

### Wins

* Myself and the team are very proud of the design of the project. Very simple and clean, but we spent a lot of time in css, starting from the grid to all the endpoints.
* This has been the best team project so far, working during weekends and evenings as well. Everyone was helping each other, which is very important.

### Key Learnings

* The importance of designing your models and the fields correctly was a great lesson learnt. Although we tackled the backend as our first task, quite often we had to implement functions accordingly. 
* Testing is another important part while creating the functions in the back-end. 
* When working in a team, it is very important to keep each other updated and ask for help if needed. We had a standup everyday and we were on a zoom call if we were pair coding.

### Future Improvements

* It would be nice to search by destination in the filters under `destination.js`. 
* Under the `profile.js`, it would be nice to add a real picture of the user.

### Final Project

* Landing page:

![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683902057/Project_3/project-3-readme-google-docs-5_focoz1.png)

* Destination endpoint:

![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683902060/Project_3/project-3-readme-google-docs-6_qdy1pm.png)

* Destination Single endpoint:

![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683902062/Project_3/project-3-readme-google-docs-7_umoegt.png)

* Profile endpoint:

![](https://res.cloudinary.com/dtu5wu4i9/image/upload/v1683902068/Project_3/project-3-readme-google-docs-9_zmwswb.png)














