const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const bcrypt = require("bcrypt");
const _ = require("lodash");
require("dotenv").config();
// Payments disabled in demo mode.
const path = require('path');
const passport = require('passport');
const session = require('express-session');


const aiRoutes = require('./routes/aiRoutes');
const router = express.Router();

var t = 0;
app.use(express.json());
app.use('/api/ai', aiRoutes);

// Database connection removed for the public demo.

app.use(express.static(path.join(__dirname, 'views')));
// Set view engine as EJS
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'Views'));
app.use('/form', express.static(__dirname + '/index.html'));

app.get("/", function(req, res) {
    res.render("home");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET || 'local-dev-only-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
}));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', mode: 'demo' }));

const storeItems = new Map([
    [1,{price:1875,name:"Flight Offsets"}],
    [2,{price:10000,name:"Food and Drink Offsets"}],
    [3,{price:12500,name:"Home Energy Offsets"}],
    [4,{price:7500,name:"Vehicle Offsets"}],
    [5,{price:15000,name:"Total House Footprint"}],
    [6,{price:1875,name:"Individual"}],
    [7,{price:2500,name:"Couple"}],
    [8,{price:3750,name:"Small Family"}],
    [9,{price:6250,name:"Big Family"}],
    
])




// Account routes require storage and are intentionally disabled in the demo.
app.get(['/signup', '/login'], (req, res) => res.redirect(302, '/calculator'));
app.post(['/signup', '/login'], (req, res) => res.redirect(303, '/calculator'));
app.post('/', (req, res) => res.redirect('/'));

app.get("/about",function(req,res)
{
    res.render("about");
});

app.get("/why",function(req,res)
{
    res.render("why");
});

app.get("/sendEmail",function(req,res)
{
    res.render("sendEmail");
});

app.get("/industry-calculator",function(req,res)
{
    res.render("industry-calculator");
});
app.post("/industry-calculator",function(req,res){
    console.log(req.body);
    var companyName= req.body.companyName;
    var employees= req.body.employ;
    var sector = req.body.sector;
    var footprintI;

    if(sector==='1' && employees>50000)
    {
      footprintI=12 *Math.pow(10,6);
    }
    else if(sector==='1'&& employees>=1000 && employees<=50000)
    {
        footprintI= 0.8 *Math.pow(10,6);
    }
    else if(sector==='1' && employees<1000)
    {
        footprintI=0.2 *Math.pow(10,6);
    }

    if(sector==='2' && employees>70000)
    {
      footprintI=2.5*Math.pow(10,6);
    }
    else if(sector==='2'&& employees>=1000 && employees<=70000)
    {
        footprintI=0.6*Math.pow(10,6);
    }
    else if(sector==='2' && employees<1000)
    {
        footprintI=0.040*Math.pow(10,6);;
    }

    if(sector==='3' && employees>100000)
    {
      footprintI=35*Math.pow(10,6);
    }
    else if(sector==='3'&& employees>=1000 && employees<=100000)
    {
        footprintI= 3*Math.pow(10,6);
    }
    else if(sector==='3' && employees<1000)
    {
        footprintI=0.25*Math.pow(10,6);
    }
    
    if(sector==='4' && employees>65000)
    {
      footprintI=4*Math.pow(10,6);
    }
    else if(sector==='4'&& employees>=1000 && employees<=65000)
    {
        footprintI= 5*Math.pow(10,6);
    }
    else if(sector==='4' && employees<1000)
    {
        footprintI=1*Math.pow(10,6);
    }
   
    if(sector==='5' && employees>90000)
    {
      footprintI=3.5*Math.pow(10,6);
    }
    else if(sector==='5'&& employees>=1000 && employees<=90000)
    {
        footprintI= 0.7*Math.pow(10,6);
    }
    else if(sector==='5' && employees<1000)
    {
        footprintI=0.1*Math.pow(10,6);
    }
    var areaI= footprintI/2.75;
    areaI= Math.round(areaI);
    console.log(areaI)

    res.render("result-industry",{footprintI:footprintI,areaI:areaI})

    

});


app.post('/create-checkout-session', (req, res) => res.status(503).json({ error: 'Payments are disabled in demo mode.' }));

