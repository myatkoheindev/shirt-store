const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const hostname = '127.0.0.1';
const port = 8000;

const mainTemplate = fs.readFileSync(path.join(__dirname,'template','index.html'),'utf-8');
const productCard = fs.readFileSync(path.join(__dirname,'template',"product-card.html"),'utf-8');
const productDetail = fs.readFileSync(path.join(__dirname,'template',"product-detail.html"),'utf-8');
const products = JSON.parse(fs.readFileSync(path.join(__dirname,'data','product.json'),'utf-8'));

function productCardTemplate(productCard,product){
    let output = productCard.replace(/{%PRODUCT_TITLE%}/g,product.name);
    output = output.replace(/{%PRODUCT_DECRIPTION%}/g,product.description)
    output = output.replace(/{%PRODUCT_PRICE%}/g,product.price)
    output = output.replace(/{%PRODUCT_IMAGE%}/g,product.image)
    output = output.replace(/{%PRODUCT_COLOR%}/g,product.color)
    output = output.replace(/{%PRODUCT_SIZE%}/g,product.size)
    output = output.replace(/{%ID%}/g,product.id)
    return output;
}

const server = http.createServer((req,res) => {
    const {pathname,query} = url.parse(req.url,true);
    if(pathname === '/' || pathname === '/products'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        
        const productCardList =  products.map((product) => productCardTemplate(productCard,product));
        res.end(mainTemplate.replace('{%PRODUCT%}',productCardList.join('')));
    }else if(pathname === '/product'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        })

        const product = products[query.id - 1] ;
        const productDetailPage =  productCardTemplate(productDetail,product);
        res.end(productDetailPage);
    }else if(pathname === '/cart'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        
        res.end(mainTemplate.replace('{%PRODUCT%}','Cart List'));
    }else if(pathname === '/about'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(mainTemplate.replace('{%PRODUCT%}','About US'));
    }
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end('<h1>Page not found</h1>');
    }
});


server.listen(port,hostname,()=>{
    console.log('server is running in http://' + hostname + ':' + port);
});