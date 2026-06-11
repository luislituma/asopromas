import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    }
  });
  page.on('pageerror', err => console.error('PAGE EXCEPTION:', err.toString()));
  
  const ports = [5173, 5174, 5175, 5176];
  let connected = false;
  
  for (const port of ports) {
    try {
      console.log(`Trying port ${port}...`);
      await page.goto(`http://localhost:${port}/socios`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      connected = true;
      console.log(`Connected to port ${port}`);
      break;
    } catch (e) {
      console.log(`Failed port ${port}`);
    }
  }
  
  if (!connected) {
    console.log("Could not connect to any port");
    await browser.close();
    return;
  }
  
  // wait for load
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Looking for an element to click...");
  // click first socio
  const rows = await page.$$('tr');
  if (rows.length > 1) {
    await rows[1].click();
    console.log("Clicked first socio");
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Looking for Fincas y Lotes tab...");
    // click Fincas y Lotes tab
    const tabs = await page.$$('button');
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text && text.includes('Fincas y Lotes')) {
        await tab.click();
        console.log("Clicked Fincas y Lotes tab");
        break;
      }
    }
    
    await new Promise(r => setTimeout(r, 3000));
  }
  
  await browser.close();
})();
