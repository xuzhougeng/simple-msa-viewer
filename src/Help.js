// Help.js

import React from 'react';

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">my-fasta-viewer 用户指南</h2>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-500">1. 布局和设计改进</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-blue-700">按钮美化：</strong> 可以调整按钮的布局、颜色和大小，以增强视觉效果和易用性。</li>
          <li><strong className="text-blue-700">可折叠输入框：</strong> 用户可以将粘贴序列的输入区域折叠，以节省空间并保持布局紧凑。</li>
          <li><strong className="text-blue-700">移动功能按钮：</strong> "清除高亮" 和 "跳转" 功能已移到输入选项之外，以便更轻松地访问。</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-500">2. 序列输入与可视化</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-blue-700">粘贴序列进行可视化：</strong> 用户可以直接将序列粘贴到输入框中，进行即时可视化。</li>
          <li><strong className="text-blue-700">自动折叠输入选项：</strong> 在执行 "加载示例"、 "上传FASTA" 或 "可视化粘贴序列" 后，输入选项将自动折叠。</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-500">3. 序列导航</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-blue-700">跳转到指定位置：</strong> 用户可以使用专门的输入框跳转到序列中的指定位置。</li>
          <li><strong className="text-blue-700">快捷键 Enter：</strong> 按下 "Enter" 键可以触发 "搜索序列" 和 "跳转到位置" 操作。</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-500">4. 列管理</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-blue-700">删除选中列：</strong> 用户可以通过选择特定列，使用新功能来删除这些列。</li>
          <li><strong className="text-blue-700">移除第一到最后可见列：</strong> "从第一个可见列到最后列的删除功能" 已根据用户反馈删除。</li>
          <li><strong className="text-blue-700">Shift 范围选择：</strong> 按住 "Shift" 键，用户可以一次选择多个列。</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-500">5. 键盘快捷键</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-blue-700">撤销 (Ctrl + Z)：</strong> 用户可以按 "Ctrl + Z" 撤销上一步操作。</li>
          <li><strong className="text-blue-700">Enter 快捷键：</strong> 按下 "Enter" 键可触发搜索或跳转操作。</li>
          <li><strong className="text-blue-700">粘贴 (Ctrl + V)：</strong> 按 "Ctrl + V" 将直接将序列粘贴到输入框中。</li>
          <li><strong className="text-blue-700">删除列快捷键：</strong> 为快速删除选中列，已添加了 "Delete" 键快捷方式。</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-500">6. 导出功能</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-blue-700">导出为FASTA：</strong> 用户可以将当前的可视化结果或分析结果导出为FASTA文件并下载。</li>
        </ul>
      </section>

    </div>
  );
};

export default Help;
