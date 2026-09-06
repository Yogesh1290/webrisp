/**
 * Webrisp Trie Router
 * A highly optimized Radix Trie based router.
 * This provides O(k) routing performance (where k is the path length),
 * vastly outperforming standard linear regex loops used by Express.
 */

export class TrieNode<T> {
  children: Record<string, TrieNode<T>> = {};
  handlers: Record<string, T> = {};
  paramName: string | null = null;
  wildcardChild: TrieNode<T> | null = null;

  insert(method: string, parts: string[], handler: T, index = 0) {
    if (index === parts.length) {
      this.handlers[method] = handler;
      return;
    }

    const part = parts[index];

    if (part.startsWith(':')) {
      if (!this.wildcardChild) {
        this.wildcardChild = new TrieNode<T>();
        this.wildcardChild.paramName = part.slice(1);
      }
      this.wildcardChild.insert(method, parts, handler, index + 1);
    } else {
      if (!this.children[part]) {
        this.children[part] = new TrieNode<T>();
      }
      this.children[part].insert(method, parts, handler, index + 1);
    }
  }

  search(method: string, parts: string[], index = 0, params: Record<string, string> = {}): { handler: T; params: Record<string, string> } | null {
    if (index === parts.length) {
      const handler = this.handlers[method] || this.handlers['ALL'];
      return handler ? { handler, params } : null;
    }

    const part = parts[index];

    // Static match
    if (this.children[part]) {
      const result = this.children[part].search(method, parts, index + 1, params);
      if (result) return result;
    }

    // Dynamic param match
    if (this.wildcardChild) {
      params[this.wildcardChild.paramName!] = part;
      const result = this.wildcardChild.search(method, parts, index + 1, params);
      if (result) return result;
    }

    return null;
  }
}

export class TrieRouter<T> {
  private root = new TrieNode<T>();

  add(method: string, path: string, handler: T) {
    const parts = path.split('/').filter(Boolean);
    this.root.insert(method, parts, handler);
  }

  match(method: string, path: string) {
    const parts = path.split('/').filter(Boolean);
    return this.root.search(method, parts);
  }
}
