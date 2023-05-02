import PriorityQueue from "./PriorityQueue";

let queue = new PriorityQueue();

// Validate if the Queue is empty
console.log(queue.isEmpty());

// Retrieve last inserted element in the Queue
console.log(queue.peek());

// Insert elements to the Queue
queue.insert("Elephant", 2);
queue.insert("Tiger", 1);
queue.insert("Anaconda", 1);
queue.insert("Lion", 2);
queue.insert("Zebra", 3);


// prints Tiger
console.log(queue.peek().element);

// [Tiger Anaconda Elephant Lion Zebra]
//print Tiger
console.log(queue.pop().element);

// Adding Cobra
queue.insert("Cobra", 2);

// prints [Anaconda Elephant Lion Cobra Zebra]
console.log(queue.print());