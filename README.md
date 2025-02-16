# CS5610 Project 2: Bunny Friends Forum

A basic forum application to showcase node + express + es6 modules + Mongo8 + ajax

## Author

Zhengyi Xu
[Github](https://github.com/zhengyicoding)

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

## Database:

Collection 1: bunnies, with 52 records of available JellyCat bunnies. Support read on bunnies.
Collection 2: stories, with 1,000 records of story posts on the forum. Support filter by bunny name and CRUD operations on forum posts.

## Screenshots:

### Index page: show Bunny Gallery section by default

<img width="1467" alt="image" src="https://github.com/user-attachments/assets/6f8fa3eb-ec12-43e6-aded-aacf18120fa8" />

### Click on Forum to show forum section - Create story post & filter story posts by Bunny Name

<img width="1498" alt="image" src="https://github.com/user-attachments/assets/504cc6da-7f18-4a25-ae2b-b76fb68bb308" />

### Forum Section - Update story post

<img width="1428" alt="image" src="https://github.com/user-attachments/assets/d012f9f5-4cc6-4ecf-aeb2-976e121a89e5" />

### Forum Section - Delete story post

<img width="1370" alt="image" src="https://github.com/user-attachments/assets/76806444-dfa8-4eb7-8405-e027cffb9c52" />

## Links:

[Design Document](https://github.com/zhengyicoding/bunnyfriends/blob/main/proj2_design_doc.pdf)

[Slides](https://docs.google.com/presentation/d/18rOBpBCS3tAUMyN8lWESbDy9P3ZVbvfJfD79cNXqcfg/edit?usp=sharing)

[Video Demo]

## LLM Usage

Used Claude 3.5 Sonnet for the following use cases and prompts:

### Use case: switch from local MongoDB to MongoDB Atlas

Prompt: How to set up my .env file to input MongoDB Atlas credentials? Do I need to npm install dotenv?

### Use case: frontend representation

Prompt: I want to only have 1 index page but show different contents through clicking on 2 links (1 for bunny gallery and another for forum contents) on the navigation bar, how should I set up the navigation part in my html, css and JS files?

### Use case: virtual data creation

Prompt: Please write script for make a json file consisting of 1000 records with below variables: name, story title, bunny name (chose from 52 bunny names in the attached Json file), story content.

### Use case: code refactoring

Prompt: Please help me to move the InnerHTML into a templates folder for bunny cards and forum posts (create new story form and edit form) templates. What functions should I add and how to modify existing client.js functions to use the templates?

## Approved project idea:

Project Description  
The Fluffy bunny friends forum is a community platform where Jellycat enthusiasts can share stories, experiences, and photos (tentatively) with their beloved fluffy Jellycat bunnies. Main page will show posts of users and a separate page will show a list of currently on-the-market Jellycat bunnies. CRUD operations are available on the posts.  
CRUD Operations  
Create: Users can post photos, stories and experiences with their Jellycat bunnies  
Read: Users can browse posts ordered by create date  
Update: Users can edit their posts information  
Delete: Users can remove their posts  
User Personas  
Emma (19, College Student) Emma has been collecting Jellycats since childhood and now brings them to her dorm. She uses the forum to connect with other collectors and share dorm decoration ideas.  
"I want to share photos of how I display my Jellycat collection in my small dorm space and get inspiration from others."  
Mark (35, Teacher) Mark uses Jellycats in his elementary classroom and wants to share educational activities involving plush toys.  
"I'd love to exchange ideas with other teachers about using Jellycats for storytelling and emotional learning activities."  
Sarah (28, Work-from-home Professional) Sarah photographs her Jellycats in creative scenes and wants to share her mini stories with fellow enthusiasts.  
"I create little adventure scenarios with my Jellycats during breaks and want to share these moments with people who understand."