app.get("/faq",function(req,res)
{
    const faqItems = [
        {
            question: "How does your service work?",
            answer: "We calculate your carbon footprint based on your lifestyle or business operations. Then, we offer personalized offset plans that involve tree planting through reputable organizations and facilitating renewable energy connections."
        },
        {
            question: "What are the different subscription plans?",
            answer: "We offer various subscription plans tailored to different carbon footprints and budgets. You can choose a plan that best suits your needs."
        },
        {
            question: "How do you calculate my carbon footprint?",
            answer: "We use a comprehensive methodology that considers factors like transportation, energy consumption, and waste generation. You can also use our online calculator for a quick estimate."
        },
        {
            question: "What types of trees do you plant?",
            answer: "We partner with reputable organizations like Green Yatra that plant native species suitable for the local environment and ensure long-term maintenance."
        },
        {
            question: "How can I be sure the trees survive?",
            answer: "We work with organizations with proven track records in tree planting and survival rates which have already planted crores of trees across the country."
        },
        {
            question: "What are the benefits of renewable energy connections?",
            answer: "By supporting renewable energy projects, you directly contribute to reducing reliance on fossil fuels and promoting a cleaner energy grid. The best part is that it costs less as well."
        },
        {
            question: "How much does it cost to offset my carbon footprint?",
            answer: "The cost depends on your carbon footprint and the chosen subscription plan. We offer transparent pricing and information on the impact of your contribution."
        },
        {
            question: "Are there any tax benefits for carbon offsetting?",
            answer: "Tax benefits for carbon offsetting may vary depending on your location. We recommend consulting a tax professional for specific advice."
        },
        {
            question: "How can I be sure your offsetting solutions are legitimate?",
            answer: "We prioritize partnerships with reputable organizations with proven certifications and transparent project details. You can access detailed information about our partners and the impact of your contribution through our platform."
        }
    ];

    res.render('faq', { faqItems: faqItems });
});

module.exports = router;

app.get("/calculator",function(req,res)
{
    res.render("calculator");
});
app.post("/calculator", async function(req, res) {
    try {
        var numpeople = parseFloat(req.body.numpeople) || 1;
        if (numpeople <= 0) numpeople = 1;

        var electricity = parseFloat(req.body.electricity) || 0;
        var cylinders = parseFloat(req.body.cylinders) || 0;
        var flights = parseFloat(req.body.flights) || 0;
        var vehicle = parseFloat(req.body.vehicle) || 0;
        var mileage = parseFloat(req.body.mileage) || 15;
        if (mileage <= 0) mileage = 15;
        var bus = parseFloat(req.body.bus) || 0;
        var train = parseFloat(req.body.train) || 0;
        
        var electricityprint = (electricity * 0.82) / numpeople;
        var cylinderprint = (cylinders * 23.5) / numpeople;
        var petrol = vehicle / mileage;
        var petrolprint = (petrol * 2.3) / numpeople;
        var flightprint = (flights * 242) / numpeople;
        var busprint = (bus * 0.1) / numpeople;
        var trainprint = (train * 0.27) / numpeople;
        
        var foodprint = 0;
        if (req.body.meatLover === "re") foodprint += 108;
        else if (req.body.omnivore === "re") foodprint += 83;
        else if (req.body.vegetarian === "re") foodprint += 55;
        else if (req.body.vegan === "re") foodprint += 46;
        else foodprint += 55; // sensible default

        var footprint = (electricityprint + cylinderprint + petrolprint + flightprint + foodprint + busprint + trainprint);
        
        var newspaper = req.body.newspaper;
        var aluminium = req.body.aluminium || req.body.Aluminium;
        if (newspaper === undefined) footprint += 89 / numpeople;
        if (aluminium === undefined) footprint += 75 / numpeople;

        if (isNaN(footprint) || footprint <= 0) footprint = 100;
        footprint = Math.round(footprint);
        
        var elecPct = Math.round((electricityprint / footprint) * 100) || 0;
        var cylPct = Math.round((cylinderprint / footprint) * 100) || 0;
        var travelPct = Math.round(((petrolprint + flightprint + trainprint + busprint) / footprint) * 100) || 0;
        var foodPct = Math.round((foodprint / footprint) * 100) || 0;
        
        var percentages = [elecPct, cylPct, travelPct, foodPct];

        let area = (footprint / 2750) * 2.471;
        area = Math.round(area);

        var indiaResult;
        var indiaResultSub;
        if (footprint > 580) {
            indiaResult = "OH NO!! You are beyond the Cusp";
            indiaResultSub = "Your Emission levels exceed India's average by " + Math.floor(footprint / 5.80) + "%";
        } else {
            indiaResult = "Great! Keep it UP";
            indiaResultSub = "Your Emission levels are below India's average by " + Math.floor((580 - footprint) / 5.80) + "%";
        }

        req.session.calculatorResult = {
            footprint: footprint,
            percentages: percentages,
            indiaResult: indiaResult,
            indiaResultSub: indiaResultSub,
            area: area
        };

        return res.redirect("/result");
    } catch (err) {
        console.error("Error in POST /calculator:", err);
        return res.status(500).send("Something went wrong during carbon footprint calculation.");
    }
});

app.get("/result", function(req, res) {
    if (!req.session || !req.session.calculatorResult) {
        return res.redirect("/calculator");
    }
    return res.render("result", req.session.calculatorResult);
});
app.get("/vision",function(req,res)
{
    res.render("vision");
});

app.get("/offset",function(req,res)
{
    res.render("offset");
});

app.get("/team",function(req,res)
{
    res.render("team");
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", function()
{
    console.log(`Server started on port ${PORT}`);
});