import { Client, handle_file } from '@gradio/client';
import {
  createHistory,
  applyEdit,
  undo,
  redo,
} from './src/core/source-fidelity.mjs';

import {
  validatePrompt,
} from './src/core/prompt-validation.mjs';

import {
  validateDocumentTitle,
} from './src/core/document-validation.mjs';

const LANGUAGE_STORAGE_KEY = 'prompt-lab-studio-language';
const languageButton = document.querySelector('#language-button');
const languageMenu = document.querySelector('#language-menu');
const languageLabel = document.querySelector('#language-label');
const textTranslations = {
  '☰ Menu': '☰ 菜单',
  'Prompt workspace': 'Prompt 工作区',
  'Untitled prompt': '未命名 Prompt',
  'Prompt Editor': 'Prompt 编辑器',
  'Local workspace': '本地工作区',
  Language: '语言',
  'Select language': '选择语言',
  Tools: '工具菜单',
  DOCUMENT: '文档',
  'Document title': '文档标题',
  'Enter a document title': '输入文档标题',
  'Danbooru Tag Search': 'Danbooru 标签搜索',
  'Search tags, e.g. blue hair...': '搜索标签，例如 blue hair...',
  WORKSPACE: '工作区',
  'Prompt editor': 'Prompt 编辑器',
  'Source text': '源文本',
  Tags: '普通标签',
  'Weighted expressions': '权重表达式',
  'Write your prompt here...': '在此输入 Prompt...',
  'Your original text stays unchanged by validation.': '验证不会修改原始文本。',
  'Validate prompt': '验证 Prompt',
  'New Document': '新建文档',
  'Save JSON': '保存 JSON',
  'Export TXT': '导出 TXT',
  'Open File': '打开文件',
  Undo: '撤销',
  Redo: '重做',
  DIAGNOSTICS: '诊断',
  'Validation results': '验证结果',
  'Not validated yet': '尚未验证',
  'Run validation to check for unmatched parentheses.': '运行验证以检查不匹配的括号。',
  'Image Tagger': '图片打标',
  'Select an image to send it to the PixAI Tagger Demo and generate tags.': '选择图片并发送到 PixAI Tagger Demo 生成标签。',
  'Drop, select, or paste an image to preview it here': '拖入、选择或粘贴图片以在此预览',
  'Image preview for tagging': '待打标图片预览',
  'Remove image': '移除图片',
  'Choose image': '选择图片',
  'Optimize upload': '优化上传',
  'Max dimension 1536px · WebP quality 0.92': '最长边 1536px · WebP 质量 0.92',
  'Generate tags': '生成标签',
  'No tags generated yet': '尚未生成标签',
  'Select an image to get started.': '请选择一张图片。',
  'Reset thresholds': '恢复默认阈值',
  'Character Feature Filters': '角色特征过滤',
  'All categories allowed': '全部放行',
  'Turn off a filter to exclude matching tags from the preview, copied output, and Prompt Editor replacement. Tags remain visible in the list.': '关闭开关会从预览、复制和覆盖 Prompt 的结果中排除该类标签；标签列表仍会显示。',
  'Filter eye-color and heterochromia tags': '过滤眼睛颜色和异色瞳标签',
  'Filter hair-color, two-tone, gradient, and streaked-hair tags': '过滤头发颜色、双色、渐变与挑染标签',
  'Filter non-color hairstyle, hair-length, and styling tags': '过滤非颜色类发型、发长和造型标签',
  'Filter dark-skin, brown-skin, and tan tags': '过滤深肤色、棕肤和晒黑标签',
  'Filter animal ears, tails, and kemonomimi traits': '过滤兽耳、尾巴与兽娘特征',
  'Filter elf and pointed-ear traits': '过滤精灵与尖耳朵特征',
  'Filter angel, halo, and wing traits': '过滤天使、光环与羽翼特征',
  'Filter demon, horn, bat-wing, and succubus traits': '过滤恶魔、犄角、蝙蝠翅膀与魅魔特征',
  'Eye color': '瞳色',
  'Hair color': '发色',
  'Hairstyle / length': '发型·发长',
  'Dark skin / tan': '黑皮 / 深肤',
  'Animal traits': '兽耳 / 兽娘',
  'Elf traits': '精灵系',
  'Angelic traits': '天使系',
  'Demonic traits': '恶魔系',
  'Selected Tag Output': '选中标签输出',
  'Selected tag output': '选中标签输出',
  '0 selected tags available to copy': '0 个可复制标签',
  Sort: '排序',
  'Confidence: high to low': '置信度降序',
  'A–Z within categories': '按类别 A-Z',
  'A–Z overall': '全局 A-Z',
  'Keep underscores': '保留下划线',
  'Add artist: prefix to Style tags': 'Style 分类加 artist: 前缀',
  'Copy all selected': '一键复制全部',
  'Selected tags will appear here.': '选择标签后将在这里预览。',
  'Raw Confidence Lookup': '原始置信度检索表',
  '0 tags': '0 个标签',
  'Search tags': '搜索标签',
  'Enter a tag or category': '输入标签或类别',
  Tag: '标签',
  Category: '类别',
  Confidence: '置信度',
  'No matching tags.': '没有匹配的标签。',
  'Put in Prompt Editor (overwrite)': '放入 Prompt Editor（覆盖）',
  'Prompt Cleaner': 'Prompt 清理器',
  'Organize prompt tags and manage terms to block.': '整理 Prompt 标签并管理屏蔽词。',
  Prompt: 'Prompt',
  'Analyze prompt': '分析 Prompt',
  Output: '输出结果',
  'Output display mode': '输出显示方式',
  'Marked preview': '划线预览',
  'Clean output': '干净输出',
  'Copy cleaned result': '复制干净结果',
  'Put in Prompt Editor': '放入 Prompt Editor',
  Cancel: '取消',
  'Blocked Terms': '屏蔽词管理',
  'Add terms to block, then choose exact or fuzzy matching for each term.': '添加屏蔽词，再为每个词选择精确或模糊匹配。',
  'Click a tag on the right to add it to the block list, then choose exact or fuzzy matching.': '点击右侧标签将其加入屏蔽列表，再选择精确或模糊匹配。',
  'Prompt Tags': 'Prompt 标签',
  'Click tags to mark them for blocking. Red indicates exact matches; yellow indicates fuzzy matches. Blocked tags are shown with strikethrough in the preview and removed when applied.': '点击标签可选择屏蔽。红色表示精确屏蔽，黄色表示模糊屏蔽；输出结果中会划线预览，应用后移除。',
  'This tool is not implemented yet.': '此工具尚未实现。',
  'Zero-dependency prototype': '零依赖原型',
  'Prompt Tagger': 'Prompt 打标器',
  'Tag Categorizer': '标签分类器',
  'Prompt Diff': 'Prompt 差异对比',
  'Weight Manager': '权重管理器',
  'Batch Processor': '批量处理器',
  'Create New Document?': '新建文档？',
  'You have unsaved changes. Do you want to discard them and create a new document?': '当前有未保存的更改。确定放弃更改并新建文档吗？',
  'Discard Changes': '放弃更改',
  'Create New': '新建',
  'Open Another Document?': '打开其他文档？',
  'You have unsaved changes. Do you want to discard them and open another document?': '当前有未保存的更改。确定放弃更改并打开其他文档吗？',
  'Overwrite the current prompt?': '覆盖当前 Prompt？',
  'This will replace all content in the Prompt Editor with the currently selected tags. You can undo this action.': '这会用当前选中的标签替换 Prompt Editor 中的全部内容。此操作可以通过撤销恢复。',
  'Overwrite Prompt': '覆盖 Prompt',
  'Replace the current prompt?': '替换当前 Prompt？',
  'This will replace all content in the Prompt Editor with the cleaned result. You can undo this action.': '这会用 Cleaner 的干净结果替换 Prompt Editor 中的全部内容。此操作可以通过撤销恢复。',
  'Replace Prompt': '替换 Prompt',
  'Title looks good.': '标题有效。',
  'No unmatched parentheses found.': '未发现不匹配的括号。',
  'Validation passed': '验证通过',
  'Validation failed': '验证未通过',
  'New document created.': '已新建文档。',
  'Cannot save: document title is empty.': '无法保存：文档标题不能为空。',
  'JSON document exported.': 'JSON 文档已导出。',
  'Prompt exported as TXT.': 'Prompt 已导出为 TXT。',
  'Enter a keyword to search tags.': '输入关键词以搜索标签。',
  'Searching...': '正在搜索...',
  'No matching tags found.': '没有找到匹配的标签。',
  Other: '其他',
  General: '一般标签',
  Artist: '画师',
  Copyright: '作品',
  Character: '角色',
  Metadata: '元数据',
  Style: '风格',
  Exact: '精确',
  Fuzzy: '模糊',
  '(empty tag)': '（空标签）',
  'Cleaned result copied': '干净结果已复制',
  'Default confidence thresholds restored': '已恢复默认置信度阈值',
  'Copy failed. Check your browser clipboard permissions and try again.': '复制失败，请检查浏览器剪贴板权限后重试。',
  'The API did not return any usable tags.': 'API 没有返回可用标签。',
  'Unknown error': '未知错误',
  'The API returned data in an unexpected format.': 'API 返回的数据格式不符合预期。',
  'This browser could not create an image-processing canvas.': '浏览器无法创建图片处理画布。',
  'This browser could not create the optimized image.': '浏览器无法生成优化后的图片。',
  'This browser does not support WebP image optimization.': '此浏览器不支持 WebP 图片优化。',
  'Drop an image file such as PNG, JPG, or WEBP.': '请拖入 PNG、JPG、WEBP 等图片文件。',
  'Filters were applied but could not be saved. They may reset after you refresh.': '过滤设置已应用，但无法保存偏好；刷新后可能恢复默认状态。',
  'Output format was updated but could not be saved. It may reset after you refresh.': '输出格式已更新，但无法保存偏好设置；刷新后可能恢复默认状态。',
  'Upload settings were applied but could not be saved. They may reset after you refresh.': '上传设置已生效，但无法保存；刷新后可能恢复默认状态。',
  'Thresholds were applied but could not be saved. Check browser storage permissions.': '阈值已应用，但无法保存偏好设置；请检查浏览器存储权限。',
  'Prompt changed. Check duplicates again before applying.': 'Prompt 已更改。请重新检查重复项后再应用。',
  'Search failed. Check your internet connection or try again later.': '搜索失败，请检查网络连接或稍后重试。',
  'Connecting to PixAI and processing the image. Please wait...': '正在连接 PixAI 并处理图片，请稍候……',
  'Unable to open this file.': '无法打开此文件。',
  'Invalid Prompt Lab Studio JSON document.': 'Prompt Lab Studio JSON 文档无效。',
  'The document title must not be empty.': '文档标题不能为空。',
  'Unsupported file type. Choose a JSON or TXT file.': '不支持的文件类型。请选择 JSON 或 TXT 文件。',
  'Clipboard access is unavailable in this browser context.': '当前浏览器环境无法访问剪贴板。',
  'Invalid confidence score': '置信度数据无效',
  'Closing parenthesis has no matching opening parenthesis.': '右括号没有对应的左括号。',
  'Opening parenthesis has no matching closing parenthesis.': '左括号没有对应的右括号。',
  'Document title must not be empty or whitespace-only.': '文档标题不能为空或仅包含空白字符。',
};

