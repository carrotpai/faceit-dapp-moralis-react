import NextAuth from "next-auth"
import FaceItProvider from "next-auth/providers/faceit";
import jwt from "jsonwebtoken"

export default NextAuth({
    providers: [
        FaceItProvider({
            clientId: process.env.FACEIT_CLIENT_ID,
            clientSecret: process.env.FACEIT_CLIENT_SECRET,
            checks: "both",
            token: {
                url: "https://api.faceit.com/auth/v1/oauth/token",
                request: async params => {
                    const { token } = params.provider;
                    const { code } = params.params;
                    const endpointUrl = typeof token === 'string' ? token : token?.url;
                    if (!endpointUrl) {
                        throw new Error('Token url not provided');
                    }
                    const url = new URL(endpointUrl);
                    const queryParams = new URLSearchParams({ code, grant_type: 'authorization_code' });
                    url.search = `?${queryParams}`;
                    const apiResponse = await fetch(url.toString(), { method: 'POST', headers: params.provider.headers })
                        .then(res => res.json());

                    return {
                        tokens: {
                            access_token: apiResponse.access_token,
                        }
                    }
                }
            },

            profile(profile) {
                return {
                    id: profile.guid,
                    name: profile.nickname,
                    email: profile.email,
                    image: profile.picture,
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, token, user }) {
            const encodedToken = jwt.sign(token, process.env.JWT_SECRET, { algorithm: 'HS256' });
            session.id = token.id;
            session.token = encodedToken;
            return Promise.resolve(session);
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
    jwt: {
        encode: async ({ secret, token, maxAge }) => {
            console.log("in encoding");
            const jwtClaims = {
                "sub": token.sub,
                "name": token.nickname,
                "iat": Date.now() / 1000,
                "exp": Math.floor(Date.now() / 1000) + (24 * 60 * 60)
            };
            const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256' });
            return encodedToken;
        },

        decode: async ({ secret, token, maxAge }) => {
            const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
            return decodedToken;
        }
    },
    secret: process.env.JWT_SECRET,
})