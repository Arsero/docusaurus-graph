const templates = {
  headGraph: [
    '<script src="https://cdn.jsdelivr.net/npm/d3@6.2.0/dist/d3.min.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/force-graph@1.40.3/dist/force-graph.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/note-graph@latest/dist/note-graph.umd.js"></script>',
  ],
  styleGraph: `
  #open-graph-btn {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
    color: var(--ifm-navbar-link-color);
    transition: color var(--ifm-transition-fast) var(--ifm-transition-timing-default);
  }

  #open-graph-btn:hover {
    color: var(--ifm-link-color);
  }

  @media screen and (max-width: 996px) {
    #open-graph-btn {
      justify-content: flex-start;
      padding-left: 1em;
    }
  }

  #graph-container {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  #graph-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 1;
  }

  #close-graph-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      font-size: small;
      font-weight: bold;
      z-index: 2;
    }

    canvas {
      margin: 0px auto;
    }

    .force-graph-container .graph-tooltip {
      transform: none !important;
    }
  `,
  graphButton: `
    <button id="open-graph-btn" title="Show Graph Visualisation" type="button"
    aria-label="Show Graph Visualisation" aria-live="polite" onclick="openGraph()">
      <svg viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
        <path d="M512 512m-125.866667 0a125.866667 125.866667 0 1 0 251.733334 0 125.866667 125.866667 0 1 0-251.733334 0Z"></path>
        <path d="M512 251.733333m-72.533333 0a72.533333 72.533333 0 1 0 145.066666 0 72.533333 72.533333 0 1 0-145.066666 0Z"></path>
        <path d="M614.4 238.933333c0 4.266667 2.133333 8.533333 2.133333 12.8 0 19.2-4.266667 36.266667-12.8 51.2 81.066667 36.266667 138.666667 117.333333 138.666667 211.2C742.4 640 640 744.533333 512 744.533333s-230.4-106.666667-230.4-232.533333c0-93.866667 57.6-174.933333 138.666667-211.2-8.533333-14.933333-12.8-32-12.8-51.2 0-4.266667 0-8.533333 2.133333-12.8-110.933333 42.666667-189.866667 147.2-189.866667 273.066667 0 160 130.133333 292.266667 292.266667 292.266666S804.266667 672 804.266667 512c0-123.733333-78.933333-230.4-189.866667-273.066667z"></path>
        <path d="M168.533333 785.066667m-72.533333 0a72.533333 72.533333 0 1 0 145.066667 0 72.533333 72.533333 0 1 0-145.066667 0Z"></path>
        <path d="M896 712.533333m-61.866667 0a61.866667 61.866667 0 1 0 123.733334 0 61.866667 61.866667 0 1 0-123.733334 0Z"></path>
        <path d="M825.6 772.266667c-74.666667 89.6-187.733333 147.2-313.6 147.2-93.866667 0-181.333333-32-249.6-87.466667-10.666667 19.2-25.6 34.133333-44.8 44.8C298.666667 942.933333 401.066667 981.333333 512 981.333333c149.333333 0 281.6-70.4 366.933333-177.066666-21.333333-4.266667-40.533333-17.066667-53.333333-32zM142.933333 684.8c-25.6-53.333333-38.4-110.933333-38.4-172.8C104.533333 288 288 104.533333 512 104.533333S919.466667 288 919.466667 512c0 36.266667-6.4 72.533333-14.933334 106.666667 23.466667 2.133333 42.666667 10.666667 57.6 25.6 12.8-42.666667 19.2-87.466667 19.2-132.266667 0-258.133333-211.2-469.333333-469.333333-469.333333S42.666667 253.866667 42.666667 512c0 74.666667 17.066667 142.933333 46.933333 204.8 14.933333-14.933333 32-27.733333 53.333333-32z"></path>
      </svg>
    </button>
    `,
  scriptGraph: `
    let graphViewGlobal = null;
    async function initGraphView() {
      const notes = await (
        await fetch('/docugraph.json')
      ).json();

      const graphModel = new NOTE_GRAPH.NoteGraphModel(notes);
      graphViewGlobal = new NOTE_GRAPH.NoteGraphView({
        container: document.getElementById('graphview-container'),
        graphModel,
        enableNodeDrag: true,
        width: 800,
        height: 600,
      });
    }
    
    window.onload = function () {
      initGraphView();
    };

    const graphContainer = document.getElementById('graph-container');
    const graphOverlay = document.getElementById('graph-overlay');

    function openGraph() {
      graphContainer.style.display = 'block';
      graphOverlay.style.display = 'block';
      graphViewGlobal.forceGraph.zoomToFit(1000, 20);
    }

    graphOverlay.addEventListener('click', closeGraph);
    function closeGraph() {
      graphContainer.style.display = 'none';
      graphOverlay.style.display = 'none';
    }
    `,
  containerGraph: `
    <div id="graph-overlay"></div>
    <div id="graph-container" style="color:black">
      <div id="close-graph-btn" onclick="closeGraph()">
        <div style="padding: 5px">X</div>
      </div>
      <div>
        <h1 style="text-align: center">Graph View</h1>
        <div id="graphview-container" style="display: inline-block;margin: 0 auto"></div>
      </div>
    </div>
    `,
};

export default templates;
