const xml = require("fast-xml-parser");
const http = require("http");
const fs = require("fs");

const host = "localhost";
const port = 8000;


const requestListener = function (req, res) {
  if (req.method === "GET") {
   
    fs.readFile("data.xml", (err, data) => {
      if (err === null) {
        
   
const parser = new xml.XMLParser();
const obj = parser.parse(data);

const baseInd = obj.indicators.basindbank;
const dataArray = Array.isArray(baseInd) ? baseInd : [baseInd];
const sortedData = dataArray
  .filter((item) => item.parent === 'BS3_BanksLiab')
  .map((item) => ({
    txt: item.txten,
    value: item.value,
  }));

const newObj = {
  data: {
    indicators: sortedData,
  },
};


const builder = new xml.XMLBuilder();
const xmlStr = builder.build(newObj);

    
    res.writeHead(200, { "Content-Type": "application/xml" });
    res.end(xmlStr);

  } else {
    console.log(err); 
 }
});  
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
