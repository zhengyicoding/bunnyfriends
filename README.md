# CS5610 Project 2: Bunny Friends Forum

A basic forum application to showcase node + express + es6 modules + Mongo8 + ajax

## Author

Zhengyi Xu
[Github] (https://github.com/zhengyicoding)

## Class Link

CS5610 Web Development [Course Page](https://johnguerra.co/classes/webDevelopment_spring_2025/)

Instructor: John Alexis Guerra Gómez [Profile](https://johnguerra.co/)

## Instruction to build

### Option 1: Live Demo

[Bunny Friends Forum](https://bunnyfriends.vercel.app/)

### Option 2: Run locally

#### Step 1

Git clone this repository to your local repository.

#### Step 2

`cd` into this repository and run `npm install`.

#### Step 3

Update the contents of `.env.example` file into your MongoDB Atlas credentials and save it as `.env`.
If using MongoDB locally instead of MongoDB Atlas, use mongodb://localhost:27017 as MONGODB_URI.

#### Step 4

Run `node ./db/seeder.js` to import data into your database.

#### Step 5

Run `npm start` or run `npm run dev` for developer mode to start your local server.
Open your browser and input `http://localhost:3000/` and the webpage should show.
You can click on "Bunny Gallery" to see collections of Jellycat Bunnies and on "Forum" to browse user stories in there and create/edit/delete your own story.
Currently there is no user authentication and authorisation mechanism in place so any user can edit/delete any story posts, which is is an important area of improvement to be done in the future.

## Screenshots:

### Index page: show Bunny Gallery section by default

<img width="1467" alt="image" src="https://github.com/user-attachments/assets/6f8fa3eb-ec12-43e6-aded-aacf18120fa8" />


### Click on Forum to show forum section - Create story post & filter story posts by Bunny Name

<img width="1498" alt="image" src="https://github.com/user-attachments/assets/504cc6da-7f18-4a25-ae2b-b76fb68bb308" />


### Forum Section - Update story post

<img width="1428" alt="image" src="https://github.com/user-attachments/assets/d012f9f5-4cc6-4ecf-aeb2-976e121a89e5" />

### Forum Section - Delete story post

<img width="1370" alt="image" src="https://github.com/user-attachments/assets/76806444-dfa8-4eb7-8405-e027cffb9c52" />

## LLM Usage

Used Claude 3.5 Sonnet for the following use cases and prompts:

### Use case: switch from local MongoDB to MongoDB Atlas

Prompt: How to set up my .env file to input MongoDB Atlas credentials? Do I need to npm install dotenv?

### Use case: frontend representation

Prompt: I want to only have 1 index page but show different contents through clicking on 2 links (1 for bunny gallery and another for forum contents) on the navigation bar, how should I set up the navigation part in my html, css and JS files?

Prompt: I 