const categoryTranslations = {
  General: '一般标签',
  Character: '角色',
  Style: '风格',
  Copyright: '作品',
  Metadata: '元数据',
  Rating: '分级',
};

const untranslatedContentSelector =
  '#prompt-highlight, #cleanup-original, #cleanup-result, #cleanup-tags, .tagger-tag-name, .tagger-score-name, .cleanup-blocked-tag';
const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
let currentLanguage = 'en';

function translateUiText(source) {
  if (currentLanguage === 'en') return source;
  if (textTranslations[source] !== undefined) return textTranslations[source];

  let match = source.match(/^Blocking (\d+) categories$/);
  if (match) return `已拦截 ${match[1]} 类`;

  match = source.match(/^Copied all (\d+) selected tags$/);
  if (match) return `已复制全部 ${match[1]} 个选中标签`;

  match = source.match(/^Copied (\d+) (.+) tags$/);
  if (match) return `已复制 ${match[2]} 的 ${match[1]} 个标签`;

  match = source.match(/^Copy group \((\d+)\)$/);
  if (match) return `复制分组 (${match[1]})`;

  match = source.match(/^(\d+) tags · sorted by confidence$/);
  if (match) return `${match[1]} 个标签 · 按置信度降序`;

  match = source.match(/^(\d+) selected tags available to copy$/);
  if (match) return `${match[1]} 个可复制标签`;

  match = source.match(/^(\d+) \/ (\d+) above threshold$/);
  if (match) return `达标 ${match[1]} / ${match[2]}`;

  match = source.match(/^Tagging failed: (.*)$/);
  if (match) return `打标失败：${translateUiText(match[1])}`;

  match = source.match(/^Tagging complete\. (.*)$/);
  if (match) return `打标完成。${translateOptimization(match[1])}`;

  match = source.match(/^(.+); connecting to PixAI and processing the image\. Please wait\.\.\.$/);
  if (match) return `${translateOptimization(match[1])}；正在连接 PixAI 并处理图片，请稍候……`;

  match = source.match(/^(\d+) tags(?: · (.*))?$/);
  if (match) return `${match[1]} 个标签${match[2] ? ` · ${match[2]}` : ''}`;

  match = source.match(/^(.+) confidence threshold$/);
  if (match) return `${categoryTranslations[match[1]] ?? match[1]} 置信度阈值`;

  match = source.match(/^(.+) matching mode$/);
  if (match) return `${match[1]} 匹配模式`;

  match = source.match(/^Remove blocked term (.+)$/);
  if (match) return `移除屏蔽词 ${match[1]}`;

  match = source.match(/^Opened (.+)\.$/);
  if (match) return `已打开 ${match[1]}。`;

  match = source.match(/^(.+) · (.+) · ([\d,]+) posts$/);
  if (match) {
    const category = categoryTranslations[match[2]] ?? match[2];
    return `${match[1]} · ${category} · ${match[3]} 个作品`;
  }

  match = source.match(/^Invalid confidence score for "(.+)"\.$/);
  if (match) return `“${match[1]}”的置信度数据无效。`;

  match = source.match(/^(.+) Position: (\d+) \(line (\d+)\)\.$/);
  if (match) {
    const warning = textTranslations[match[1]] ?? match[1];
    return `${warning} 位置：${match[2]}（第 ${match[3]} 行）。`;
  }

  match = source.match(/^(\d+) warning(s)? found$/);
  if (match) return `发现 ${match[1]} 个警告`;

  return source;
}

function translateOptimization(message) {
  if (message === 'Using original image') return '使用原图';
  const match = message.match(/^Optimized upload: (.+) MB → (.+) MB$/);
  return match ? `优化上传：${match[1]} MB → ${match[2]} MB` : message;
}

function localizeTextNode(node) {
  if (node.parentElement?.closest(untranslatedContentSelector)) return;
  if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.data);
  const original = originalTextNodes.get(node);
  const leading = original.match(/^\s*/)?.[0] ?? '';
  const trailing = original.match(/\s*$/)?.[0] ?? '';
  const content = original.trim();
  const translated = translateUiText(content);
  const value = `${leading}${translated}${trailing}`;
  if (node.data !== value) node.data = value;
}

function localizeAttributes(element) {
  for (const attribute of ['aria-label', 'title', 'placeholder', 'alt']) {
    if (!element.hasAttribute(attribute)) continue;
    let attributes = originalAttributes.get(element);
    if (!attributes) {
      attributes = new Map();
      originalAttributes.set(element, attributes);
    }
    if (!attributes.has(attribute)) {
      attributes.set(attribute, element.getAttribute(attribute));
    }
    const original = attributes.get(attribute);
    const translated = element === languageButton && attribute === 'aria-label'
      ? (currentLanguage === 'zh-CN' ? '当前语言：简体中文' : 'Current language: English')
      : translateUiText(original);
    if (element.getAttribute(attribute) !== translated) {
      element.setAttribute(attribute, translated);
    }
  }
}

function localizeSubtree(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    localizeTextNode(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root !== document.body) return;

  if (root.nodeType === Node.ELEMENT_NODE) localizeAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let textNode;
  while ((textNode = walker.nextNode())) localizeTextNode(textNode);
  root.querySelectorAll?.('*').forEach(localizeAttributes);
}

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === 'zh-CN' ? 'zh-CN' : 'en';
  languageLabel.textContent = language === 'zh-CN' ? '简体中文' : 'English';
  localizeSubtree(document.body);
  languageButton.setAttribute(
    'aria-label',
    language === 'zh-CN' ? '当前语言：简体中文' : 'Current language: English',
  );
  languageButton.setAttribute('aria-expanded', String(!languageMenu.hidden));
  languageMenu.querySelectorAll('[data-language]').forEach((option) => {
    option.setAttribute('aria-checked', String(option.dataset.language === language));
  });
}

try {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage === 'zh-CN') currentLanguage = savedLanguage;
} catch (error) {
  console.error('Unable to load language preference:', error);
}

applyLanguage(currentLanguage);

languageButton.addEventListener('click', () => {
  languageMenu.hidden = !languageMenu.hidden;
  languageButton.setAttribute('aria-expanded', String(!languageMenu.hidden));
  if (!languageMenu.hidden) {
    languageMenu.querySelector(`[data-language="${currentLanguage}"]`).focus();
  }
});

languageMenu.addEventListener('click', (event) => {
  const option = event.target.closest('[data-language]');
  if (!option) return;

  const nextLanguage = option.dataset.language;
  applyLanguage(nextLanguage);
  localizeDefaultDocumentTitle();
  languageMenu.hidden = true;
  languageButton.setAttribute('aria-expanded', 'false');
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  } catch (error) {
    console.error('Unable to save language preference:', error);
  }
  languageButton.focus();
});

languageMenu.addEventListener('keydown', (event) => {
  const options = [...languageMenu.querySelectorAll('[data-language]')];
  const currentIndex = options.indexOf(document.activeElement);
  let nextIndex;

  if (event.key === 'Escape') {
    languageMenu.hidden = true;
    languageButton.setAttribute('aria-expanded', 'false');
    languageButton.focus();
    return;
  }

  if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length;
  if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = options.length - 1;
  if (nextIndex === undefined) return;

  event.preventDefault();
  options[nextIndex].focus();
});

document.addEventListener('click', (event) => {
  if (languageMenu.hidden || event.target.closest('.language-picker')) return;
  languageMenu.hidden = true;
  languageButton.setAttribute('aria-expanded', 'false');
});

const localizationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes') {
      localizeAttributes(mutation.target);
      return;
    }
    mutation.addedNodes.forEach(localizeSubtree);
  });
});
localizationObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['aria-label', 'title', 'placeholder', 'alt'],
});

