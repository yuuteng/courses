// Shortcuts
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

// Exécute la fonction 'onLoad' lorsque la page est chargée
document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
  // Build the table once, without a filter
  updateScores(computeScoreRows());

  // On change in the #filter-scores input, compute the table again
  // by filtering rows
  $('#filter-scores').addEventListener('input', filterScores);

  // A click on #search-match triggers populates the table with
  // matches from the database
  $('#search-match').addEventListener('click', updateSearchResults);
}

function updateScores(rows) {
  replaceNode($('#scores tbody'), createScoreFragment(rows));
}

function filterScores(event) {
  var playerFilter = event.target.value;

  var rows = computeScoreRows();

  // Filter rows when playerFilter is a non-empty string
  if (playerFilter.length > 0) {
    rows = rows.filter(function(r) {
      return r.name.toLowerCase().contains(playerFilter.toLowerCase());
    });
  }

  updateScores(rows);
}

// Create the DOM elements from the data
function createScoreFragment(rows) {
  var f = document.createDocumentFragment();
  rows.forEach(function(r) {
    var tr = document.createElement('tr');
    tr.appendChild(td(r.name));
    tr.appendChild(td(r.wins));
    tr.appendChild(td(r.draws));
    tr.appendChild(td(r.defeats));
    tr.appendChild(td(r.points));
    f.appendChild(tr);
  });

  return f;
}

function computeScoreRows() {
  // Create an empty row with zeroes for each player
  var rows = window.players.map(function(p) {
    return {
      name: p.name,
      wins: 0,
      defeats: 0,
      draws: 0,
      points: 0
    };
  });

  // Sum the wins, draws defeats from each match
  window.matches.forEach(function(m) {
    if (m.score1 > m.score2) {
      rows[m.player1].wins += 1;
      rows[m.player2].defeats += 1;
    }

    else if (m.score2 > m.score1) {
      rows[m.player2].wins += 1;
      rows[m.player1].defeats += 1;
    }

    else {
      rows[m.player1].draws += 1;
      rows[m.player2].draws += 1;
    }
  });

  // Compute points for each player
  // Points = Wins * 3 + Draws
  rows.forEach(function(r) {
    r.points = r.wins * 3 + r.draws;
  });

  // Sort rows by their value in points
  rows.sort(function(a, b) {
    return b.points - a.points;
  });

  return rows;
}

function updateSearchResults() {
  var player1Filter = $('#player1').value;
  var player2Filter = $('#player2').value;

  // Inputs should be non-empty
  if (player1Filter.length === 0 || player2Filter.length === 0) {
    return;
  }

  var rows = computeSearchResults(player1Filter, player2Filter);

  replaceNode($('#results tbody'), createSearchResultsFragment(rows));
}

function createSearchResultsFragment(rows) {
  var f = document.createDocumentFragment();

  rows.forEach(function(r) {
    var tr = document.createElement('tr');

    var name1 = td(r.player1);
    name1.classList.add('player1');
    tr.appendChild(name1);

    var score1 = td(r.score1);
    score1.classList.add('score1');
    tr.appendChild(score1);

    tr.appendChild(td('—'));

    var score2 = td(r.score2);
    score2.classList.add('score2');
    tr.appendChild(score2);

    var name2 = td(r.player2);
    name2.classList.add('player2');
    tr.appendChild(name2);

    f.appendChild(tr);
  });

  return f;
}

function computeSearchResults(player1Filter, player2Filter) {
  // Create rows for all matches in the database
  var rows = window.matches.map(function(m) {
    return {
      player1: window.players[m.player1].name,
      player2: window.players[m.player2].name,
      score1: m.score1,
      score2: m.score2,
    };
  });

  // Filter rows by player name
  rows = rows.filter(function(r) {
    // Match using lowercase strings for better usability
    var p1 = r.player1.toLowerCase();
    var p2 = r.player2.toLowerCase();
    var left = player1Filter.toLowerCase();
    var right = player2Filter.toLowerCase();

    // Order of the player names in the input fields does not matter
    return (p1.contains(left) && p2.contains(right))
      || (p1.contains(right) && p2.contains(left));
  });

  return rows;
}

// Shortcut function to create a 'td' element
function td(content) {
  var e = document.createElement('td');
  e.textContent = content;
  return e;
}

// Shortcut function to empty a DOM node
function clearNode(n) {
  while (n.firstChild != null) {
    n.removeChild(n.firstChild);
  }
}

// Shortcut function to replace the contents of a node by a DOM fragment
function replaceNode(node, fragment) {
  clearNode(node);
  node.appendChild(fragment);
}
