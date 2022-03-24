import { fetchNodes } from "./api.js";
import Breadcrumb from "./components/Breadcrumb.js";
import Nodes from "./components/Nodes.js";

const $app = document.querySelector(".App");
const $loading = document.querySelector(".Modal.Loading");
const $viewer = document.querySelector(".Modal.ImageViewer");

class App {
  state = {
    nodes: [],
    stack: [{ id: null, name: "root" }],
  };

  constructor() {
    this.breadcrumb = new Breadcrumb({
      $parent: $app,
      initialState: { items: this.state.stack },
      onClickItem: this.moveHistory.bind(this),
    });
    this.nodes = new Nodes({
      $parent: $app,
      onClickNode: this.handleClickNode.bind(this),
    });
    this.getNodes(null);
    $viewer.onclick = () => {
      $viewer.style.display = "none";
    };
    const $content = $viewer.querySelector(".content");
    $content.onclick = (e) => {
      e.stopPropagation();
    };
  }

  setState(nextState) {
    this.state = nextState;
    this.nodes.setState({
      isRoot: nextState.stack.length === 1,
      nodes: nextState.nodes,
    });
    this.breadcrumb.setState({
      items: nextState.stack,
    });
  }

  async getNodes(nodeId) {
    this.setLoading(true);
    try {
      const nodes = await fetchNodes(nodeId);
      this.setState({ ...this.state, nodes });
    } catch (error) {
      alert(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    $loading.style.display = loading ? "block" : "none";
  }

  handleClickNode({ type, id, filePath, name }) {
    if (type === "FILE") {
      this.viewImage(filePath);
    } else if (type === "DIRECTORY") {
      this.getNodes(id);
      this.pushHistory({ id, name });
    } else {
      this.getNodes(this.state.stack[this.state.stack.length - 2]?.id);
      this.popHistory();
    }
  }

  pushHistory({ id, name }) {
    this.setState({
      ...this.state,
      nodes: [],
      stack: [...this.state.stack, { id, name }],
    });
  }

  popHistory() {
    this.setState({
      ...this.state,
      nodes: [],
      stack: this.state.stack.slice(0, this.state.stack.length - 1),
    });
  }

  moveHistory(index) {
    this.getNodes(this.state.stack[index].id);
    this.setState({
      ...this.state,
      nodes: [],
      stack: this.state.stack.slice(0, index + 1),
    });
  }

  viewImage(filePath) {
    const $img = $viewer.querySelector("img");
    $img.src = `https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public${filePath}`;
    $viewer.style = "block";
  }
}

export default App;