const titleInput = document.querySelector('#document-title');
const titleMessage = document.querySelector('#title-message');
const promptSource = document.querySelector('#prompt-source');
const promptHighlight = document.querySelector('#prompt-highlight');
const tagSearchInput = document.querySelector('#tag-search-input');
const tagSearchResults = document.querySelector('#tag-search-results');
const validateButton = document.querySelector('#validate-button');
const undoButton = document.querySelector('#undo-button');
const redoButton = document.querySelector('#redo-button');
const validationStatus = document.querySelector('#validation-status');
const saveJsonButton = document.querySelector('#save-json-button');
const saveTxtButton = document.querySelector('#save-txt-button');
const openDocumentButton = document.querySelector('#open-document-button');
const openFileInput = document.querySelector('#open-file-input');
const newDocumentButton = document.querySelector('#new-document-button');
const confirmModal = document.querySelector('#confirm-modal');
const confirmModalTitle = document.querySelector('#confirm-modal-title');
const confirmModalMessage = document.querySelector('#confirm-modal-message');
const copyToast = document.querySelector('#copy-toast');
const confirmCancelButton = document.querySelector('#confirm-cancel-button');
const confirmContinueButton = document.querySelector('#confirm-continue-button');
const validationResults = document.querySelector('#validation-results');
const menuToggle = document.querySelector('#menu-toggle');
const toolMenu = document.querySelector('#tool-menu');
const toolPlaceholder = document.querySelector('#tool-placeholder');
const toolPlaceholderTitle = document.querySelector('#tool-placeholder-title');
const workspace = document.querySelector('#workspace');
const analyzeCleanupButton = document.querySelector('#analyze-cleanup-button');
const cleanupPreview = document.querySelector('#cleanup-preview');
const cleanupOriginal = document.querySelector('#cleanup-original');
const cleanupResultView = document.querySelector('#cleanup-result');
const cleanupMarkedPreviewButton = document.querySelector('#cleanup-marked-preview-button');
const cleanupCleanOutputButton = document.querySelector('#cleanup-clean-output-button');
const copyCleanupResultButton = document.querySelector('#copy-cleanup-result-button');
const cleanupCopyStatus = document.querySelector('#cleanup-copy-status');
const applyCleanupButton = document.querySelector('#apply-cleanup-button');
const cancelCleanupButton = document.querySelector('#cancel-cleanup-button');
const cleanerSource = document.querySelector('#cleaner-source');
const cleanerToolContent = document.querySelector('#cleaner-tool-content');
const toolPlaceholderMessage = document.querySelector('#tool-placeholder-message');
const taggerToolContent = document.querySelector('#tagger-tool-content');
const taggerImageInput = document.querySelector('#tagger-image');
const taggerOptimizeUpload = document.querySelector('#tagger-optimize-upload');
const taggerDropZone = document.querySelector('.tagger-image-preview');
const runTaggerButton = document.querySelector('#run-tagger-button');
const taggerStatus = document.querySelector('#tagger-status');
const taggerResults = document.querySelector('#tagger-results');
const resetTaggerThresholdsButton = document.querySelector('#reset-tagger-thresholds-button');
const taggerFeatureFilterSummary = document.querySelector('#tagger-feature-filter-summary');
const taggerFeatureFilters = [...document.querySelectorAll('[data-tagger-feature]')];
const taggerScoreBrowser = document.querySelector('#tagger-score-browser');
const taggerScoreSearch = document.querySelector('#tagger-score-search');
const taggerScoreRows = document.querySelector('#tagger-score-rows');
const taggerScoreCount = document.querySelector('#tagger-score-count');
const taggerScoreEmpty = document.querySelector('#tagger-score-empty');
const taggerOutputCount = document.querySelector('#tagger-output-count');
const taggerOutputPreview = document.querySelector('#tagger-output-preview');
const taggerSortMode = document.querySelector('#tagger-sort-mode');
const taggerKeepUnderscores = document.querySelector('#tagger-keep-underscores');
const taggerArtistPrefix = document.querySelector('#tagger-artist-prefix');
const copyAllTaggerTagsButton = document.querySelector('#copy-all-tagger-tags-button');
const appendTaggerTagsButton = document.querySelector('#append-tagger-tags-button');
const taggerImagePreview = document.querySelector('#tagger-image-preview');
const taggerImagePlaceholder = document.querySelector('#tagger-image-placeholder');
const taggerStats = document.querySelector('#tagger-stats');
const removeTaggerImageButton = document.querySelector('#remove-tagger-image-button');
const cleanupTagsContainer = document.querySelector('#cleanup-tags');
const cleanupBlockedTerms = document.querySelector('#cleanup-blocked-terms');

let taggerPreviewUrl = null;
let cleanupSource = '';
let cleanupResult = '';
let cleanupOutputMode = 'marked';
let copyToastTimer;
let copyToastHideTimer;

function showCopyToast(message) {
  clearTimeout(copyToastTimer);
  clearTimeout(copyToastHideTimer);
  copyToast.textContent = message;
  copyToast.hidden = false;
  copyToast.classList.remove('is-visible');
  requestAnimationFrame(() => copyToast.classList.add('is-visible'));

  copyToastTimer = setTimeout(() => {
    copyToast.classList.remove('is-visible');
    copyToastHideTimer = setTimeout(() => {
      copyToast.hidden = true;
    }, 180);
  }, 2200);
}

const taggerCategories = {
  general: { label: 'General', defaultThreshold: 0.17, threshold: 0.17 },
  character: { label: 'Character', defaultThreshold: 0.27, threshold: 0.27 },
  style: { label: 'Style', defaultThreshold: 0.15, threshold: 0.15 },
  copyright: { label: 'Copyright', defaultThreshold: 0.24, threshold: 0.24 },
  meta: { label: 'Metadata', defaultThreshold: 0.17, threshold: 0.17 },
  rating: { label: 'Rating', defaultThreshold: 0.41, threshold: 0.41 },
};

const TAGGER_PREFERENCES_KEY = 'prompt-lab-studio-tagger-preferences';
const TAGGER_OPTIMIZE_KEY = 'prompt-lab-studio-tagger-optimize-upload';
const TAGGER_FORMAT_PREFERENCES_KEY = 'prompt-lab-studio-tagger-format-preferences';
const TAGGER_FEATURE_FILTERS_KEY = 'prompt-lab-studio-tagger-feature-filters';

const taggerFeatureTerms = {
  'eye-color': new Set([
    'blue_eyes', 'red_eyes', 'green_eyes', 'brown_eyes', 'purple_eyes',
    'yellow_eyes', 'pink_eyes', 'orange_eyes', 'black_eyes', 'grey_eyes',
    'gray_eyes', 'aqua_eyes', 'amber_eyes', 'heterochromia', 'multicolored_eyes',
    'gradient_eyes', 'empty_eyes', 'glowing_eyes',
  ]),
  'hair-color': new Set([
    'black_hair', 'blonde_hair', 'blue_hair', 'red_hair', 'brown_hair',
    'green_hair', 'pink_hair', 'purple_hair', 'white_hair', 'grey_hair',
    'gray_hair', 'orange_hair', 'aqua_hair', 'silver_hair', 'multicolored_hair',
    'two-tone_hair', 'gradient_hair', 'streaked_hair', 'colored_inner_hair',
  ]),
  hairstyle: new Set([
    'long_hair', 'short_hair', 'very_long_hair', 'medium_hair', 'ahoge',
    'twintails', 'ponytail', 'side_ponytail', 'braid', 'braided_ponytail',
    'drill_hair', 'bob_cut', 'hime_cut', 'wavy_hair', 'curly_hair',
    'straight_hair', 'bangs', 'blunt_bangs', 'sidelocks', 'hair_bun',
    'single_braid', 'low_twintails', 'high_ponytail', 'spiky_hair',
  ]),
  'dark-skin': new Set([
    'dark_skin', 'dark-skinned_female', 'dark-skinned_male', 'tan',
    'tanned_skin', 'tanlines', 'brown_skin', 'dark_skinned_female',
    'dark_skinned_male',
  ]),
  kemonomimi: new Set([
    'animal_ears', 'cat_ears', 'fox_ears', 'dog_ears', 'wolf_ears',
    'bunny_ears', 'rabbit_ears', 'horse_ears', 'deer_ears', 'mouse_ears',
    'animal_tail', 'cat_tail', 'fox_tail', 'dog_tail', 'wolf_tail',
    'kemonomimi', 'nekomimi', 'kitsune',
  ]),
  elf: new Set(['elf', 'dark_elf', 'pointy_ears', 'long_pointy_ears', 'elf_ears']),
  angelic: new Set([
    'angel', 'halo', 'angel_wings', 'feathered_wings', 'white_wings',
    'seraph', 'angelic',
  ]),
  demonic: new Set([
    'demon', 'demon_girl', 'demon_boy', 'demon_horns', 'horns',
    'demon_tail', 'bat_wings', 'succubus', 'incubus', 'demonic',
  ]),
};

function getTaggerFeatureFamilies(rawTag) {
  const normalizedTag = rawTag.toLocaleLowerCase().replace(/ /g, '_');
  return Object.entries(taggerFeatureTerms)
    .filter(([, terms]) => terms.has(normalizedTag))
    .map(([family]) => family);
}

function isTaggerFeatureAllowed(option) {
  return (option.dataset.featureFamilies ?? '')
    .split(' ')
    .filter(Boolean)
    .every((family) =>
      taggerFeatureFilters.find((input) => input.dataset.taggerFeature === family)?.checked !== false,
    );
}

function updateTaggerFeatureFilterSummary() {
  const blockedCount = taggerFeatureFilters.filter((input) => !input.checked).length;
  taggerFeatureFilterSummary.textContent = blockedCount
    ? `Blocking ${blockedCount} categories`
    : 'All categories allowed';
}

