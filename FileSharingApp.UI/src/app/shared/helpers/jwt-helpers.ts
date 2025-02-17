import { JwtPayload, jwtDecode } from "jwt-decode";

export function tokenHasExpired(token: string): boolean {
    const decodedToken: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return !decodedToken.exp || decodedToken.exp < currentTime;
}
