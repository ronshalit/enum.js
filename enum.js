function Enum(n, g, r) { this.n = n; this.g = g;this.r = r; }
Enum.prototype.select = function (f) { var t = this; return new Enum(function () { return t.n() }, function () { var e = t.g(); return typeof e == "undefined" ? e : f(e); }, function () { t.r(); }); }
Enum.prototype.where = function (f) { var t = this; var next = function () { var n = t.n(); if (!n) return undefined; var g = t.g(); if (f(g)) return g; return next(); }; return new Enum(next, function () { return t.g() }, function () { t.r(); }); }
Enum.prototype.toArray = function () { var a = []; while (this.n()) { a.push(this.g()) }; this.r(); return a; }
Enum.prototype.any = function () {var result = this.n();this.r();return result;}
Enum.prototype.count = function () { return this.toArray().length; }
Enum.prototype.sum = function (fn) { var res = 0; while (this.n()) { res += fn(this.g()); }; this.r(); return res; }
Enum.prototype.first = function () { var res = null; if (this.n()) res = this.g(); this.r(); return res; }
Enum.prototype.last = function () { var res = this.toArray(); return res[res.length - 1]; }
Enum.prototype.orderBy = function (fn) {
    var keys = this.select(fn).toArray().sort();
    var grouped = this.groupBy(fn);
    var current = undefined;
    var currentGroup = null;
    var i = -1;
    var reset = function () { grouped.r(); i = -1 };
    var next = function () {
        if (currentGroup == null) // before the first group
            return !(++i >= keys.length || !(currentGroup = grouped.where(function (g) { return g.key == keys[i] }).first()).n());
        return currentGroup.n() || ++i < keys.length && (currentGroup = grouped.where(function (g) { return g.key == keys[i] }).first()).n(); // if the group is done, go to the next group
    }
    var get = function () {
        return currentGroup == null ? undefined : currentGroup.g(); 
    }
    var reset = function () { currentGroup = null; i = -1; }
    return new Enum(next, get, reset);
}
Enum.prototype.groupBy = function (fn) {
    var dict = {};
    var arr = [];
    while (this.n()) {
        var elem = this.g();
        var key = fn(elem);
        if (typeof dict[key] === 'undefined') {
            var a = [];
            var en = Enum.fromArray(a);
            en.key=key;
            dict[key] = a;
            arr.push(en);
        }
        dict[key].push(elem);
    }
    this.r();
    return Enum.fromArray(arr);
}

Enum.prototype.each(fn){
    while(this.n()){
        fn(this.g());
    }
    this.r();
}

// Utility method that creates rows out of two dimentional array. 
// e.g::     Enum.fromArray([[1,2,3],[4,5,6]]).toRows() 
//  returns  <tr> <td>1</td> <td>2</td> <td>3</td> </tr> 
//           <tr> <td>4</td> <td>5</td> <td>6</td> </tr> 
Enum.prototype.toRows = // converts an array of rows (where each row is an array of items) into HTML code
    function () {
        return "<tr>"
                     + this // create an enumerator object
                          .select(function (row) { return "<td>" + row.join("</td><td>") + "</td>"; }) // convert each row to a string of <td>item0</td> <td>item1</td> ...
                          .toArray() // conver back to array
                          .join("</tr><tr>") // join all rows to one string
             + "</tr>";
    }

//*********** static methods ***************//

// range generator
Enum.newRange = function (i, j) { i--; return new Enum(function () { return i++ < j }, function () { return i }, function () { }) }
// utility to wrap an array with an enumerable object
Enum.fromArray = function (arr) { var t = arr; var i = -1; return new Enum(function () { return ++i < t.length }, function () { return t[i] }, function () { i = -1; }) }