function saveTaggerFeatureFilters() {
  try {
    const preferences = Object.fromEntries(
      taggerFeatureFilters.map((input) => [input.dataset.taggerFeature, input.checked]),
    );
    localStorage.setItem(TAGGER_FEATURE_FILTERS_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Unable to save Tagger feature filters:', error);
    taggerStatus.textContent = 'Filters were applied but could not be saved. They may reset after you refresh.';
  }
}

try {
  const savedFeatureFilters = localStorage.getItem(TAGGER_FEATURE_FILTERS_KEY);
  if (savedFeatureFilters !== null) {
    const preferences = JSON.parse(savedFeatureFilters);
    if (!preferences || typeof preferences !== 'object' || Array.isArray(preferences)) {
      throw new Error('Saved Tagger feature filters are invalid.');
    }
    taggerFeatureFilters.forEach((input) => {
      if (typeof preferences[input.dataset.taggerFeature] === 'boolean') {
        input.checked = preferences[input.dataset.taggerFeature];
      }
    });
  }
} catch (error) {
  console.error('Unable to load Tagger feature filters:', error);
}

taggerFeatureFilters.forEach((input) => {
  input.addEventListener('change', () => {
    saveTaggerFeatureFilters();
    updateTaggerFeatureFilterSummary();
    updateTaggerAppendButton();
    taggerResults.querySelectorAll('.tagger-category').forEach(updateTaggerCategory);
  });
});

updateTaggerFeatureFilterSummary();

try {
  const savedFormatPreferences = localStorage.getItem(TAGGER_FORMAT_PREFERENCES_KEY);
  if (savedFormatPreferences !== null) {
    const preferences = JSON.parse(savedFormatPreferences);
    if (!preferences || typeof preferences !== 'object' || Array.isArray(preferences)) {
      throw new Error('Saved Tagger format preferences are invalid.');
    }

    taggerKeepUnderscores.checked = preferences.keepUnderscores === true;
    taggerArtistPrefix.checked = preferences.artistPrefix === true;
  }
} catch (error) {
  console.error('Unable to load Tagger format preferences:', error);
}

function formatTaggerTag(rawTag, category) {
  const tag = taggerKeepUnderscores.checked
    ? rawTag
    : rawTag.replace(/_/g, ' ');

  if (category === 'style' && taggerArtistPrefix.checked && !/^artist:/i.test(tag)) {
    return `artist:${tag}`;
  }
  return tag;
}

function saveTaggerFormatPreferences() {
  try {
    localStorage.setItem(TAGGER_FORMAT_PREFERENCES_KEY, JSON.stringify({
      keepUnderscores: taggerKeepUnderscores.checked,
      artistPrefix: taggerArtistPrefix.checked,
    }));
  } catch (error) {
    console.error('Unable to save Tagger format preferences:', error);
    taggerStatus.textContent = 'Output format was updated but could not be saved. It may reset after you refresh.';
  }
}

function updateTaggerFormat() {
  taggerResults.querySelectorAll('.tagger-category').forEach((group) => {
    const category = group.dataset.category;
    group.querySelectorAll('.tagger-tag-option').forEach((option) => {
      const checkbox = option.querySelector('input[type="checkbox"]');
      const formattedTag = formatTaggerTag(checkbox.dataset.rawTag, category);
      checkbox.value = formattedTag;
      option.querySelector('.tagger-tag-name').textContent = formattedTag;
    });
    sortTaggerCategory(group);
  });

  taggerScoreRows.querySelectorAll('tr').forEach((row) => {
    const formattedTag = formatTaggerTag(row.dataset.rawTag, row.dataset.category);
    row.querySelector('.tagger-score-name').textContent = formattedTag;
    row.dataset.searchText =
      `${row.dataset.rawTag} ${formattedTag} ${row.dataset.category}`.toLocaleLowerCase();
  });
  updateTaggerAppendButton();
}

taggerKeepUnderscores.addEventListener('change', () => {
  saveTaggerFormatPreferences();
  updateTaggerFormat();
});

taggerArtistPrefix.addEventListener('change', () => {
  saveTaggerFormatPreferences();
  updateTaggerFormat();
});

try {
  const savedOptimizeSetting = localStorage.getItem(TAGGER_OPTIMIZE_KEY);
  if (savedOptimizeSetting !== null) {
    taggerOptimizeUpload.checked = savedOptimizeSetting === 'true';
  }
} catch (error) {
  console.error('Unable to load Tagger upload preference:', error);
}

taggerOptimizeUpload.addEventListener('change', () => {
  try {
    localStorage.setItem(TAGGER_OPTIMIZE_KEY, String(taggerOptimizeUpload.checked));
  } catch (error) {
    console.error('Unable to save Tagger upload preference:', error);
    taggerStatus.textContent = 'Upload settings were applied but could not be saved. They may reset after you refresh.';
  }
});

async function optimizeTaggerImage(image) {
  const bitmap = await createImageBitmap(image);

  try {
    const maxDimension = 1536;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser could not create an image-processing canvas.');

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const optimizedBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('This browser could not create the optimized image.'));
          return;
        }
        if (blob.type !== 'image/webp') {
          reject(new Error('This browser does not support WebP image optimization.'));
          return;
        }
        resolve(blob);
      }, 'image/webp', 0.92);
    });

    if (scale === 1 && optimizedBlob.size >= image.size) return image;

    const fileName = `${image.name.replace(/\.[^.]+$/, '') || 'tagger-image'}.webp`;
    return new File([optimizedBlob], fileName, { type: 'image/webp' });
  } finally {
    bitmap.close();
  }
}

function loadTaggerThresholds() {
  try {
    const savedPreferences = localStorage.getItem(TAGGER_PREFERENCES_KEY);
    if (!savedPreferences) return;

    const parsedPreferences = JSON.parse(savedPreferences);
    if (!parsedPreferences || typeof parsedPreferences !== 'object' || Array.isArray(parsedPreferences)) {
      throw new Error('Saved tagger preferences are not a valid object.');
    }

    for (const [category, config] of Object.entries(taggerCategories)) {
      const savedThreshold = parsedPreferences[category];
      if (savedThreshold === undefined) continue;
      if (typeof savedThreshold !== 'number' || savedThreshold < 0.01 || savedThreshold > 0.99) {
        throw new Error(`Saved threshold for ${category} is invalid.`);
      }

      config.threshold = savedThreshold;
    }
  } catch (error) {
    console.error('Unable to load Tagger threshold preferences:', error);
  }
}

function saveTaggerThresholds() {
  try {
    const thresholds = Object.fromEntries(
      Object.entries(taggerCategories).map(([category, config]) => [
        category,
        config.threshold,
      ]),
    );
    localStorage.setItem(TAGGER_PREFERENCES_KEY, JSON.stringify(thresholds));
    return true;
  } catch (error) {
    console.error('Unable to save Tagger threshold preferences:', error);
    taggerStatus.textContent = 'Thresholds were applied but could not be saved. Check browser storage permissions.';
    return false;
  }
}

loadTaggerThresholds();

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  toolMenu.hidden = isExpanded;
});

const toolNames = {
  editor: 'Prompt Editor',
  cleaner: 'Prompt Cleaner',
  tagger: 'Prompt Tagger',
  categorizer: 'Tag Categorizer',
  diff: 'Prompt Diff',
  weights: 'Weight Manager',
  batch: 'Batch Processor',
};

toolMenu.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-tool]');

  if (!button) return;

  const toolName = toolNames[button.dataset.tool];

  if (!toolName) return;

const isEditor = button.dataset.tool === 'editor';
const isCleaner = button.dataset.tool === 'cleaner';
const isTagger = button.dataset.tool === 'tagger';

workspace.hidden = !isEditor;
toolPlaceholder.hidden = isEditor;
cleanerToolContent.hidden = !isCleaner;
taggerToolContent.hidden = !isTagger;
toolPlaceholderMessage.hidden = isCleaner || isTagger;

if (!isEditor) {
  toolPlaceholderTitle.textContent = toolName;
}

  toolMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
});

taggerImageInput.addEventListener('change', () => {
  const image = taggerImageInput.files?.[0];

  runTaggerButton.disabled = !image;
  taggerResults.replaceChildren();
  taggerScoreBrowser.hidden = true;
  taggerScoreRows.replaceChildren();
  taggerScoreSearch.value = '';
  updateTaggerAppendButton();

  if (taggerPreviewUrl) {
    URL.revokeObjectURL(taggerPreviewUrl);
    taggerPreviewUrl = null;
  }

  if (image) {
    taggerPreviewUrl = URL.createObjectURL(image);
    taggerImagePreview.src = taggerPreviewUrl;
    taggerImagePreview.hidden = false;
    taggerImagePlaceholder.hidden = true;
  } else {
    taggerImagePreview.removeAttribute('src');
    taggerImagePreview.hidden = true;
    taggerImagePlaceholder.hidden = false;
  }
  removeTaggerImageButton.hidden = !image;

  taggerStats.textContent = 'No tags generated yet';
  taggerStatus.textContent = image
    ? 'Image selected. Ready to generate tags.'
    : 'Select an image to get started.';
});
removeTaggerImageButton.addEventListener('click', () => {
  taggerImageInput.value = '';
  taggerImageInput.dispatchEvent(new Event('change', { bubbles: true }));
});

taggerDropZone.addEventListener('dragenter', (event) => {
  if (!event.dataTransfer?.types.includes('Files')) return;
  event.preventDefault();
  taggerDropZone.classList.add('is-dragging');
});

taggerDropZone.addEventListener('dragover', (event) => {
  if (!event.dataTransfer?.types.includes('Files')) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
  taggerDropZone.classList.add('is-dragging');
});

taggerDropZone.addEventListener('dragleave', (event) => {
  if (taggerDropZone.contains(event.relatedTarget)) return;
  taggerDropZone.classList.remove('is-dragging');
});

taggerDropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  taggerDropZone.classList.remove('is-dragging');

  const droppedFile = [...(event.dataTransfer?.files ?? [])]
    .find((file) => file.type.startsWith('image/'));

  if (!droppedFile) {
    taggerStatus.textContent = 'Drop an image file such as PNG, JPG, or WEBP.';
    return;
  }

  const transfer = new DataTransfer();
  transfer.items.add(droppedFile);
  taggerImageInput.files = transfer.files;
  taggerImageInput.dispatchEvent(new Event('change', { bubbles: true }));
});

taggerToolContent.addEventListener('paste', (event) => {
  const items = event.clipboardData?.items;
  const imageItem = [...(items ?? [])].find((item) =>
    item.type.startsWith('image/'),
  );
  const pastedImage = imageItem?.getAsFile();

  if (!pastedImage) return;

  event.preventDefault();

  const transfer = new DataTransfer();
  transfer.items.add(
    new File([pastedImage], pastedImage.name || 'pasted-image.png', {
      type: pastedImage.type,
    }),
  );

  taggerImageInput.files = transfer.files;
  taggerImageInput.dispatchEvent(new Event('change', { bubbles: true }));
});
runTaggerButton.addEventListener('click', async () => {
  const image = taggerImageInput.files?.[0];

  if (!image) return;

  runTaggerButton.disabled = true;
  appendTaggerTagsButton.disabled = true;
  taggerResults.replaceChildren();
  taggerStatus.textContent = 'Connecting to PixAI and processing the image. Please wait...';

  try {
    const uploadImage = taggerOptimizeUpload.checked
      ? await optimizeTaggerImage(image)
      : image;
    const optimizationMessage = uploadImage === image
      ? 'Using original image'
      : `Optimized upload: ${(image.size / 1024 / 1024).toFixed(2)} MB → ${(uploadImage.size / 1024 / 1024).toFixed(2)} MB`;

    taggerStatus.textContent = `${optimizationMessage}; connecting to PixAI and processing the image. Please wait...`;
    const client = await Client.connect('pixai-labs/pixai-tagger-demo');
    const result = await client.predict('/tag', {
      image: await handle_file(uploadImage),
      include_scores: true,
      keep_underscores: false,
      combined_categories: [
        'general', 'character', 'style',
        'copyright', 'meta', 'rating',
      ],
      param_4: 0.01,
      param_5: 0.01,
      param_6: 0.01,
      param_7: 0.01,
      param_8: 0.01,
      param_9: 0.01,
    });

    const categories = result.data?.[8];

    if (!categories || typeof categories !== 'object') {
      throw new Error('The API returned data in an unexpected format.');
    }

    let checkboxCount = 0;
    const scoredTags = [];

    for (const [category, tags] of Object.entries(categories)) {
      if (!tags || typeof tags !== 'object') continue;

      const entries = Object.entries(tags);
      if (entries.length === 0) continue;
      entries.forEach(([rawTag, score]) => {
        if (typeof score !== 'number' || !Number.isFinite(score)) {
          throw new Error(`Invalid confidence score for "${rawTag}".`);
        }
        scoredTags.push({
          rawTag,
          category,
          score,
          formattedTag: formatTaggerTag(rawTag, category),
        });
      });

      const group = document.createElement('section');
      group.className = 'tagger-category';
      group.dataset.category = category;
      group.dataset.threshold = String(taggerCategories[category]?.threshold ?? 0.17);

      const groupHeader = document.createElement('div');
      groupHeader.className = 'tagger-category-header';
      const heading = document.createElement('h3');
      heading.textContent = taggerCategories[category]?.label ?? category;

      const groupActions = document.createElement('div');
      groupActions.className = 'tagger-category-actions';

      const selectVisibleButton = document.createElement('button');
      selectVisibleButton.type = 'button';
      selectVisibleButton.className = 'tagger-select-visible';
      selectVisibleButton.textContent = 'Select all visible';
      selectVisibleButton.addEventListener('click', () => {
        group.querySelectorAll('.tagger-tag-option:not([hidden]) input[type="checkbox"]')
          .forEach((checkbox) => {
            checkbox.checked = true;
          });
        updateTaggerCategory(group);
        updateTaggerAppendButton();
      });

      const deselectVisibleButton = document.createElement('button');
      deselectVisibleButton.type = 'button';
      deselectVisibleButton.className = 'tagger-deselect-visible';
      deselectVisibleButton.textContent = 'Deselect all';
      deselectVisibleButton.addEventListener('click', () => {
        group.querySelectorAll('.tagger-tag-option:not([hidden]) input[type="checkbox"]')
          .forEach((checkbox) => {
            checkbox.checked = false;
          });
        updateTaggerCategory(group);
        updateTaggerAppendButton();
      });

      const copyGroupButton = document.createElement('button');
      copyGroupButton.type = 'button';
      copyGroupButton.className = 'tagger-copy-group';
      copyGroupButton.textContent = 'Copy group (0)';
      copyGroupButton.disabled = true;
      copyGroupButton.addEventListener('click', async () => {
        const selectedTags = [...group.querySelectorAll('.tagger-tag-option:not([hidden])')]
          .filter(isTaggerFeatureAllowed)
          .map((option) => option.querySelector('input[type="checkbox"]'))
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value);

        try {
          if (!navigator.clipboard?.writeText) {
            throw new Error('Clipboard access is unavailable in this browser context.');
          }

          await navigator.clipboard.writeText(selectedTags.join(', '));
          showCopyToast(
            `Copied ${selectedTags.length} ${taggerCategories[category]?.label ?? category} tags`,
          );
        } catch (error) {
          taggerStatus.textContent = 'Copy failed. Check your browser clipboard permissions and try again.';
          console.error('Failed to copy tag category:', error);
        }
      });

      groupActions.append(selectVisibleButton, deselectVisibleButton, copyGroupButton);
      groupHeader.append(heading, groupActions);
      group.append(groupHeader);

      const thresholdControl = document.createElement('div');
      thresholdControl.className = 'tagger-threshold-control';

      const thresholdHeader = document.createElement('div');
      thresholdHeader.className = 'tagger-threshold-header';

      const thresholdLabel = document.createElement('label');
      thresholdLabel.textContent = 'Confidence threshold';

      const thresholdValue = document.createElement('output');
      const initialThreshold = Number(group.dataset.threshold);
      thresholdValue.value = initialThreshold.toFixed(2);
      thresholdValue.textContent = initialThreshold.toFixed(2);

      const threshold = document.createElement('input');
      threshold.type = 'range';
      threshold.className = 'tagger-threshold-slider';
      threshold.id = `tagger-threshold-${category}`;
      threshold.min = '0.01';
      threshold.max = '0.99';
      threshold.step = '0.01';
      threshold.value = String(initialThreshold);
      threshold.setAttribute('aria-label', `${heading.textContent} confidence threshold`);
      thresholdLabel.htmlFor = threshold.id;
      thresholdLabel.append(thresholdValue);
      thresholdHeader.append(thresholdLabel);
      const thresholdCount = document.createElement('span');
      thresholdCount.className = 'tagger-threshold-count';
      thresholdControl.append(thresholdHeader, threshold, thresholdCount);
      group.append(thresholdControl);

      const tagList = document.createElement('div');
      tagList.className = 'tagger-category-tags';

      for (const [rawTag, score] of entries) {
        if (typeof score !== 'number' || !Number.isFinite(score)) {
          throw new Error(`Invalid confidence score for "${rawTag}".`);
        }

        const tag = formatTaggerTag(rawTag, category);
        const label = document.createElement('label');
        label.className = 'tagger-tag-option';
        label.dataset.featureFamilies = getTaggerFeatureFamilies(rawTag).join(' ');
        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';
        checkbox.value = tag;
        checkbox.checked = true;
        checkbox.dataset.rawTag = rawTag;
        checkbox.dataset.score = String(score);
        checkbox.addEventListener('change', () => {
          updateTaggerCategory(group);
          updateTaggerAppendButton();
        });

        const tagName = document.createElement('span');
        tagName.className = 'tagger-tag-name';
        tagName.textContent = tag;
        const scoreLabel = document.createElement('span');
        scoreLabel.className = 'tagger-tag-score';
        scoreLabel.textContent = score.toFixed(2);
        label.append(checkbox, tagName, scoreLabel);
        tagList.append(label);
        checkboxCount += 1;
      }

      threshold.addEventListener('input', () => {
        const value = Number(threshold.value);
        group.dataset.threshold = String(value);
        if (taggerCategories[category]) {
          taggerCategories[category].threshold = value;
          saveTaggerThresholds();
        }
        thresholdValue.value = value.toFixed(2);
        thresholdValue.textContent = value.toFixed(2);
        updateTaggerCategory(group);
        updateTaggerAppendButton();
      });

      group.append(tagList);
      taggerResults.append(group);
      sortTaggerCategory(group);
      updateTaggerCategory(group);
    }

    if (checkboxCount === 0) {
      taggerStatus.textContent = 'The API did not return any usable tags.';
      return;
    }

    taggerStatus.textContent = `Tagging complete. ${optimizationMessage}`;
    const apiSummary = typeof result.data[7] === 'string' ? result.data[7] : '';
const duration = apiSummary.match(/·\s*(.+)$/)?.[1];

taggerStats.textContent =
  `${checkboxCount} tags${duration ? ` · ${duration}` : ''}`;
renderTaggerScoreBrowser(scoredTags);
updateTaggerAppendButton();
  } catch (error) {
    console.error('PixAI tagger failed:', error);
    taggerStatus.textContent = `Tagging failed: ${
      error instanceof Error ? error.message : 'Unknown error'
    }`;
  } finally {
    runTaggerButton.disabled = !taggerImageInput.files?.length;
  }
});

