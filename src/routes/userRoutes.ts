import { Router } from "express";
import { PrismaClient } from "@prisma/client";

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
        res.json({"error": "See console"});
    }
});

//. List users
router.get("/all", async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
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
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, username } = req.body;
    try {
        const result = await prisma.user.update({
            where: { id: id },
            data: { name, username },
        })
        res.json(result);
    } catch (error) {
        res.status(400).json({ "error": `Not updated : ${id}` });
    }
});

//. Delete user
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id : id } });
        res.status(201).send("Succesfull deletion");
    } catch (error) {
        console.log(error);
    }
});
export default router;