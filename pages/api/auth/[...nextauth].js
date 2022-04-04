import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import {handler} from "../../../middlewares/errorMiddlewares"
import { disconnect , connect  } from "../../../config/dbConn"
import {getUserByEmail} from "../../../models/users/users"
import {comparePassword} from "../../../config/security"
 
export default NextAuth({
    pages : {
      signIn : "/signin", 
    },
    callbacks: {
      async session({session, user, token}) {
        return { 
          expires: session.expires, user: {...token} }
      },
      async jwt({ token, user, account, profile, isNewUser }) { 
        return { ...token, ...user};
      }, 
    },
    providers : [
        GitHubProvider({
            clientId : process.env.GITHUB_CLIENT_ID,
            clientSecret : process.env.GITHUB_SECRET_KEY
        }),
        CredentialsProvider({
            async authorize(credentials, req) {
                await connect()
                
                const {
                  email,
                  password
                } = credentials;

              
                try{
                  const user = await getUserByEmail(email)
                   
                  if(!user) throw new Error("USER NOT Exists") // you can use it to return custom error to user
                    
                  if((await comparePassword(password , user.password))){
                      return {
                          UID : user._id,
                          userName : user.firstName + " " + user.lastName
                      }
                  }else{
                      return null  // incorrect pass
                  }
                }catch(err){
                    //res.json({err : err.message})
                    console.log(err)
                    return null
                }
              
              
            }
        })
    ]
})