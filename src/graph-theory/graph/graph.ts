import cytoscape, { Core } from 'cytoscape'
import { Parser } from '../parser'
import { Node } from '../tree/tree.interface'
import { IEdge, IGraph, IVertex, Visit, GraphData } from './graph.interface'

export class Graph implements IGraph {
  cy: Core
  constructor(tree: Node) {
    /**
     * Use Parser interface to parse tree
     */
    const parser: Parser = (tree: Node, graph?: GraphData, parent?: Node) => {
      // Initialize the graph if not already initialized
      graph = graph || { vertices: [], edges: [] }

      // Add the current node to the graph
      const vertex: IVertex = { id: tree.id, name: tree.name }
      graph.vertices.push(vertex)

      // If there is a parent node, add an edge between them
      if (parent !== undefined) {
        const edge: IEdge = { source: parent.id, target: tree.id }
        graph.edges.push(edge)
      }

      // Iterate through all of the children and add them to the graph
      tree.children.forEach((child) => parser(child, graph, tree))

      return graph
    }

    const parsedData: GraphData = parser(tree)

    /**
     * Initialize cytoscape with parsed data
     */
    this.cy = cytoscape({
      elements: {
        nodes: parsedData.vertices.map((item) => {
          return { data: item }
        }),

        edges: parsedData.edges.map((item) => {
          return { data: item }
        }),
      },
    })
  }

  /**
   * (4) Use cytoscape under the hood
   */
  bfs(visit: Visit<IVertex, IEdge>) {
    this.cy.elements().bfs({
      roots: '#A',
      visit: (v, e) => {
        visit(v.data(), e?.data())
      },
    })
  }

  /**
   * (5) Use cytoscape under the hood
   */
  dfs(visit: Visit<IVertex, IEdge>) {
    this.cy.elements().dfs({
      roots: '#A',
      visit: (v, e) => {
        visit(v.data(), e?.data())
      },
    })
  }
}