resetTaggerThresholdsButton.addEventListener('click', () => {
  for (const config of Object.values(taggerCategories)) {
    config.threshold = config.defaultThreshold;
  }

  const preferencesSaved = saveTaggerThresholds();
  taggerResults.querySelectorAll('.tagger-category').forEach((group) => {
    const category = group.dataset.category;
    const threshold = taggerCategories[category]?.threshold;
    if (threshold === undefined) return;

    const slider = group.querySelector('.tagger-threshold-slider');
    const output = group.querySelector('.tagger-threshold-header output');
    group.dataset.threshold = String(threshold);
    slider.value = String(threshold);
    output.value = threshold.toFixed(2);
    output.textContent = threshold.toFixed(2);
    updateTaggerCategory(group);
  });
  updateTaggerAppendButton();
  if (preferencesSaved) showCopyToast('Default confidence thresholds restored');
});

function updateTaggerCategory(group) {
  const threshold = Number(group.dataset.threshold);
  const options = group.querySelectorAll('.tagger-tag-option');
  let visibleCount = 0;

  options.forEach((label) => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    label.hidden = Number(checkbox.dataset.score) < threshold;
    if (!label.hidden) visibleCount += 1;
  });

  group.querySelector('.tagger-threshold-count').textContent =
    `${visibleCount} / ${options.length} above threshold`;

  const selectedVisibleCount = [...options].filter((label) => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    return !label.hidden && checkbox.checked && isTaggerFeatureAllowed(label);
  }).length;
  const copyButton = group.querySelector('.tagger-copy-group');
  copyButton.textContent = `Copy group (${selectedVisibleCount})`;
  copyButton.disabled = selectedVisibleCount === 0;
}

function sortTaggerCategory(group) {
  const tagList = group.querySelector('.tagger-category-tags');
  const options = [...tagList.querySelectorAll('.tagger-tag-option')];

  options.sort((first, second) => {
    if (taggerSortMode.value !== 'confidence') {
      return first.querySelector('span').textContent.localeCompare(
        second.querySelector('span').textContent,
      );
    }

    return Number(second.querySelector('input').dataset.score)
      - Number(first.querySelector('input').dataset.score);
  });

  tagList.append(...options);
}

taggerSortMode.addEventListener('change', () => {
  if (taggerSortMode.value !== 'global-alphabetical') {
    taggerResults.querySelectorAll('.tagger-category').forEach(sortTaggerCategory);
  }
  updateTaggerAppendButton();
});

taggerScoreSearch.addEventListener('input', () => {
  const query = taggerScoreSearch.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  taggerScoreRows.querySelectorAll('tr').forEach((row) => {
    const matches = row.dataset.searchText.includes(query);
    row.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  taggerScoreEmpty.hidden = visibleCount !== 0;
});

function renderTaggerScoreBrowser(scoredTags) {
  taggerScoreRows.replaceChildren();
  const sortedTags = [...scoredTags].sort((first, second) => second.score - first.score);

  sortedTags.forEach((tag) => {
    const row = document.createElement('tr');
    row.dataset.rawTag = tag.rawTag;
    row.dataset.category = tag.category;
    row.dataset.searchText = `${tag.rawTag} ${tag.formattedTag} ${tag.category}`.toLocaleLowerCase();

    const name = document.createElement('td');
    name.className = 'tagger-score-name';
    name.textContent = tag.formattedTag;
    const category = document.createElement('td');
    category.textContent = taggerCategories[tag.category]?.label ?? tag.category;
    const score = document.createElement('td');
    score.textContent = tag.score.toFixed(4);

    row.append(name, category, score);
    taggerScoreRows.append(row);
  });

  taggerScoreCount.textContent = `${sortedTags.length} tags · sorted by confidence`;
  taggerScoreEmpty.hidden = sortedTags.length !== 0;
  taggerScoreBrowser.hidden = false;
}

function updateTaggerAppendButton() {
  const checkedVisibleTags = getSelectedVisibleTagCheckboxes();
  const selectedTags = checkedVisibleTags.map((checkbox) => checkbox.value);
  const hasTags = selectedTags.length > 0;

  appendTaggerTagsButton.disabled = !hasTags;
  copyAllTaggerTagsButton.disabled = !hasTags;
  taggerOutputCount.textContent = `${selectedTags.length} selected tags available to copy`;
  taggerOutputPreview.textContent = hasTags
    ? selectedTags.join(', ')
    : translateUiText('Selected tags will appear here.');
}

function getSelectedVisibleTagCheckboxes() {
  const checkboxes = [...taggerResults.querySelectorAll('input[type="checkbox"]:checked')]
    .filter((checkbox) => {
      const option = checkbox.closest('.tagger-tag-option');
      return !option.hidden && isTaggerFeatureAllowed(option);
    });

  if (taggerSortMode.value === 'confidence') {
    return checkboxes.sort((first, second) =>
      Number(second.dataset.score) - Number(first.dataset.score),
    );
  }

  if (taggerSortMode.value === 'global-alphabetical') {
    return checkboxes.sort((first, second) => first.value.localeCompare(second.value));
  }

  return checkboxes;
}

copyAllTaggerTagsButton.addEventListener('click', async () => {
  const selectedTags = getSelectedVisibleTagCheckboxes().map((checkbox) => checkbox.value);
  if (selectedTags.length === 0) return;

  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error('Clipboard access is unavailable in this browser context.');
    }

    await navigator.clipboard.writeText(selectedTags.join(', '));
    showCopyToast(`Copied all ${selectedTags.length} selected tags`);
  } catch (error) {
    taggerStatus.textContent = 'Copy failed. Check your browser clipboard permissions and try again.';
    console.error('Failed to copy all selected tagger tags:', error);
  }
});

function overwritePromptWithSelectedTaggerTags(selectedTags) {
  if (selectedTags.length === 0) return;

  promptSource.value = selectedTags.join(', ');
  promptSource.dispatchEvent(new Event('input', { bubbles: true }));
}

appendTaggerTagsButton.addEventListener('click', () => {
  const selectedTags = getSelectedVisibleTagCheckboxes()
    .map((checkbox) => checkbox.value);
  if (selectedTags.length === 0) return;

  pendingTaggerTags = selectedTags;
  pendingDocumentAction = 'tagger-overwrite';
  openConfirmModal();
});

let cleanupEditorSource = '';
let cleanupTags = [];
const blockedTerms = [];

function getBlockingTerm(text) {
  const tag = text.trim();

  return blockedTerms.find((term) => !term.fuzzy && tag === term.value)
    ?? blockedTerms.find((term) => term.fuzzy && tag.includes(term.value));
}

function isBlockedTag(text) {
  return Boolean(getBlockingTerm(text));
}

function renderCleanupResult() {
  const keptTags = cleanupTags.filter((tag) => !isBlockedTag(tag.text));

  cleanupResult = keptTags
    .map((tag, index) =>
      index === 0
        ? tag.text.replace(/^\s+/, '')
        : `${tag.separatorBefore}${tag.text}`,
    )
    .join('');

  cleanupResultView.replaceChildren();

  if (cleanupOutputMode === 'clean') {
    cleanupResultView.textContent = cleanupResult;
    return;
  }

  cleanupTags.forEach((tag, index) => {
    if (index > 0) {
      cleanupResultView.append(document.createTextNode(tag.separatorBefore));
    }

    const span = document.createElement('span');
    span.textContent = index === 0 ? tag.text.replace(/^\s+/, '') : tag.text;

    const blockingTerm = getBlockingTerm(tag.text);
    if (blockingTerm) {
      span.classList.add(
        'cleanup-result-blocked',
        blockingTerm.fuzzy ? 'is-fuzzy' : 'is-exact',
      );
    }

    cleanupResultView.append(span);
  });
}

function renderCleanupTags() {
  cleanupTagsContainer.replaceChildren();

  cleanupTags.forEach((tag) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cleanup-tag';
    button.textContent = tag.text.trim() || '(empty tag)';
    const blockingTerm = getBlockingTerm(tag.text);
    button.classList.toggle('is-blocked-exact', Boolean(blockingTerm && !blockingTerm.fuzzy));
    button.classList.toggle('is-blocked-fuzzy', Boolean(blockingTerm && blockingTerm.fuzzy));
    button.setAttribute('aria-pressed', String(Boolean(blockingTerm)));
    button.addEventListener('click', () => {
      const value = tag.text.trim();
      if (!value || blockedTerms.some((term) => term.value === value)) return;

      blockedTerms.push({ value, fuzzy: false });
      renderBlockedTerms();
      renderCleanupTags();
      renderCleanupResult();
    });

    cleanupTagsContainer.append(button);
  });
}

