import "dotenv-safe/config.js";
import jsonwebtoken from "jsonwebtoken";
import { defaultClaims, UserAuthTokenData } from "../src/lib/auth";

const [,, sub, jti, permissionsStr] = process.argv;
if (!sub) {
    console.error('missing sub');
    process.exit(1);
}
if (!jti) {
    console.error('missing jti');
    process.exit(1);
}

const iat = new Date();
const exp = new Date(iat);
exp.setFullYear(exp.getFullYear() + 1);

const permissions = (permissionsStr || '').split(',').filter(Boolean)

const payload: UserAuthTokenData = {
    iss: 'toanir-cli',
    aud: defaultClaims.aud,
    sub,
    iat: iat.getTime(),
    exp: exp.getTime(),
    permissions,
    jti,
}
console.log(payload)

const token = jsonwebtoken.sign(payload, process.env.AUTH_JWT_SECRET!);
console.log(token)
