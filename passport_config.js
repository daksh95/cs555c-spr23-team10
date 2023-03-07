import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

function initialize(passport,getuserbyemail,getuserbyid){
    const  authenticateuser = async (email,password,done) => {
        const user = getuserbyemail(email)
        if (user==null){
            return done(null,false,{message:'no user found'})
        }
        try{
            if (await bcrypt.compare(password,user.password)){
                return done(null,user)
            }
            else{
                return done(null,false,{message:'wrong password'})
            }
        }catch (e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField:'email'},
    authenticateuser))
    passport.serializeUser((user,done)=> done(null,user.id))
    passport.deserializeUser((id,done)=>{
        return done(null,getuserbyid(id))
    })
}

export default initialize