function renderBlockedTerms() {
  cleanupBlockedTerms.replaceChildren();

  blockedTerms.forEach((term) => {
    const row = document.createElement('div');
    row.className = 'cleanup-blocked-term';

    const text = document.createElement('span');
    text.className = 'cleanup-blocked-tag';
    text.textContent = term.value;

    const modes = document.createElement('div');
    modes.className = 'cleanup-match-modes';
    modes.setAttribute('aria-label', `${term.value} matching mode`);

    const exact = document.createElement('button');
    exact.type = 'button';
    exact.className = 'cleanup-mode-exact';
    exact.textContent = 'Exact';
    exact.setAttribute('aria-pressed', String(!term.fuzzy));
    exact.classList.toggle('is-active', !term.fuzzy);
    exact.addEventListener('click', () => {
      term.fuzzy = false;
      renderBlockedTerms();
      renderCleanupTags();
      renderCleanupResult();
    });

    const fuzzy = document.createElement('button');
    fuzzy.type = 'button';
    fuzzy.className = 'cleanup-mode-fuzzy';
    fuzzy.textContent = 'Fuzzy';
    fuzzy.setAttribute('aria-pressed', String(term.fuzzy));
    fuzzy.classList.toggle('is-active', term.fuzzy);
    fuzzy.addEventListener('click', () => {
      term.fuzzy = true;
      renderBlockedTerms();
      renderCleanupTags();
      renderCleanupResult();
    });

    modes.append(exact, fuzzy);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'cleanup-block-remove';
    remove.setAttribute('aria-label', `Remove blocked term ${term.value}`);
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      blockedTerms.splice(blockedTerms.indexOf(term), 1);
      renderBlockedTerms();
      renderCleanupTags();
      renderCleanupResult();
    });

    row.append(text, modes, remove);
    cleanupBlockedTerms.append(row);
  });
}

function buildCleanupPreview() {
  cleanupSource = cleanerSource.value;
  cleanupEditorSource = promptSource.value;

  const seen = new Set();
  let separatorBefore = '';
  cleanupTags = [];

  for (const part of cleanupSource.split(/(,\s*)/)) {
    if (/^,\s*$/.test(part)) {
      separatorBefore = part;
      continue;
    }

    const key = part.trim();
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);

    cleanupTags.push({
      text: part,
      separatorBefore,
    });
    separatorBefore = '';
  }

  cleanupOriginal.textContent = cleanupSource;
  renderCleanupTags();
  cleanupOutputMode = 'marked';
  cleanupMarkedPreviewButton.setAttribute('aria-pressed', 'true');
  cleanupCleanOutputButton.setAttribute('aria-pressed', 'false');
  cleanupCopyStatus.textContent = '';
  renderCleanupResult();
  cleanupPreview.hidden = false;
}

analyzeCleanupButton.addEventListener('click', buildCleanupPreview);
cleanerSource.addEventListener('input', buildCleanupPreview);

cleanupMarkedPreviewButton.addEventListener('click', () => {
  cleanupOutputMode = 'marked';
  cleanupMarkedPreviewButton.setAttribute('aria-pressed', 'true');
  cleanupCleanOutputButton.setAttribute('aria-pressed', 'false');
  renderCleanupResult();
});

cleanupCleanOutputButton.addEventListener('click', () => {
  cleanupOutputMode = 'clean';
  cleanupMarkedPreviewButton.setAttribute('aria-pressed', 'false');
  cleanupCleanOutputButton.setAttribute('aria-pressed', 'true');
  renderCleanupResult();
});

copyCleanupResultButton.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error('Clipboard access is unavailable in this browser context.');
    }

    await navigator.clipboard.writeText(cleanupResult);
    cleanupCopyStatus.textContent = '';
    showCopyToast('Cleaned result copied');
  } catch (error) {
    cleanupCopyStatus.textContent = 'Copy failed. Check your browser clipboard permissions and try again.';
    console.error('Failed to copy the cleaned prompt:', error);
  }
});

function applyCleanupToPrompt(cleanedPrompt) {
  promptSource.value = cleanedPrompt;
  promptSource.dispatchEvent(new Event('input', { bubbles: true }));
  cleanupPreview.hidden = true;
}

applyCleanupButton.addEventListener('click', () => {
  if (promptSource.value !== cleanupEditorSource) {
    showFileMessage('Prompt changed. Check duplicates again before applying.', true);
    cleanupPreview.hidden = true;
    return;
  }

  pendingCleanupPrompt = cleanupResult;
  pendingDocumentAction = 'cleaner-overwrite';
  openConfirmModal();
});

cancelCleanupButton.addEventListener('click', () => {
  cleanupPreview.hidden = true;
});
let history = createHistory(promptSource.value);
let isApplyingHistory = false;
let pendingDocumentAction = null;
let pendingTaggerTags = null;
let pendingCleanupPrompt = null;
let confirmReturnFocus = null;
let lastExportedDocument = {
  title: titleInput.value,
  source: promptSource.value,
};

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

function renderPromptHighlight() {
  const source = promptSource.value;
  const escapedSource = escapeHtml(source);
  const weights = [];

  const markedSource = escapedSource.replace(
    /\([^()\n]*?:\s*-?\d+(?:\.\d+)?\s*\)/g,
    (match) => {
      const index = weights.push(match) - 1;
      return `\u0000${index}\u0000`;
    },
  );

  const highlightedSource = markedSource
    .split(/(\u0000\d+\u0000)/g)
    .map((part) => {
      const placeholder = part.match(/^\u0000(\d+)\u0000$/);

      if (placeholder) {
        return `<span class="syntax-weight">${weights[Number(placeholder[1])]}</span>`;
      }

      if (/^\u0000\d+\u0000$/.test(part)) {
        return part;
      }

      return part.replace(
        /[^,\n]+/g,
        (tag) => `<span class="syntax-tag">${tag}</span>`,
      );
    })
    .join('');

  promptHighlight.innerHTML = highlightedSource + '\n';
}

function makeSafeFilename(title, extension) {
  const safeTitle = title
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/[. ]+$/g, '');

  return `${safeTitle || 'Untitled prompt'}.${extension}`;
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], {
    type: `${mimeType};charset=utf-8`,
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.hidden = true;

  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function showFileMessage(message, isError = false) {
  validationStatus.textContent = message;
  validationStatus.style.color = isError ? '#ff9c9c' : '#a6e6c1';
}

function getDocumentData() {
  return {
    title: titleInput.value,
    source: promptSource.value,
  };
}

function hasUnsavedChanges() {
  const currentDocument = getDocumentData();

  return (
    currentDocument.title !== lastExportedDocument.title ||
    currentDocument.source !== lastExportedDocument.source
  );
}

function markDocumentAsSaved() {
  lastExportedDocument = getDocumentData();
}

function getDefaultDocumentTitle() {
  return currentLanguage === 'zh-CN' ? '未命名 Prompt' : 'Untitled prompt';
}

function localizeDefaultDocumentTitle() {
  const defaultTitles = ['Untitled prompt', '未命名 Prompt'];
  if (!defaultTitles.includes(titleInput.value)) return;

  titleInput.value = getDefaultDocumentTitle();
  if (defaultTitles.includes(lastExportedDocument.title)) {
    lastExportedDocument = { ...lastExportedDocument, title: titleInput.value };
  }
  saveDraft();
}

const DRAFT_STORAGE_KEY = 'prompt-lab-studio-draft';

function saveDraft() {
  try {
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        ...getDocumentData(),
        history,
      }),
    );
  } catch (error) {
    console.error('Unable to save draft:', error);
  }
}


function loadDraft() {
  try {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!savedDraft) {
      return;
    }

    const draft = JSON.parse(savedDraft);

    if (
      typeof draft.title !== 'string' ||
      typeof draft.source !== 'string'
    ) {
      return;
    }

    restoreDocument(draft.title, draft.source);

    if (
      draft.history &&
      Array.isArray(draft.history.past) &&
      typeof draft.history.current === 'string' &&
      Array.isArray(draft.history.future) &&
      draft.history.past.every((item) => typeof item === 'string') &&
      draft.history.future.every((item) => typeof item === 'string') &&
      draft.history.current === draft.source
    ) {
      history = draft.history;

      isApplyingHistory = true;
      promptSource.value = history.current;
      isApplyingHistory = false;

      updateHistoryButtons();
    }

} catch (error) {
  console.error('Unable to load draft:', error);

  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (storageError) {
    console.error('Unable to clear corrupted draft:', storageError);
  }
}
}


function getFilenameTitle(filename) {
  return filename.replace(/\.(json|txt)$/i, '');
}

function restoreDocument(title, source) {

  history = createHistory(source);
  isApplyingHistory = true;
  promptSource.value = history.current;
  cleanerSource.value = promptSource.value;
  titleInput.value = title;
  isApplyingHistory = false;

  renderPromptHighlight();
  renderTitleValidation();
  renderValidationResults();
  updateHistoryButtons();
}

function updateHistoryButtons() {
  undoButton.disabled = history.past.length === 0;
  redoButton.disabled = history.future.length === 0;
}

function findChangedRange(previous, next) {
  let start = 0;

  while (
    start < previous.length &&
    start < next.length &&
    previous[start] === next[start]
  ) {
    start += 1;
  }

  let previousEnd = previous.length;
  let nextEnd = next.length;

  while (
    previousEnd > start &&
    nextEnd > start &&
    previous[previousEnd - 1] === next[nextEnd - 1]
  ) {
    previousEnd -= 1;
    nextEnd -= 1;
  }

  return {
    start,
    end: previousEnd,
    replacement: next.slice(start, nextEnd),
  };
}

function renderTitleValidation() {
  const result = validateDocumentTitle(titleInput.value);

  if (result.valid) {
    titleMessage.textContent = 'Title looks good.';
    titleMessage.style.color = '#71d6a0';
    titleInput.removeAttribute('aria-invalid');
    return;
  }

  titleMessage.textContent = result.error.message;
  titleMessage.style.color = '#ff9c9c';
  titleInput.setAttribute('aria-invalid', 'true');
}

function renderValidationResults() {
  const result = validatePrompt(promptSource.value);
  const warnings = result.warnings;

  validationResults.replaceChildren();

  if (warnings.length === 0) {
    const item = document.createElement('li');
    item.className = 'success-message';
    item.textContent = 'No unmatched parentheses found.';
    validationResults.append(item);

    validationStatus.textContent = 'Validation passed';
    validationStatus.style.color = '#a6e6c1';
    return;
  }

  for (const warning of warnings) {
    const item = document.createElement('li');
    const line = promptSource.value.slice(0, warning.position).split('\n').length;

    item.textContent =
      `${warning.message} Position: ${warning.position + 1} (line ${line}).`;

    validationResults.append(item);
  }

  validationStatus.textContent =
    `${warnings.length} warning${warnings.length === 1 ? '' : 's'} found`;

  validationStatus.style.color = '#d9cfff';
}

