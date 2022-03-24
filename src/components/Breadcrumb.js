class Breadcrumb {
  constructor({ $parent, initialState, onClickItem }) {
    const $target = document.createElement("nav");
    $target.className = "Breadcrumb";
    $target.onclick = this.handleClickItem.bind(this);
    this.$target = $target;
    $parent.appendChild($target);
    this.onClickItem = onClickItem;
    this.setState(initialState);
  }

  state = {
    items: [],
  };

  setState(nextState) {
    this.state = nextState;
    this.render();
  }
  handleClickItem(e) {
    const $item = e.target.closest("div");
    const { index } = $item.dataset;
    if (index === null && index == this.state.items.length - 1) {
      return;
    }
    this.onClickItem(Number(index));
  }

  render() {
    this.$target.innerHTML = `
      ${this.state.items
        .map(
          ({ name }, index) => `
        <div data-index="${index}">${name}</div>
      `
        )
        .join("")}
    `;
  }
}

export default Breadcrumb;
