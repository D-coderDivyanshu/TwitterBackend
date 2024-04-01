import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

//. For email services
import { sendOTP } from "../Services/sendMail"

const router = Router();
const prisma = new PrismaClient();

//. Environment Variables
const EMAIL_TOKEN_EXP_MINUTES = 10;
const API_TOKEN_EXP_HOURS = 12;
const SECRET_KEY = process.env.JWT_SECRET || "@localSecret";

//. Function to generate email token (string)
function genEmailToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//. Function to generate authToken 
function genAuthToken(tokenID: string): string {
    const jwtPayload = { tokenID };
    return jwt.sign(jwtPayload, SECRET_KEY, { algorithm: "HS256", noTimestamp: true });
}

//. Create user if it does'nt exist
//. Generate email token for first time sign up/login
router.post("/signup", async (req, res) => {
    const { email, username } = req.body;
    const emailToken = genEmailToken();

    /// generating expiration period
    const expiration = new Date(
        new Date().getTime() + EMAIL_TOKEN_EXP_MINUTES * 60 * 1000
    )

    try {
        await prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email, username }
                    }
                }
            }
        })

        /// Mailing the emailToken to the user
        sendOTP(email, emailToken);

        res.json({ "Status": "An OTP is sent to your email" });
    } catch (error) {
        console.log(error);
        res.json({ "error": "See console !" });
    }
})

//. Validate email token
//. Generate long-lived JWT token
router.post("/login", async (req, res) => {
    let { email, emailToken } = req.body;

    try {
        const dbEmailToken = await prisma.token.findUnique({
            where: {
                emailToken
            },
            include: {
                user: true
            }
        })

        /// Some checkups: All these checks give us only original (owner) user
        if (!dbEmailToken || !dbEmailToken.valid) {
            return res.status(401).json({ "error": "Unauthorized !" });
        }

        else if (dbEmailToken.expiration < new Date(new Date().getTime())) {
            return res.status(401).json({ "error": "Unauthorized !" });
        }

        if (dbEmailToken.user.email != email) {
            return res.status(401).json({ "error": "Unauthorized !" });
        }

        /// Making the email token invalid 
        await prisma.token.delete({
            where: {
                emailToken
            },
        })

        /// Expiration for api token in hours
        const expiration = new Date(
            new Date().getTime() + API_TOKEN_EXP_HOURS * 3600 * 1000
        )

        /// Generation of api token
        const apiToken = await prisma.token.create({
            data: {
                type: "API",
                expiration,
                user: {
                    connect: {
                        email,
                    }
                }
            }
        })

        /// generating access token 
        const accessToken = genAuthToken(apiToken.id);

        /// updating the email
        await prisma.token.update(
            {
                where: {
                    id: apiToken.id
                },
                data: {
                    emailToken: accessToken
                }
            }
        )

        /// updating user verification flag of the user
        await prisma.user.update({
            where: {
                id: apiToken.userID
            },
            data: {
                isVerified: true
            }
        })

        res.status(200).json({ "Access-Token": accessToken });
    } catch (error) {
        console.log(error);
        res.json({ "error": "See console !" });
    }
})

export default router
