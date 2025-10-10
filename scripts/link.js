const YML = require('yamljs');
const fs = require('fs').promises;
const path = require('path');

// 路径配置
const LINK_YML_PATH = path.join('source', '_data', 'link.yml');
const OUTPUT_JSON_PATH = path.join('source', 'flink_count.json');
const TAKE_COUNT = 2;

async function processLinks() {
  try {
    // 读取文件（二进制方式）
    const yamlBuffer = await fs.readFile(LINK_YML_PATH);
    console.log('文件读取成功，大小:', yamlBuffer.length, '字节');
    
    // 处理UTF-8 BOM头（移除BOM）
    let cleanBuffer = yamlBuffer;
    if (yamlBuffer[0] === 0xef && yamlBuffer[1] === 0xbb && yamlBuffer[2] === 0xbf) {
      console.warn('检测到UTF-8 BOM头，已自动移除');
      cleanBuffer = yamlBuffer.slice(3); // 移除前3个BOM字节
    }
    
    // 转换为字符串
    const yamlContent = cleanBuffer.toString('utf8');
    
    // 显示文件前100个字符用于调试
    console.log('文件前100字符:', yamlContent.substring(0, 100).replace(/\n/g, '\\n'));
    
    // 更安全的YAML处理 - 只处理确实为空的rss字段
    const processedContent = yamlContent
      .replace(/^\s*rss:\s*$/gm, 'rss: ""')  // 处理空的rss字段
      .replace(/\t/g, '  ');  // 将制表符替换为两个空格（YAML不允许制表符缩进）
    
    // 保存处理后的内容用于调试
    await fs.writeFile('processed_yaml_debug.yml', processedContent, 'utf8');
    console.log('已保存处理后的YAML到 processed_yaml_debug.yml');
    
    // 尝试使用更严格的方式定位错误
    try {
      console.log('开始解析YAML...');
      const data = YML.parse(processedContent);
      console.log('YAML解析成功，根结构类型:', Array.isArray(data) ? '数组' : typeof data);
      
      if (!Array.isArray(data)) {
        throw new Error('YAML文件的根结构不是数组');
      }
      
      const linkList = [];
      for (let i = 0; i < Math.min(TAKE_COUNT, data.length); i++) {
        const item = data[i];
        if (item && Array.isArray(item.link_list)) {
          linkList.push(...item.link_list);
        } else {
          console.warn(`第${i+1}项不包含有效的link_list数组，已跳过`);
        }
      }
      
      const outputData = {
        link_list: linkList,
        length: linkList.length
      };
      
      await fs.writeFile(
        OUTPUT_JSON_PATH,
        JSON.stringify(outputData, null, 2),
        'utf8'
      );
      
      console.log(`成功生成 ${OUTPUT_JSON_PATH}，共包含 ${linkList.length} 条友链`);
      
    } catch (parseError) {
      console.error('\n=== YAML解析错误 ===');
      console.error('错误信息:', parseError.message);
      
      // 尝试定位错误行
      if (parseError.parsedLine) {
        console.error('错误位置: 第', parseError.parsedLine, '行');
        // 输出错误行附近的内容
        const lines = processedContent.split('\n');
        const errorLine = parseError.parsedLine - 1; // 转换为数组索引
        // 显示错误行前后3行
        for (let i = Math.max(0, errorLine - 3); i <= Math.min(lines.length - 1, errorLine + 3); i++) {
          console.log(`${i + 1}: ${lines[i]}`);
        }
      } else {
        console.error('错误位置: 未知（可能是文件开头附近）');
      }
      console.error('请检查 processed_yaml_debug.yml 文件是否有格式问题');
    }
    
  } catch (error) {
    console.error('\n=== 处理过程出错 ===');
    console.error('错误信息:', error.message);
  }
}

processLinks();
