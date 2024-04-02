import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import req from "../middlewares/tokenVerification"

const router = Router();
const prisma = new PrismaClient();

//* ----------------------------------User CRUD------------------------------------
//. Create
router.post("/", async (req, res) => {
    const { email, name, username } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email: email } });
        // Handling empty variable
        if (!user) {
            const result = await prisma.user.create({
                data: {
                    email,
                    name,
                    username,
                }
            })
            res.json(result);
        }
        else {
            res.json({ "error": "Username or Email Exists !" });
        }
    } catch (error) {
        console.log(error);
        res.json({ "error": "See console" });
    }
});

//. List users
router.get("/all", async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany({
            select: {
                name: true,
                username: true,
                image: true
            }
        });
        // Handling empty variable
        if (!allUsers) {
            res.send({ "error": "Empty user collection" });
        }
        res.json(allUsers);
    } catch (error) {
        console.log(error);
    }
});

//. Get one user
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                name: true,
                username: true,
                image: true
            }
        });
        // Handling empty variable
        if (!user) {
            res.json({ "error": "Empty user collection" });
        }
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }
});

//. Update user
router.put("/", async (req, res) => {
    // const { id } = req.params;
    console.log(req.user);
    const { name, username } = req.body;
    try {
        const result = await prisma.user.update({
            where: { id: req.user },
            data: { name, username },
        })
        res.json(result);
    } catch (error) {
        res.status(400).json({ "error": `Not updated !` });
    }
});

//. Delete user
router.delete("/", async (req, res) => {
    // const { id } = req.params;
    try {
        const tweets = await prisma.tweet.findFirst({ where: { userID: req.user } });
        if (tweets) {
            await prisma.tweet.deleteMany({ where: { userID: req.user } })
        }
        await prisma.token.delete({ where: { userID: req.user } });
        await prisma.user.delete({ where: { id: req.user } });
        res.status(201).json({ "status": "Successful deletion" });
    } catch (error) {
        console.log(error);
    }
});

export default router;