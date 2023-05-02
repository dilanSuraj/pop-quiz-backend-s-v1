import QueueElement from "./QueueElement";

export default class PriorityQueue {
  constructor(private items = []) {}
  /**
   *
   * @param item
   * @param priority
   */
  public insert(item: any, priority: any) {
    var qElement = new QueueElement(item, priority);
    var contain = false;

    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }

    if (!contain) {
      this.items.push(qElement);
    }
  }

  /**
   *
   * @returns and @remove Queue element with highest priority - Lowest priority number
   */
  public pop = () => (this.isEmpty() ? "Underflow" : this.items.shift());

  /**
   *
   * @return Queue element with highest priority
   */
  public peek = () => (this.isEmpty() ? "No elements in Queue" : this.items[0]);

  /**
   *
   * @return boolean => true if the priority queue is empty, false otherwise
   */
  public isEmpty = (): boolean => this.items.length == 0;

  print(): string {
    var str = "";
    for (var i = 0; i < this.items.length; i++)
      str += this.items[i].element + " ";
    return str;
  }
}
