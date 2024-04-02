import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import req from "../middlewares/tokenVerification"

const router = Router();
const prisma = new PrismaClient();

//* --------------------------Tweet CRUD Operations------------------------------
//. Create Tweet
router.post("/", async (req, res) => {
    const { content } = req.body;
    if (!req.user) {
        return res.status(401).json({ "error": "Unauthorized" });
    }
    const once = req.user;
    try {
        const newTweet = await prisma.tweet.create({
            data: {
                content,
                userID: once
            }
        })
        res.json(newTweet);
    } catch (error) {
        console.log(error);
        res.json({ "error": "Something bad happened !" });
    }
});

//. List Tweets of a user
router.get("/user/all", async (req, res) => {
    try {
        // We can also include user object(or only some information) from whom the tweet is related 
        // (with userID and tweet relation defined in schema)
        if (!req.user) {
            return res.status(401).json({ "error": "Unauthorized" });
        }
        const alltweets = await prisma.tweet.findMany({
            where: {
                userID: req.user
            },
            include: {
                user: {
                    select: {
                        username: true,
                        image: true
                    }
                }
            }
        });
        res.json(alltweets);
    } catch (error) {
        console.log(error);
        res.json({ "error": error });
    }
});

//. Get all tweets
router.get("/all", async (req, res) => {
    try {
        // We can also include user object(or only some information) from whom the tweet is related 
        // (with userID and tweet relation defined in schema)
        const alltweets = await prisma.tweet.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        image: true
                    }
                }
            }
        });
        res.json(alltweets);
    } catch (error) {
        console.log(error);
        res.json({ "error": error });
    }
});

//. Get one Tweet
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const tweet = await prisma.tweet.findUnique({ where: { id: id } });
        if (!tweet) res.send("No such tweet exist");
        else res.json(tweet);
    } catch (error) {
        console.log(error);
        res.json({ "error": "Something bad happened !" });
    }
});

//. Update Tweet
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!req.user) {
        return res.status(401).json({ "error": "Unauthorized" });
    }
    try {
        const checkID = await prisma.tweet.findUnique({
            where: {
                id,
                userID: req.user
            }
        })
        if (checkID) {
            const updateTweet = await prisma.tweet.update({
                where: { id },
                data: { content }
            })
            res.json(updateTweet);
        }
        res.json({ "error": "You are not allowed to update" })
    } catch (error) {
        console.log(error);
        res.json({ "error": "Something bad happened !" });
    }
});

//. Delete Tweet
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!req.user) {
        return res.status(401).json({ "error": "Unauthorized" });
    }
    try {
        const checkID = await prisma.tweet.findUnique({
            where: {
                id,
                userID: req.user
            }
        })
        if (checkID) {
            await prisma.tweet.delete({ where: { id: id } });
            res.send("Successful deletion");
        }
        res.json({ "json": "You are not allowed !" });
    } catch (error) {
        console.log(error);
        res.json({ "error": "Something bad happened !" });
    }
});

export default router;