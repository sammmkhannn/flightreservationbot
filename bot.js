import puppeteer from "puppeteer";


( async ()=>{
   try{
    let browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:['--start-maximized']
    });
    let page = await browser.newPage();
    let url = "https://developers.google.com/maps/documentation/javascript/reference";
    await page.goto(url,{timeout:0,waitUntil:"load"});
    await page.screenshot({path:"scr.png"});
    await page.waitForSelector(".devsite-nav-item.devsite-nav-expandable > div > a");
    let topics = await page.evaluate(() =>{
        console.log(document.body.innerText);
        return [...document.querySelectorAll(".devsite-nav-section > li > a")].slice(1,28).map(el => el.href);
        
    })
    console.log(topics);
    let allDocs=[];
    for(let topic of topics) {
        await page.goto(topic,{waitUntil:"load",timeout:0});
        await scroll(page);
        await page.waitForSelector("tr");
        await page.waitForTimeout(3000);
        await page.evaluate((allDocs)=>{
            let docs = [...document.getElementsByTagName("td")].map(el => el.innerText);
            let props = docs.filter((el,index) =>{
                return index % 2 == 1;
            });
            let values = docs.filter((el,index) =>{
                return index % 2 == 0;
            });
            let data = props.map((el,index) =>{
                return {[el]:values[index]};
            })
            allDocs.push(data);           
        },allDocs);
        break;
    }
    console.log(allDocs);
   }catch(err) {
       console.log(err);
   }
})();


const scroll = async (page)=> {
    await page.evaluate(()=>{
        document.scrollingElement.scrollBy(0,document.scrollingElement.scrollHeight);
    });
}

