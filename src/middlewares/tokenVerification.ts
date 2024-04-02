import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

//. JWT secret key generation
const SECRET_KEY = process.env.JWT_SECRET || "@localSecret";

const prisma = new PrismaClient();

//. Declaring user inside of Request object
declare global {
    namespace Express {
        interface Request {
            user: string;
        }
    }
}

//. Handler to verify jwt token
export async function verifyToken(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers["authorization"];
    const jwtToken = authHeader?.split(" ")[1];
    if (!jwtToken) {
        return res.status(401).json({ "error": "Unauthorized" });
    }
    try {
        const payload = (await jwt.verify(jwtToken, SECRET_KEY)) as { tokenID: string };

        const dbToken = await prisma.token.findUnique({
            where: {
                id: payload.tokenID,
            },
            include: {
                user: true
            }
        })
        if (!dbToken || dbToken.expiration < new Date()) {
            return res.json({ "error": "Unauthorized" });
        }
        // res.locals.user = dbToken.user;
        req.user = dbToken.user.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ "error": "See console !" });
    }
}

export default Request