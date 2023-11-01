const { on } = require("events");
const { stat } = require("fs");
const http = require("http");
const { json } = require("stream/consumers");

const todo  =[
    {id:1, text: 'one'},
    {id:2, text: 'two'},
    {id:3, text: 'tree'},
 
]


const server = http.createServer((req, res) => {

    const {method, url} = req;

    let body = [];
    req 
    .on('data', chunk=> {
        body.push(chunk);
    })
    .on('end', ()=>{
        body = Buffer.concat(body).toString();
        
        let status = 404;

        const response = {
            succes : false,
            results : [],
            error: ''
        };

        if (method === 'GET' && url === '/todo') {
            status = 200;
            response.success = true;
            response.results = todo;
        } else if (method === 'POST' && url === '/todo') {
            try {
                const { id, text } = JSON.parse(body);
        
                if (!id || !text) {
                    status = 400;
                    response.error = 'harap tambahkan id dan teks';
                } else {
                    todo.push({ id, text });
                    status = 201;
                    response.success = true;
                    response.results = todo;
                }
            } catch (error) {
                status = 400;
                response.error = 'Format JSON tidak valid';
            }
        } else if (method === 'PUT' && url === '/todo') {
            try {
                const { id, text } = JSON.parse(body);
        
                if (!id || !text) {
                    status = 400;
                    response.error = 'harap tambahkan id dan teks';
                } else {
                    const index = todo.findIndex(item => item.id === id);
                    if (index !== -1) {
                        todo[index].text = text;
                        status = 200;
                        response.success = true;
                        response.results = todo;
                    } else {
                        status = 404;
                        response.error = 'Todo dengan id tersebut tidak ditemukan';
                    }
                }   } catch (error) {
                    status = 400;
                    response.error = 'Format JSON tidak valid';
                }
            }
        
        
        res.writeHead(status, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js'
        });
        
        res.end(JSON.stringify(response));
       
    });

    
   

    // res.end(data)
    console.log("Tes Server jalann")

    
});



// const data = JSON.stringify({
//     succes: false,
   
//     data: todo
// })

const PORT = 8080


server.listen(PORT, () => console.log(`server succes berjalan ${PORT}`));



