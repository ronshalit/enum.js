enum.js
=======

Implements enumerable objects to Javascript, with usage similar to C# IEnumerable.

Also allows for easy creation of generators / iterators.

"Instance" Methods
===================

select 

where 

toArray 

any 

count 

sum 

first 

last 

orderBy 

groupBy 

toRows 

"Static" Methods 
=================

Enum.newRange : generator that represents a range from i to j 

Enum.fromArray : wraps an array 

Examples
========

var arr = [3,4,5,6];

var e = Enum.fromArray(arr);

var e456 = e.where(function(i){ return i>3;} );

var e567 = e456.select(function(i){ return i+1;} );

// log: 4 5 6

while(e456.n())
 
 console.log(e456.g());

var arr567 = e567.toArray(); // returns [5, 6, 7]

