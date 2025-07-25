const axios = require('axios');

async function fetchData() {
  try {
    const response = await axios.get('https://github.moeyy.xyz/https://github.com/cxyfreedom/website-hot-hub/raw/refs/heads/main/README.md');
    const content = response.data;

    // Regular expression to match sections
    const sectionRegex = /<!-- BEGIN (\w+) -->\n([\s\S]*?)<!-- END \1 -->/g;
    let match;
    const result = {};

    while ((match = sectionRegex.exec(content)) !== null) {
      const sectionName = match[1];
      const sectionContent = match[2];
      const entries = sectionContent.split('\n').filter(line => line.trim());

      result[sectionName.toLowerCase()] = [];

      for (let entry of entries) {
        let linkMatch = entry.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch && linkMatch.length === 3) {
          result[sectionName.toLowerCase()].push({
            title: linkMatch[1],
            url: linkMatch[2]
          });
        }
      }
    }

    console.log('{"status":200,"data":'+JSON.stringify(result, null, 2)+'}');
  } catch (error) {
    console.error('Error fetching the document:', error);
  }
}

fetchData();
