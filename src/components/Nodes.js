class Nodes {
  constructor({ $parent, onClickNode }) {
    const $target = document.createElement("div");
    $target.className = "Nodes";
    $parent.appendChild($target);
    this.$target = $target;
    this.$target.onclick = this.handleClickNode.bind(this);
    this.onClickNode = onClickNode;
  }

  state = {
    nodes: [],
    isRoot: false,
  };

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  handleClickNode(e) {
    const $node = e.target.closest(".Node");
    if (!$node) return;
    this.onClickNode($node.dataset);
  }

  render() {
    this.$target.innerHTML =
      this.state.nodes.length > 0
        ? `
      ${
        !this.state.isRoot
          ? `
        <div class="Node" data-type="PREV">
          <img src="./assets/prev.png" />
        </div>
      `
          : ""
      }
      ${this.state.nodes
        .map(
          ({ id, name, type, filePath }) => `
        <div class="Node" data-id="${id}" data-type="${type}" data-file-path="${filePath}" data-name="${name}">
          <img src="./assets/${
            type === "DIRECTORY" ? "directory" : "file"
          }.png">
          <div>${name}</div>
        </div>
      `
        )
        .join("")}
    `
        : "";
  }
}

export default Nodes;
