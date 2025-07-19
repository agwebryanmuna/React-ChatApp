import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const seedDb = async () => {
    console.log('Seeding database...')
   try {
        await mongoose.connect(mongo_uri_string);
        for(const {fullName, password, bio, email} of MOCK_USER_DATA) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const getImg = await fetch('https://randomuser.me/api/')
            const userData = await getImg.json();
            const img = userData['results'][0]['picture']['large'];
            
            
            const newUser = await User.create({
                fullName,
                email,
                password: hashedPassword,
                bio,
                profilePic: img
            });
            
            console.log(newUser)
        }
       
       const users = await User.find({});
       console.log(users)
       
       console.log('Database seeded successfully')
       
   } catch (error) {
       console.error('Something went wrong: ', error);
   }
}

seedDb();

const MOCK_USER_DATA = [
    {
        "fullName": "Olivia Bennett",
        "password": "oliviabennett12345678",
        "email": "olivia.bennett@example.com",
        "bio": "Travel enthusiast and freelance photographer based in Seattle."
    },
    {
        "fullName": "Liam Torres",
        "password": "liamtorres12345678",
        "email": "liam.torres@example.com",
        "bio": "Full-stack developer who loves building with React and Node.js."
    },
    {
        "fullName": "Emma Chen",
        "password": "emmachen12345678",
        "email": "emma.chen@example.com",
        "bio": "Digital artist and illustrator inspired by nature and mythology."
    },
    {
        "fullName": "Noah Patel",
        "password": "noahpatel12345678",
        "email": "noah.patel@example.com",
        "bio": "Fitness coach and nutrition blogger helping people live healthier lives."
    },
    {
        "fullName": "Ava Johnson",
        "password": "avajohnson12345678",
        "email": "ava.johnson@example.com",
        "bio": "Marketing specialist passionate about brand storytelling and content creation."
    },
    {
        "fullName": "William Lee",
        "password": "williamlee12345678",
        "email": "william.lee@example.com",
        "bio": "Cybersecurity analyst by day, gamer and sci-fi nerd by night."
    },
    {
        "fullName": "Sophia Nguyen",
        "password": "sophianguyen12345678",
        "email": "sophia.nguyen@example.com",
        "bio": "Product designer with a love for minimalism and user experience."
    },
    {
        "fullName": "James Rivera",
        "password": "jamesrivera12345678",
        "email": "james.rivera@example.com",
        "bio": "Aspiring filmmaker and part-time barista living in Austin."
    },
    {
        "fullName": "Mia Anderson",
        "password": "miaanderson12345678",
        "email": "mia.anderson@example.com",
        "bio": "Educator and podcast host exploring learning and creativity."
    },
    {
        "fullName": "Ethan Kim",
        "password": "ethankim12345678",
        "email": "ethan.kim@example.com",
        "bio": "Entrepreneur focused on tech startups and community building."
    }
]
