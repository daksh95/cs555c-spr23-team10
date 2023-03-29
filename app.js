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
        cb(null, 'uploads/')
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

app.get("/mlogin",checknotauthenticated,(req,res)=>{
    res.render("login_manager.ejs")
})

app.post('/managerlogin', checknotauthenticated,passport.authenticate('manager',{
    successRedirect: '/manager',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/manager',checkauthenticated,(req,res)=>{
    res.render('managerindex.ejs', { name: req.user.name })
})

app.get('/', checkauthenticated, (req, res) => {
    res.render('salesindex.ejs', { name: req.user.name })
})

app.get('/saleslogin', checknotauthenticated, (req, res) => {
    res.render('login_sales.ejs')
})

app.post('/saleslogin', checknotauthenticated,passport.authenticate('sales',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

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
    let projectslist = await projectsgetter()
    res.json(projectslist)
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
        return res.redirect('/saleslogin')
    }
    if (req.user.type === "engineer") {
        req.logOut(
            function (err) {
                if (err) {
                    return next(err);
                }
            })
        return res.redirect('/englogin')} 
    if (req.user.type === "manager") {
        req.logOut(
            function (err) {
                if (err) {
                    return next(err);
                }
            })
        return res.redirect('/mlogin')} 
})

app.post('/getproject', checkauthenticated, async (req, res) => {
    let d = await get_project(req.body.id)
    const user = users.find(user => user._id.toString() === d.customer)
    d.customerName = user.name;
    d.customerEmail = user.email
    d.phone = user.phone
    d.images = user.images
    res.render('view_project.ejs', d)
})

app.post('/getprojecteng', checkauthenticated, async (req, res) => {
    let d = await get_project(req.body.id)
    const user = users.find(user => user._id.toString() === d.customer)
    d.customerName = user.name;
    d.customerEmail = user.email
    d.phone = user.phone
    res.render('view_project_eng.ejs', d)
})

app.get("/newproject", checkauthenticated, (req, res) => {
    res.render("new_project.ejs")
})

app.post('/createproject', checkauthenticated, async (req, res) => {
    console.log(req.body)
    let success = await create_project(req.body)
    res.redirect("/");
})

app.post('/deleteproject', checkauthenticated, async (req, res) => {
    let s = await delete_project(req.body.id)
    res.redirect("/")
})

app.post('/pnamechange', checkauthenticated, async (req, res) => {
    let a = await namechange(req.body.id,req.body.name)
    if (a !== null){
        res.redirect("/")
    }
})

app.post('/pstatuschange', checkauthenticated, async (req, res) => {
    let a = await statuschange(req.body.id,req.body.status)
    if (a !== null){
        res.redirect("/")
    }
})

app.post('/pdescriptionchange', checkauthenticated, async (req, res) => {
    let a = await descriptionchange(req.body.id,req.body.description)
    if (a !== null){
        res.redirect("/")
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
        res.redirect()
    }
})

app.get('/eng',checkauthenticated,(req,res)=>{
    res.render('engindex.ejs',{ name: req.user.name })
})

app.get('/englogin',checknotauthenticated,(req,res)=>{
    res.render('login_eng.ejs')
})

app.post('/englogin', checknotauthenticated,passport.authenticate('eng',{
    successRedirect: '/eng',
    failureRedirect: '/englogin',
    failureFlash: true
}))

function checkauthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    if (req.user.type === "sales") {return res.redirect('/saleslogin')}
    if (req.user.type === "engineer") {return res.redirect('/englogin')} 
}
function checknotauthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.type === "sales") {return res.redirect('/')}
        if (req.user.type === "engineer") {return res.redirect('/eng')} 
    }
    next()
}

app.listen(6969)