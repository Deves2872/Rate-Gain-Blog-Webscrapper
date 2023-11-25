const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

async function scrapper() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  var url = "https://rategain.com/blog/";
  var master = [];
  console.log(url);
  await page.goto(url);
  const BlogInfo = await page.$$eval(".blog-items .blog-item", (elements) =>
    elements.map((e) => ({
      title: e.querySelector(".content h6").innerText,
      date: e.querySelector(".content .blog-detail .bd-item").innerText,
      image: e.querySelector(".img a").href,
      likes: e.querySelector(".content .zilla-likes").innerText,
    }))
  );
  var Blog = JSON.stringify(BlogInfo);
  const final = JSON.parse(Blog);
  const Rategain = final.map((obj) => Object.values(obj));
  master = master.concat(Rategain);
  url = `${url}page/`;
  for (var i = 2; i <= 27; i++) {
    await page.goto(`${url}${i}/`);
    const BlogInfo = await page.$$eval(".blog-items .blog-item", (elements) =>
      elements.map((e) => ({
        title: e.querySelector(".content h6").innerText,
        date: e.querySelector(".content .blog-detail .bd-item").innerText,
        image: e.querySelector(".img a").href,
        likes: e.querySelector(".content .zilla-likes").innerText,
      }))
    );
    var Blog = JSON.stringify(BlogInfo);
    const final = JSON.parse(Blog);
    const Rategain = final.map((obj) => Object.values(obj));
    master = master.concat(Rategain);
  }
  console.log(master);
  //console.log(master);
  //console.log(BlogInfo);
  // var Blog = JSON.stringify(BlogInfo);
  // const final = JSON.parse(Blog);
  // const Rategain = final.map((obj) => Object.values(obj));
  // console.log(Rategain);
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(master);
  xlsx.utils.book_append_sheet(wb, ws);
  xlsx.writeFile(wb, "Rate Blog Sheet.xlsx");

  // console.log(links);
  await browser.close();
}

scrapper();
