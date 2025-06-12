const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchData() {
  try {
    const response = await axios.get(
      'https://raw.githubusercontent.com/cxyfreedom/website-hot-hub/main/README.md'
    );
    const content = response.data;

    const sectionRegex = /<!-- BEGIN (\w+) -->\n([\s\S]*?)<!-- END \1 -->/g;
    const result = {};
    let match;

    while ((match = sectionRegex.exec(content)) !== null) {
      const sectionName = match[1].toLowerCase();
      const sectionContent = match[2].split('\n').filter(line => line.trim());

      result[sectionName] = [];

      for (let entry of sectionContent) {
        const linkMatch = entry.match(/
$$
(.*?)
$$
$(.*?)$/);
        if (linkMatch && linkMatch.length === 3) {
          result[sectionName].push({
            title: linkMatch[1],
            url: linkMatch[2]
          });
        }
      }
    }

    if (Object.keys(result).length === 0) {
      console.warn('未找到匹配的区块，请检查 README.md 格式');
      return;
    }

    const outputPath = path.resolve(__dirname, 'data.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log('Data saved to', outputPath);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('HTTP 错误:', error.response.status, error.response.data);
    } else if (error.code === 'ENOENT') {
      console.error('路径不存在，请检查文件路径:', outputPath);
    } else if (error.code === 'EACCES') {
      console.error('权限不足，无法写入文件:', outputPath);
    } else {
      console.error('未知错误:', error);
    }
  }
}

fetchData();
