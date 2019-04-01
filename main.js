var Crawler = require("crawler");
var ID ;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'out.csv',
  header: [
    {id: 'id', title: 'ID'},
    {id: 'name', title: 'NAME'},
    {id: 'description', title: 'DESCRIPTION'},
    {id: 'city', title: 'CITY'},
    {id: 'url', title: 'URL'},
    {id:'longitude', title :'LONGITUDE'},
    {id:'lattitude', title :'LATTITUDE'},
    {id:'country', title :'COUNTRY'},
    {id:'image', title :'IMAGELINK'}
  ]
});
const data =[];

// var zrawler = crawler("http://www.google.com/")
//     .on("fetchcomplete", function () {
//         console.log("Fetched a resource!")
//     });


var c = new Crawler();

function done()  {
    
    // csvWriter  
    //  .writeRecords(data)
    //  .then(()=> console.log('The CSV file was written successfully'));
   
}
//COSWOLD
//2465 - 2496
//1484 -1496

//DORSET
//2528-2498
//1086
var element = {
    "id":Number,
     "name":String ,
     "description":String,
      "city":String,
      "url":String,
      "longitude":Number,
      "lattitude":Number,
      "country":String,
      "image":String
};
var res = {"id":Number}
for ( ID = 2499; ID <= 2527; ID++) {
   
    
    c.queue([{
        uri: `https://www.michaelpaulholidays.co.uk/find/results?location=dorset&filters%5B%5D=&nights=0&adults=1&children=0&uri=%2Ffind%2Fproperties%2Fdorset%2F0-nights%2F1-adults%2F0-children%2Flodges-and-cottages-and-caravans&propertyId=${ID}&resortId=0&apiId=6&idsOnly=false&minBedroomsNumber=0&maxBedroomsNumber=1000`,
        jQuery: false,
    
        // The global callback won't be called
        callback: function (error, respond, done) {
            res = JSON.parse(respond.body) 
            if(error){
                console.log(error);
            }else if(res!==undefined) {
                
                
                console.log('Grabbed',res[0].id);
                element.id=res[0].id,
                element.name=res[0].property_name,
                element.url=res[0].property_website,
                element.description=res[0].property_long_descript.replace(/<[^>]*>/g, '').replace(/,/g , '').replace(/(\r\n|\n|\r)/gm,' '),
                element.city = res[0].property_location,
                element.country=res[0].property_county,
                element.lattitude=res[0].property_lat,
                element.longitude=res[0].property_long,
                element.image=res[0].property_main_image,
                
                data.push(element)  
                
                // csvWriter  
                //     .writeRecords(data)
                //     .then(()=> console.log('The CSV file was written successfully'));
                  
                }else{console.log("no data")}
            done();
        }
    
    
    }]);


}

c.on('drain',function(){
    console.log("DONE")
    console.log(data)
})


// Queue URLs with custom callbacks & parameters

