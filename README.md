# Capstone 2 Demo App Overview

### Application Name: Demo-App

#### Overview

> This is an Express.js API for managing an E-Commerce platform. It provides endpoints for user authentication, user management, product management, and more.

#### Getting Started
> To get started with the API, follow these steps:

1. **Clone the repository:**
git clone https://git.zuitt.co/B390/csp2-b390-lucot-lim.git

2. **Install dependencies:**
> Navigate to the project directory and install the necessary dependencies using npm install

***Dependencies:***
* Express.js
* Mongoose
* JWTwebtoken
* Bcrypt


### Team Members:

- Jason Jay Lucot
- Jojo Lim

### User Credentials:

* Admin User
    - Email: admin@mail.com
    - Password: admin1234

* Dummy Customer:
    - Email: user@mail.com
    - Password: user1234


### Features by Jojo

***Data Models***

    1. Cart
    2. Order

***User Resources***

    1. Retrieve user profile (Authenticated User)
    2. Set as admin (Admin Only)
    3. Update user's password (Authenticated User)

***Product Resources***

    1. Update Product Info (Admin Only)
    2. Archive product (Admin Only)
    3. Activate product (Admin Only)
    4. Search product by name
    5. Search product by price range

***Cart Resources***

    1. Clear user's cart (Authenticated User)
    2. Remove item from cart (Authenticated User)

***Order Resources***

    1. Retrieve user's orders (Authenticated User)
    2. Retrieve all orders (Admin Only)


### Features by Jason

***Data Models***

    1. User
    2. Product
    3. Category

***User Resources***

    1. User Registration
    2. User Authentication

***Product Resources***

    1. Create Product (Admin Only)
    2. Retrieve all products (Admin Only)
    3. Retrieve all active products 
    4. Retrieve single product

***Cart Resources***

    1. Retrieve user's cart (Authenticated User)
    2. Add to cart (Authenticated User)
    3. Update product's quantity in user's cart (Authenticated User)

***Order Resources***

    1. Create Order (Authenticated User)



### Additional Features

**Category Management**: 
> Admin users can add and update categories. All users, regardless of their level, can view all categories and filter products by category.

#### Schema

* name - category name
* description - category description

#### Endpoints
* Add category (Admin only) - /products/add-category
* Update category (Admin only) - /products/:categoryId/update-category
* Get all category - products/get-all-category
* Filter by category - products/:categoryId/filter-by-category



**Address Management for Users:**
> Users will be able to add multiple addresses and set a default address.

#### Schema

* street - string
* city - string
* province - string
* country - string
* postalCode - string
* isDefault - boolean
* pinLocation - *currently set to a default value of (0,0) for future reference of pin location feature no need to include in adding address*

#### Endpoints

* Add address (Authenticated Users) - users/add-address
    * If there's no default address yet, the new address will be set to default
* Update specific address - users/:addressId/update-address
* Delete address - users/:addressId/delete-address
    *  Address cannot be deleted if only one address has left
    *  If the address deleted is the default, set the next address to default address
* Set default address - users/:addressId/set-default-address
    *  Only one address can be set to default

**Review feature for product:**
> Users or Customers who availed the product can now rate and leave reviews. Reviews of products will be visible to all users.

#### Schema

* rating - number (min: 1 , max: 5)
* remarks - string
* createdBy - (fetched via login jwt token)
* createOn - Date

#### Endpoints

* Add review - orders/:productId/create-review
    * checks if the user ordered the product
    * checks if theres already an existing review for the user on that product



