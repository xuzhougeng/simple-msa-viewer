// Help.js

import React from 'react';
const Help = () => {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-4xl font-bold mb-8 text-indigo-600 border-b-2 border-indigo-200 pb-4">my-fasta-viewer 使用指南</h2>
  
        <section className="mb-10">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-500">1. 开始使用</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">欢迎使用my-fasta-viewer！这是一个强大的FASTA序列可视化和编辑工具。以下是快速入门步骤：</p>
          <ol className="list-decimal pl-8 space-y-3 text-gray-700">
            <li>在主界面上方，你可以选择输入FASTA序列的方式：粘贴、上传文件或加载示例。</li>
            <li>选择输入方式后，你的序列将在下方的可视化区域显示。</li>
            <li>使用页面上的各种工具来编辑、分析和导出你的序列。</li>
          </ol>
        </section>
  
        <section className="mb-10">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-500">2. 主要功能</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["序列可视化", "直观地查看和编辑你的FASTA序列"],
              ["序列搜索", "使用搜索框查找特定的序列片段"],
              ["位置跳转", "快速跳转到序列的指定位置"],
              ["列管理", "选择、删除和操作序列中的特定列"],
              ["导出功能", "将编辑后的序列导出为FASTA文件"]
            ].map(([title, desc], index) => (
              <li key={index} className="bg-indigo-50 p-4 rounded-lg">
                <strong className="text-indigo-700 block mb-2">{title}</strong>
                <span className="text-gray-600">{desc}</span>
              </li>
            ))}
          </ul>
        </section>
  
        <section className="mb-10">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-500">3. 使用技巧</h3>
          <ul className="space-y-3 text-gray-700">
            {[
              ["快捷键", "使用键盘快捷键提高操作效率（详见下方快捷键列表）"],
              ["列选择", "按住Shift键可以一次选择多个列"],
              ["自动折叠", "输入选项在执行后会自动折叠，保持界面整洁"]
            ].map(([title, desc], index) => (
              <li key={index} className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong className="text-indigo-700">{title}：</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </section>
  
        <section className="mb-10">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-500">4. 键盘快捷键</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Ctrl + Z", "撤销上一步操作"],
                ["Enter", "触发搜索或跳转操作"],
                ["Ctrl + V", "直接粘贴序列到输入框"],
                ["Delete", "删除选中的列"],
                ["ESC", "关闭帮助窗口"]
              ].map(([key, action], index) => (
                <li key={index} className="flex items-center">
                  <kbd className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-3 text-sm">{key}</kbd>
                  <span className="text-gray-600">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
  
        <section className="mb-10">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-500">5. 注意事项</h3>
          <ul className="space-y-3 text-gray-700">
            {[
              "确保你的FASTA序列格式正确，以便正确显示和分析。",
              "大型序列可能需要较长时间加载，请耐心等待。",
              "定期保存你的工作，以防意外丢失数据。"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
  
        <p className="mt-8 text-gray-600 bg-indigo-50 p-4 rounded-lg">
          如果你在使用过程中遇到任何问题或有改进建议，请随时联系我（xuzhougeng@163.com），祝你使用愉快！
        </p>
      </div>
    );
  };
export default Help;
