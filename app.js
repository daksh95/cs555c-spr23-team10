// Importing Dependencies 
import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import multer from 'multer';
import flash from 'express-flash';
import session from 'express-session';
import methodoverride from 'method-override';
import initializepassport from './passport_config.js';
import users from './data_handler/users.js';
import add_user from './data_handler/create_user.js';
import projectsgetter from './data_handler/projects.js'
import get_project from './data_handler/get_p.js';
import create_project from './data_handler/create_p.js';
import delete_project from './data_handler/delete_p.js';
import namechange from './data_handler/changen_p.js';
import statuschange from './data_handler/changes_p.js';
import descriptionchange from './data_handler/changed_p.js';
import uploadpictures from './data_handler/upload_picture.js';


dotenv.config();

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
    }
});

const multerFilter = (req, file, cb) => {
    const fileTypes = ['jpg', 'jpeg', 'png'];
    const currFiletype = file.mimetype.split('/')[1];
    if (fileTypes.includes(currFiletype)) cb(null, true);
    else cb(new Error('Please upload only a JPG or PNG file'), false);
};

const app = express();
const upload = multer( {storage: multerStorage, fileFilter: multerFilter });

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(methodoverride('_method'));
app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

initializepassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// landing end point
app.get('/',checknotauthenticated,(req,res)=>{
    res.render("landing.ejs")
})

// Login end points
app.get("/login",checknotauthenticated,(req,res)=>{
    res.render("login_customer.ejs")
})

app.get("/mlogin",checknotauthenticated,(req,res)=>{
    res.render("login_manager.ejs")
})

app.get('/saleslogin', checknotauthenticated, (req, res) => {
    res.render('login_sales.ejs')
})

app.get('/englogin',checknotauthenticated,(req,res)=>{
    res.render('login_eng.ejs')
})

// Login post end points
app.post('/login', checknotauthenticated,passport.authenticate('customer',{
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/managerlogin', checknotauthenticated,passport.authenticate('manager',{
    successRedirect: '/home',
    failureRedirect: '/mlogin',
    failureFlash: true
}))

app.post('/saleslogin', checknotauthenticated,passport.authenticate('sales',{
    successRedirect: '/home',
    failureRedirect: '/saleslogin',
    failureFlash: true
}))

app.post('/englogin', checknotauthenticated,passport.authenticate('eng',{
    successRedirect: '/home',
    failureRedirect: '/englogin',
    failureFlash: true
}))

// success redirect 
app.get('/home',checkauthenticated,(req,res)=>{
    if (req.user.type === "customer") {
        return res.render('customerindex.ejs', { name: req.user.name })
    }  
    if (req.user.type === "manager"){
        return res.render('managerindex.ejs', { name: req.user.name })
    }
    if (req.user.type === "sales"){
        return res.render('salesindex.ejs', { name: req.user.name })
    }
    if (req.user.type === "engineer"){
    res.render('engindex.ejs',{ name: req.user.name })
    }
})

app.get('/register', checknotauthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checknotauthenticated, async (req, res) => {
    try {
        const hasedpassword = await bcrypt.hash(req.body.password, 10)
        const user_obj = {
            id: Math.random() * 100,
            name: req.body.name,
            email: req.body.email,
            password: hasedpassword,
            type: req.body.user_type
        };
        await add_user(user_obj);
        res.redirect("/login")
    }
    catch {
        res.redirect("/register")
        console.log("error while hashing")
    }
})

app.get('/projects', checkauthenticated, async (req, res) => {
    if(req.user.type === "customer"){
        const c = req.user._id.toString()
        let projectslist = await projectsgetter()
        const data = projectslist.filter(project =>{
            return project.customer === c
        })
        res.json(data)    
    }
    else{
        let projectslist = await projectsgetter()
        res.json(projectslist)
    }
});

app.get('/customers', checkauthenticated, async (req, res) => {
    let customerList = users.filter(user => user.type === 'customer');
    res.json(customerList);
})

app.delete('/logout', (req, res) => {
    if (req.user.type === "sales") {
        req.logOut(
            function (err) {
                if (err) {
                    return next(err);
                }
            })
        return res.redirect('/')
    }
    if (req.user.type === "engineer") {
        req.logOut(
            function (err) {
                if (err) {
                    return next(err);
                }
            })
        return res.redirect('/')} 
    if (req.user.type === "manager") {
        req.logOut(
            function (err) {
                if (err) {
                    return next(err);
                }
            })
        return res.redirect('/')} 
        if (req.user.type === "customer") {
            req.logOut(
                function (err) {
                    if (err) {
                        return next(err);
                    }
                })
            return res.redirect('/')} 
})

app.post('/getproject', checkauthenticated, async (req, res) => {
    let d = await get_project(req.body.id)
    const user = users.find(user => user._id.toString() === d.customer)
    d.customerName = user.name;
    d.customerEmail = user.email
    d.phone = user.phone
    if (!d.hasOwnProperty("images")) d.images = false;
    res.render('view_project.ejs', d)
})

app.post('/getprojecteng', checkauthenticated, async (req, res) => {
    let d = await get_project(req.body.id)
    const user = users.find(user => user._id.toString() === d.customer)
    d.customerName = user.name;
    d.customerEmail = user.email
    d.phone = user.phone
    if (!d.hasOwnProperty("images")) d.images = false;
    res.render('view_project_eng.ejs', d)
})

app.post('/getprojectcus', checkauthenticated, async (req, res) => {
    let d = await get_project(req.body.id)
    const user = users.find(user => user._id.toString() === d.customer)
    d.customerName = user.name;
    d.customerEmail = user.email
    d.phone = user.phone
    if (!d.hasOwnProperty("images")) d.images = false;
    res.render('view_project_customer.ejs', d)
})

app.get("/newproject", checkauthenticated, (req, res) => {
    res.render("new_project.ejs")
})

app.post('/createproject', checkauthenticated, async (req, res) => {
    console.log(req.body)
    let success = await create_project(req.body)
    res.redirect("/dashboard");
})

app.post('/deleteproject', checkauthenticated, async (req, res) => {
    let s = await delete_project(req.body.id)
    res.redirect("/dashboard")
})

app.post('/pnamechange', checkauthenticated, async (req, res) => {
    let a = await namechange(req.body.id,req.body.name)
    if (a !== null){
        res.redirect("/dashboard")
    }
})

app.post('/pstatuschange', checkauthenticated, async (req, res) => {
    let a = await statuschange(req.body.id,req.body.status)
    if (a !== null){
        res.redirect("/dashboard")
    }
})

app.post('/pdescriptionchange', checkauthenticated, async (req, res) => {
    let a = await descriptionchange(req.body.id,req.body.description)
    if (a !== null){
        res.redirect("/dashboard")
    }
})

app.post('/pdescriptionchangeeng', checkauthenticated, async (req, res) => {
    let a = await descriptionchange(req.body.id,req.body.description)
    if (a !== null){
        res.redirect("/eng")
    }
})

app.post('/uploadpictures', checkauthenticated, upload.array('projectUpdate'), async (req, res) => {
    const fileArr = req.files.map((file) => file.path);
    const projectId = req.body.projectid;
    let a = await uploadpictures(projectId, fileArr);
    if (a !== null) {
        res.redirect("/home")
    }
})

function checkauthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')
}

function checknotauthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home')
    }
    next()
}

app.listen(6969)