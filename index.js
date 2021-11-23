const express = require('express');
const exphbs = require('express-handlebars');
let AvoShopper = require("./avo-shopper");

const pg = require("pg");
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
	useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:codex123@localhost:5432/avo_shopper';

const pool = new Pool({
	connectionString
});

const app = express();
const PORT = process.env.PORT || 3012;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const Avo_ShopperInstance = AvoShopper(pool);

app.get('/', async function (req, res) {
	res.render('index', {
		avo_shops: await Avo_ShopperInstance.listShops()
	});
});

app.get('/add_shop', async function (req, res) {
	res.render("add_shop")
})

app.post('/add_shop', async function (req, res) {
	let {shopName} = req.body;

	let newShop = await Avo_ShopperInstance.createShop(shopName)
	console.log(">>>>>>>>>>>>>>",newShop)
	res.redirect("/add_shop")
})

app.get('/deals4this_shop', async function (req, res) {


	res.render("deals4this_shop", {

	})
	
})

app.get('/add_product/', async function (req, res) {
	res.render("add_product/", {
	})
})


app.post('/add_product/:id', async function (req, res) {


	res.render("add_product", {

	})
})






// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function () {
	console.log(`AvoApp started on port ${PORT}`)
});