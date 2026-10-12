/** 可续跑遍历器。编辑/内容区由引擎保护，同时允许恢复移入其中的旧译文。 */
export function* walk(root: Node): Generator<Node> {
  if (!root.isConnected) return;
  if (root.nodeType === Node.TEXT_NODE) { yield root; return; }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const hardSkip = 'script, style, noscript, iframe';
  if ((root as Element).matches(hardSkip)) return;
  yield root;
  const walker = root.ownerDocument!.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: node => node.nodeType === Node.ELEMENT_NODE && (node as Element).matches(hardSkip)
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  let node: Node | null;
  while ((node = walker.nextNode())) yield node;
}
