// Executes the 'onLoad' function after loading the page
$(onLoad)

function onLoad() {
  // On change in the #filter-friends input, compute the table again by
  // filtering rows

  // TODO

  // On click on TH elements, sort the table by the column value.

  // TODO
}

function filterFriends() {
  var filter = this.value
  var $rows = $('#friends tbody tr')

  // Add the 'hide' class to all friends whose name do not contain the string
  // `filter`.  Use `stringContains` below.

  // TODO
}

// Return true iff STR contains R as a substring.  Ignores case.
function stringContains(str, r) {
  return str.toLowerCase().indexOf(r.toLowerCase()) > -1
}

function sortByField(field) {
  // Get the rows as an array

  // TODO

  // Sort the rows in place using `Array.sort` and the comparator below.

  // TODO

  // Put them back in the document using `append`.

  // TODO
}

// Return a comparator for be used by Array.sort that compares two DOM elements
// based on the value of their attribute named `data-FIELD` using the less-than
// (`<`) operator.
function compareField(field) {
  // See http://devdocs.io/javascript/global_objects/array/sort for how to write
  // a comparator.
  return function(a, b) {
    var na = $(a).data(field)
    var nb = $(b).data(field)
    if (na < nb)
      return -1
    else if (na > nb)
      return 1
    else
      return 0
  }
}
