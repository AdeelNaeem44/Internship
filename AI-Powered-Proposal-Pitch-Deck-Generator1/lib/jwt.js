import { SignJWT, jwtVerify } from "jose";


const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = "HS256";


export async function signJwt(payload, expiresIn = "7d") {
return await new SignJWT(payload).setProtectedHeader({ alg }).setIssuedAt().setExpirationTime(expiresIn).sign(secret);
}


export async function verifyJwt(token) {
try {
const { payload } = await jwtVerify(token, secret, { algorithms: [alg] });
return payload;
} catch (e) {
return null;
}
}