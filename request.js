const Request = require('request-promise');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const config =require("./config")
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [{
      id: 'id',
      title: 'ID'
    },
    {
      id: 'name',
      title: 'NAME'
    },
    {
      id: 'description',
      title: 'DESCRIPTION'
    },
    {
      id: 'city',
      title: 'CITY'
    },
    {
      id: 'url',
      title: 'URL'
    },
    {
      id: 'longitude',
      title: 'LONGITUDE'
    },
    {
      id: 'lattitude',
      title: 'LATTITUDE'
    },
    {
      id: 'country',
      title: 'COUNTRY'
    },
    {
      id: 'image',
      title: 'IMAGELINK'
    }
  ]
});
var data = [];
var count = 0;
const start = 1132;
const end = 1242;

function getUrl(ID) {
  return `https://www.michaelpaulholidays.co.uk/find/results?location=dorset&filters%5B%5D=&nights=0&adults=1&children=0&uri=%2Ffind%2Fproperties%2Fdorset%2F0-nights%2F1-adults%2F0-children%2Flodges-and-cottages-and-caravans&propertyId=${ID}&resortId=0&apiId=6&idsOnly=false&minBedroomsNumber=0&maxBedroomsNumber=1000`

}

function getElement(body) {
    try {
      res = JSON.parse(body)
      if(res == null) return {}
      obj = {}
      obj.id = res[0].id,
        obj.name = res[0].property_name,
        obj.url = res[0].property_website,
        obj.description = res[0].property_long_descript.replace(/<[^>]*>/g, '').replace(/,/g, '').replace(/(\r\n|\n|\r)/gm, ' '),
        obj.city = res[0].property_location,
        obj.country = res[0].property_county,
        obj.lattitude = res[0].property_lat,
        obj.longitude = res[0].property_long,
        obj.image = res[0].property_main_image;

        return obj;
    } catch (error) {
      return error;
    }
}

async function fetchInParallel(start, end) {
  for (let i = start; i < end; i++) { 
    var err, resp, body = await Request.get(getUrl(i))

    if (err != null) console.log(err)
    else {
      count = await add(count)
      const ev = getElement(body)
      console.log('Searching', i);
      if (ev.id){
        console.log('Added', ev.id);
        data.push(ev)
      }
      if(data.length>10) {
        await writeToCSV(data).then(console.log("Written to the file"));
        data=[];  
      }
      if(count==100) {
        //sleep
        console.log("count reached 100, sleeping for 5 second")
        count = await reset();
        await sleep(5000);
        console.log("awaken, Running again")
      }
    }
  }
  await writeToCSV(data).then(console.log("FINISHED"))
}

async function add(i){
  i++;
  return ( i);
}

async function reset() {
  return  0;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function writeToCSV(elems) {
  return await csvWriter.writeRecords(elems)
}

fetchInParallel(start, end)