titleInput.addEventListener('input', () => {
  renderTitleValidation();
  saveDraft();
});

promptSource.addEventListener('input', () => {
  cleanerSource.value = promptSource.value;
  renderPromptHighlight();

  if (isApplyingHistory) {
    return;
  }

  const nextSource = promptSource.value;
  const previousSource = history.current;

  if (nextSource !== previousSource) {
    const change = findChangedRange(previousSource, nextSource);

    history = applyEdit(
      history,
      change.start,
      change.end,
      change.replacement,
    );
  }

  updateHistoryButtons();
  renderValidationResults();
  saveDraft();
});

promptSource.addEventListener('scroll', () => {
  promptHighlight.scrollTop = promptSource.scrollTop;
  promptHighlight.scrollLeft = promptSource.scrollLeft;
});

validateButton.addEventListener('click', () => {
  renderTitleValidation();
  renderValidationResults();
});

undoButton.addEventListener('click', () => {
  
  history = undo(history);
  
  isApplyingHistory = true;
  promptSource.value = history.current;
  cleanerSource.value = promptSource.value;
  isApplyingHistory = false;
  renderPromptHighlight();  

updateHistoryButtons();
renderValidationResults();
saveDraft();
});

redoButton.addEventListener('click', () => {
  history = redo(history);

  isApplyingHistory = true;
  promptSource.value = history.current;
  cleanerSource.value = promptSource.value;
  isApplyingHistory = false;
  renderPromptHighlight();

updateHistoryButtons();
renderValidationResults();
saveDraft();
});

loadDraft();
localizeDefaultDocumentTitle();
cleanerSource.value = promptSource.value;
renderTitleValidation();
updateHistoryButtons();


function createNewDocument() {newDocumentButton
  restoreDocument(getDefaultDocumentTitle(), '');
  markDocumentAsSaved();
  saveDraft();
  showFileMessage('New document created.');
}

function openConfirmModal() {
  confirmReturnFocus = document.activeElement;

  if (pendingDocumentAction === 'open') {
    confirmModalTitle.textContent = 'Open Another Document?';
    confirmModalMessage.textContent =
      'You have unsaved changes. Do you want to discard them and open another document?';
    confirmContinueButton.textContent = 'Open File';
  } else if (pendingDocumentAction === 'tagger-overwrite') {
    confirmModalTitle.textContent = 'Overwrite the current prompt?';
    confirmModalMessage.textContent =
      'This will replace all content in the Prompt Editor with the currently selected tags. You can undo this action.';
    confirmContinueButton.textContent = 'Overwrite Prompt';
  } else if (pendingDocumentAction === 'cleaner-overwrite') {
    confirmModalTitle.textContent = 'Replace the current prompt?';
    confirmModalMessage.textContent =
      'This will replace all content in the Prompt Editor with the cleaned result. You can undo this action.';
    confirmContinueButton.textContent = 'Replace Prompt';
  } else {
    confirmModalTitle.textContent = 'Create New Document?';
    confirmModalMessage.textContent =
      'You have unsaved changes. Do you want to discard them and create a new document?';
    confirmContinueButton.textContent = 'Create New';
  }

  confirmModal.hidden = false;
  confirmCancelButton.focus();
}

function closeConfirmModal() {
  confirmModal.hidden = true;
  confirmReturnFocus?.focus();
  confirmReturnFocus = null;
}

newDocumentButton.addEventListener('click', () => {
  if (hasUnsavedChanges()) {
    pendingDocumentAction = 'new';
    openConfirmModal();
    return;
  }

  createNewDocument();
});

confirmCancelButton.addEventListener('click', () => {
  pendingDocumentAction = null;
  pendingTaggerTags = null;
  pendingCleanupPrompt = null;
  closeConfirmModal();
});

confirmContinueButton.addEventListener('click', () => {
  const action = pendingDocumentAction;
  const selectedTags = pendingTaggerTags;
  const cleanedPrompt = pendingCleanupPrompt;

  pendingDocumentAction = null;
  pendingTaggerTags = null;
  pendingCleanupPrompt = null;
  closeConfirmModal();

  if (action === 'new') {
    createNewDocument();
  } else if (action === 'open') {
    openFileInput.click();
  } else if (action === 'tagger-overwrite') {
    overwritePromptWithSelectedTaggerTags(selectedTags ?? []);
  } else if (action === 'cleaner-overwrite') {
    applyCleanupToPrompt(cleanedPrompt ?? '');
  }
});


saveJsonButton.addEventListener('click', () => {
  const documentData = getDocumentData();
  const titleResult = validateDocumentTitle(documentData.title);

  if (!titleResult.valid) {
    renderTitleValidation();
    showFileMessage('Cannot save: document title is empty.', true);
    return;
  }

  const content = JSON.stringify(
    {
      format: 'prompt-lab-studio',
      version: 1,
      title: documentData.title,
      source: documentData.source,
    },
    null,
    2,
  );

  downloadTextFile(
    makeSafeFilename(documentData.title, 'json'),
    content,
    'application/json',
  );

  markDocumentAsSaved();
  showFileMessage('JSON document exported.');
});

saveTxtButton.addEventListener('click', () => {
  const documentData = getDocumentData();

  downloadTextFile(
    makeSafeFilename(documentData.title, 'txt'),
    documentData.source,
    'text/plain',
  );

  markDocumentAsSaved();
  showFileMessage('Prompt exported as TXT.');
});

openDocumentButton.addEventListener('click', () => {
  if (hasUnsavedChanges()) {
    pendingDocumentAction = 'open';
    openConfirmModal();
    return;
  }

  openFileInput.click();
});

openFileInput.addEventListener('change', async () => {
  const file = openFileInput.files?.[0];

  if (!file) {
    return;
  }

  try {
    const content = await file.text();
    const extension = file.name.split('.').pop()?.toLowerCase();

    let title;
    let source;

    if (extension === 'json') {
      const data = JSON.parse(content);

      if (
        data === null ||
        typeof data !== 'object' ||
        Array.isArray(data) ||
        data.format !== 'prompt-lab-studio' ||
        data.version !== 1 ||
        typeof data.title !== 'string' ||
        typeof data.source !== 'string'
      ) {
        throw new Error('Invalid Prompt Lab Studio JSON document.');
      }

      const titleResult = validateDocumentTitle(data.title);

      if (!titleResult.valid) {
        throw new Error('The document title must not be empty.');
      }

      title = data.title;
      source = data.source;
    } else if (extension === 'txt') {
      title = getFilenameTitle(file.name);
      source = content;

      if (!validateDocumentTitle(title).valid) {
        title = getDefaultDocumentTitle();
      }
    } else {
      throw new Error('Unsupported file type. Choose a JSON or TXT file.');
    }

    restoreDocument(title, source);
    markDocumentAsSaved();
    saveDraft();
    showFileMessage(`Opened ${file.name}.`);
  } catch (error) {
    showFileMessage(
      error instanceof Error ? error.message : 'Unable to open this file.',
      true,
    );
  } finally {
    openFileInput.value = '';
  }
});

renderPromptHighlight();


let tagSearchTimer;

const tagCategories = {
  0: 'General',
  1: 'Artist',
  3: 'Copyright',
  4: 'Character',
  5: 'Metadata',
};

tagSearchInput.addEventListener('input', () => {
  clearTimeout(tagSearchTimer);

  const query = tagSearchInput.value.trim();

  if (!query) {
    tagSearchResults.textContent = 'Enter a keyword to search tags.';
    return;
  }

  tagSearchResults.textContent = 'Searching...';

  tagSearchTimer = setTimeout(async () => {
    try {
const params = new URLSearchParams({
  'search[name_matches]': `${query}*`,
  'search[hide_empty]': 'true',
  'search[order]': 'count',
  limit: '10',
});

      const response = await fetch(
        `https://danbooru.donmai.us/tags.json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const tags = await response.json();
      tags.sort((a, b) => b.post_count - a.post_count);

      if (tagSearchInput.value.trim() !== query) return;

      if (tags.length === 0) {
        tagSearchResults.textContent = 'No matching tags found.';
        return;
      }

      tagSearchResults.replaceChildren();


tags.forEach((tag) => {
  const item = document.createElement('button');

  item.type = 'button';
  item.className = 'tag-search-result';
  item.textContent =
    `${tag.name} · ${tagCategories[tag.category] ?? 'Other'} · ${tag.post_count.toLocaleString()} posts`;

  item.addEventListener('click', () => {
    const start = promptSource.selectionStart;
    const end = promptSource.selectionEnd;
    const current = promptSource.value;

    const before = current.slice(0, start);
    const after = current.slice(end);

    const separatorBefore =
      before.length > 0 && !/[\s,]$/.test(before) ? ', ' : '';

    const separatorAfter =
      after.length > 0 && !/^[\s,]/.test(after) ? ', ' : '';

    promptSource.setRangeText(
      `${separatorBefore}${tag.name}${separatorAfter}`,
      start,
      end,
      'end',
    );

    promptSource.dispatchEvent(new Event('input', { bubbles: true }));
    promptSource.focus();
  });

  tagSearchResults.appendChild(item);
});

    } catch (error) {
      console.error('Danbooru tag search failed:', error);
      tagSearchResults.textContent =
        'Search failed. Check your internet connection or try again later.';
    }
  }, 400);
});
