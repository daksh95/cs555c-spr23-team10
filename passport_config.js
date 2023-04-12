import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

function initialize(passport,getuserbyemail,getuserbyid){
    const salesauthenticateuser = async (email,password,done) => {
        const user = getuserbyemail(email)
        if (user==null){
            return done(null,false,{message:'no user found'})
        }
        try{
            if (await bcrypt.compare(password,user.password)){
                if (user.type === "sales"){
                    return done(null,user)
                }
                return done(null,false,{message:'cannot authenticate'})
            }
            else{
                return done(null,false,{message:'wrong password'})
            }
        }catch (e){
            return done(e)
        }
    }
    const engauthenticateuser = async (email,password,done) => {
        const user = getuserbyemail(email)
        if (user==null){
            return done(null,false,{message:'no user found'})
        }
        try{
            if (await bcrypt.compare(password,user.password)){
                if (user.type === "engineer"){
                    return done(null,user)
                }
                return done(null,false,{message:'cannot authenticate'})
            }
            else{
                return done(null,false,{message:'wrong password'})
            }
        }catch (e){
            return done(e)
        }
    }
    const mauthenticateuser = async (email,password,done) => {
        const user = getuserbyemail(email)
        if (user==null){
            return done(null,false,{message:'no user found'})
        }
        try{
            if (await bcrypt.compare(password,user.password)){
                if (user.type === "manager"){
                    return done(null,user)
                }
                return done(null,false,{message:'cannot authenticate'})
            }
            else{
                return done(null,false,{message:'wrong password'})
            }
        }catch (e){
            return done(e)
        }
    }
    const cusauthenticateuser = async (email,password,done) => {
        const user = getuserbyemail(email)
        if (user==null){
            return done(null,false,{message:'no user found'})
        }
        try{
            if (await bcrypt.compare(password,user.password)){
                if (user.type === "customer"){
                    return done(null,user)
                }
                return done(null,false,{message:'cannot authenticate'})
            }
            else{
                return done(null,false,{message:'wrong password'})
            }
        }catch (e){
            return done(e)
        }
    }
    passport.use('sales',new LocalStrategy({usernameField:'email'},
    salesauthenticateuser))
    passport.use('customer',new LocalStrategy({usernameField:'email'},
    cusauthenticateuser))
    passport.use('eng',new LocalStrategy({usernameField:'email'},
    engauthenticateuser))
    passport.use('manager',new LocalStrategy({usernameField:'email'},
    mauthenticateuser))
    passport.serializeUser((user,done)=> done(null,user.id))
    passport.deserializeUser((id,done)=>{
        return done(null,getuserbyid(id))
    })
}

export default initialize